from fastapi import APIRouter, HTTPException, Request
from app.core.supabase_client import supabase
import logging
import statistics
from typing import Dict, Any, List
import math
from difflib import SequenceMatcher

def is_similar_name(name_a, name_b, threshold=0.75):
    """Vergelijkt twee namen op basis van gelijkenis, onafhankelijk van 'Bank', hoofdletters etc."""
    def clean(s):
        return s.lower().replace("bank", "").replace("belgië", "").strip()
    
    return SequenceMatcher(None, clean(name_a), clean(name_b)).ratio() >= threshold

router = APIRouter(tags=["matching"])

@router.post("/match-diensten-enhanced")
async def match_diensten_enhanced(user_preferences: Dict[str, Any]):
    """
    ENHANCED Match diensten - Multi-criteria scoring met gewogen factoren + BANK FILTERING
    """
    try:
        logging.info(f"Enhanced matching aanvraag: {user_preferences}")
        
        # Extract user preferences
        type_dienst = user_preferences.get("type_dienst")
        bedrag = user_preferences.get("bedrag", 0)
        bank_filter = user_preferences.get("bank_filter")  # NEW: Bank filtering
        
        logging.info(f"🔍 DEBUG: Received bedrag: {bedrag} (type: {type(bedrag)})")
        logging.info(f"🏦 DEBUG: Bank filter: {bank_filter}")
        
        kosten_belangrijk = user_preferences.get("kosten_belangrijkheid", "geen_voorkeur")
        duurzaamheid_belangrijk = user_preferences.get("duurzaamheid_belangrijkheid", "geen_voorkeur")
        begeleiding_belangrijk = user_preferences.get("begeleiding_belangrijkheid", "geen_voorkeur")
        functionaliteiten_belangrijk = user_preferences.get("functionaliteiten_belangrijkheid", "geen_voorkeur")
        rendement_belangrijk = user_preferences.get("rendement_belangrijkheid", "geen_voorkeur")
        
        # Type mapping van gebruiker clusters naar database waarden
        type_mapping = {
            "Doe-het-zelf": ["Brokerage", "Execution Only"],
            "Samen of laten beleggen": ["Adviserend beheer", "Vermogensbeheer"], 
            "Pensioensparen": ["Pensioensparen"]
        }
        
        # Stap 1: Filter diensten op type en status
        filters = "status=eq.actief"
        if type_dienst and type_dienst in type_mapping:
            db_types = type_mapping[type_dienst]
            type_filter = ",".join([f'"{t}"' for t in db_types])
            filters += f"&type_aanbod=in.({type_filter})"
        
        # NEW: Add bank filtering to database query
        if bank_filter:
            filter_type = bank_filter.get('type')
            banks = bank_filter.get('banks', [])
            
            if filter_type == 'include' and banks:
                # Only include specified banks
                bank_filter_str = ",".join([f'"{bank}"' for bank in banks])
                filters += f"&naam_aanbieder=in.({bank_filter_str})"
                logging.info(f"🏦 Including only banks: {banks}")
                
            elif filter_type == 'exclude' and banks:
                # Exclude specified banks
                bank_filter_str = ",".join([f'"{bank}"' for bank in banks])
                filters += f"&naam_aanbieder=not.in.({bank_filter_str})"
                logging.info(f"🏦 Excluding banks: {banks}")
        
        diensten = await supabase.select("diensten", f"*&{filters}")
        logging.info(f"Gevonden {len(diensten)} diensten van type {type_dienst} (na bank filtering)")
        
        # Stap 2: Filter op minimum bedrag
        filtered_diensten = []
        for dienst in diensten:
            minimum = dienst.get("minimum")
            if minimum is None or bedrag >= minimum:
                filtered_diensten.append(dienst)
        logging.info(f"🔍 DEBUG: First few diensten minimums: {[(d.get('naam_aanbieder'), d.get('minimum')) for d in diensten[:3]]}")
        logging.info(f"🔍 DEBUG: After bedrag filter: {len(filtered_diensten)} diensten remaining")
        logging.info(f"Na bedrag filtering: {len(filtered_diensten)} diensten over")
        
        if not filtered_diensten:
            return {
                "success": True,
                "matches": [],
                "total_found": 0,
                "message": "Geen diensten gevonden die voldoen aan uw criteria"
            }

        # Stap 3: Bulk data ophalen voor alle benodigde tabellen
        dienst_ids = [d.get("dienst_id") for d in filtered_diensten]
        dienst_ids_str = ",".join(map(str, dienst_ids))
        
        # Haal alle benodigde data op in bulk queries
        all_kosten = await supabase.select("kosten", f"*&dienst_id=in.({dienst_ids_str})")
        all_functionaliteiten = await supabase.select("functionaliteiten", f"*&dienst_id=in.({dienst_ids_str})")
        all_rendementen = await supabase.select("rendementen", f"*&dienst_id=in.({dienst_ids_str})")
        
        # Create lookups
        kosten_lookup = {k['dienst_id']: k for k in all_kosten}
        functionaliteiten_lookup = {f['dienst_id']: f for f in all_functionaliteiten}
        rendementen_lookup = {r['dienst_id']: r for r in all_rendementen}
        
        logging.info(f"Data opgehaald voor {len(filtered_diensten)} diensten")
        
        # Stap 4: Bereken percentiel-based scores voor TCO en rendement
        tco_scores = calculate_percentile_scores([kosten_lookup.get(d['dienst_id'], {}).get('tco') for d in filtered_diensten], reverse=True)
        rendement_scores = calculate_percentile_scores([rendementen_lookup.get(d['dienst_id'], {}).get('rendement_5j') for d in filtered_diensten], reverse=False)
        
        # Stap 5: Bereken gewogen scores voor elke dienst
        matches = []
        for i, dienst in enumerate(filtered_diensten):
            dienst_id = dienst.get("dienst_id")
            
            # Haal data op
            kosten_data = kosten_lookup.get(dienst_id, {})
            functionaliteiten_data = functionaliteiten_lookup.get(dienst_id, {})
            rendement_data = rendementen_lookup.get(dienst_id, {})
            
            # Bereken individuele scores
            scores = {
                'duurzaamheid': dienst.get('score_duurzaamheid', 5),
                'begeleiding': dienst.get('score_persoonlijke_begeleiding', 5),
                'functionaliteiten': functionaliteiten_data.get('score_functionaliteiten', 5),
                'kosten': tco_scores[i] if tco_scores[i] is not None else 5,
                'rendement': rendement_scores[i] if rendement_scores[i] is not None else 5
            }
            
            # Bereken gewichten op basis van gebruikersvoorkeuren
            gewichten = {
                'duurzaamheid': get_weight(duurzaamheid_belangrijk),
                'begeleiding': get_weight(begeleiding_belangrijk),
                'functionaliteiten': get_weight(functionaliteiten_belangrijk),
                'kosten': get_weight(kosten_belangrijk),
                'rendement': get_weight(rendement_belangrijk)
            }
            
            # Bereken gewogen totaalscore
            total_score = calculate_weighted_score(scores, gewichten)
            
            # NEW: Apply bank boost if specified
            if bank_filter and bank_filter.get('type') == 'boost':
                boosted_banks = bank_filter.get('banks', [])
                if any(bank in dienst.get('naam_aanbieder', '') for bank in boosted_banks):
                    total_score *= 1.1  # 10% boost for preferred banks
                    logging.info(f"🚀 Applied boost to {dienst.get('naam_aanbieder')}")
            
            # Converteer naar percentage (scores zijn 1-10, gewichten sommeren tot 1.0)
            match_score = score_to_match_percentage(total_score)
            
            match = {
                "id": f"dienst_{dienst_id}",
                "name": dienst.get("naam_aanbieder", "Onbekende aanbieder"),
                "logo": f"{dienst.get('naam_aanbieder', 'default').lower().replace(' ', '_')}.svg",
                "description": f"{dienst.get('type_aanbod')} van {dienst.get('naam_aanbieder')}",
                "strengths": parse_db_strengths(dienst.get("sterktes", "")),
                "weaknesses": parse_db_weaknesses(dienst.get("zwaktes", "")),
                "matchScore": match_score,
                "rating": dienst.get("sterren_score", 0),
                "details": {
                    "minimum_bedrag": dienst.get("minimum"),
                    "tco": kosten_data.get("tco"),
                    "rendement_5j": rendement_data.get("rendement_5j"),
                    "sterren_score": dienst.get("sterren_score"),
                    "kenmerken": dienst.get("kenmerken"),
                    "scores": scores,
                    "gewichten": gewichten,
                    "total_score": total_score
                }
            }
            matches.append(match)
        
        # Sorteer op matchScore
        matches.sort(key=lambda x: x["matchScore"], reverse=True)
        
        return {
            "success": True,
            "matches": matches[:30],  # Allemaal opmaken om te kunnen boosten na top 3, enkel eerste 3 worden getoond in de front
            "total_found": len(matches),
            "filters_applied": {
                "type_dienst": type_dienst,
                "bedrag": bedrag,
                "bank_filter": bank_filter,  # NEW: Include bank filter info
                "gewichten": {
                    "kosten": get_weight(kosten_belangrijk),
                    "duurzaamheid": get_weight(duurzaamheid_belangrijk),
                    "begeleiding": get_weight(begeleiding_belangrijk),
                    "functionaliteiten": get_weight(functionaliteiten_belangrijk),
                    "rendement": get_weight(rendement_belangrijk)
                }
            }
        }
        
    except Exception as e:
        logging.error(f"Error in enhanced matching: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Enhanced matching error: {str(e)}")

@router.post("/recalculate-matches")
async def recalculate_matches(request: Request):
    """
    Herbereken matches met echte score aanpassingen
    Gebruikt de bestaande match_diensten_enhanced functie
    """
    try:
        # Parse JSON body handmatig
        request_data = await request.json()
        print("🔄 RECALCULATE MATCHES ENDPOINT CALLED!")
        print(f"📊 Request data: {request_data}")
        
        # Haal originele user preferences op
        original_preferences = request_data.get("original_preferences", {})
        impacts = request_data.get("impacts", [])
        
        print(f"🎯 Original preferences: {original_preferences}")
        print(f"💥 Impacts to apply: {impacts}")
        
        # STAP 1: Haal originele matches op via bestaande functie
        print("🎯 Getting original matches...")
        original_response = await match_diensten_enhanced(original_preferences)
        
        if not original_response.get("success"):
            raise HTTPException(status_code=400, detail="Kan originele matches niet ophalen")
        
        original_matches = original_response.get("matches", [])
        print(f"📋 Found {len(original_matches)} original matches")
        
        # STAP 2: Bereken gewicht aanpassingen
        weight_adjustments = {}
        preferred_match_id = None
        boost_factor = 1.0
        
        print(f"🔍 DETAILED IMPACT DEBUGGING:")
        print(f"   Raw impacts: {impacts}")
        print(f"   Type of impacts: {type(impacts)}")

        for i, impact in enumerate(impacts):
            print(f"   Impact {i+1}: {impact}")
            print(f"   Impact type: {type(impact)}")
            if isinstance(impact, dict):
                for key, value in impact.items():
                    print(f"     Key: '{key}' = '{value}' (type: {type(value)})")
        
        for impact in impacts:
            print(f"🔧 Processing impact: {impact}")
            
            if not isinstance(impact, dict):
                print(f"   ⚠️ Skipping non-dict impact: {type(impact)}")
                continue
            
            try:
                for key, value in impact.items():
                    if key.startswith('weight_'):
                        criteria = key.replace('weight_', '')
                        weight_adjustments[criteria] = value
                        print(f"   ✅ Weight adjustment: {criteria} = {value}")
                    
                    elif key == 'preferred_match':
                        preferred_match_id = value
                        boost_factor = 1.15  # 15% bonus voor preferred match
                        print(f"   ⭐ Preferred match: {value} (boost: {boost_factor})")
                    
                    elif key == 'boost_similar_attributes':
                        if value:
                            boost_factor = 1.1
                            print(f"   📈 Boost similar attributes: {boost_factor}")
                    
                    elif key == 'reduce_similar_attributes':
                        if value:
                            # Voor reduce scenario - verlaag scores van slechtere matches
                            boost_factor = 0.95  # 5% penalty voor lagere matches
                            print(f"   📉 Reduce similar attributes: {boost_factor}")
                    
                    elif key == 'neutral_weight':
                        if value:
                            # Neutral weight - geen aanpassingen, behoud originele scores
                            boost_factor = 1.0
                            print(f"   ⚖️ Neutral weight applied: no score changes")
                    
                    elif key == 'lower_thresholds':
                        if value:
                            # Voor low scores scenario - probeer meer matches te vinden
                            print(f"   🔽 Lower thresholds requested")
                            modified_preferences = original_preferences.copy()
                            # Verlaag minimum scores in preferences
                            for pref_key in modified_preferences:
                                if 'belangrijkheid' in pref_key and modified_preferences[pref_key] == 'heel_belangrijk':
                                    modified_preferences[pref_key] = 'zeer_belangrijk'
                            
                            # Haal nieuwe matches op met verlaagde criteria
                            expanded_response = await match_diensten_enhanced(modified_preferences)
                            if expanded_response.get("success"):
                                original_matches = expanded_response.get("matches", original_matches)
                                print(f"   📈 Expanded to {len(original_matches)} matches")
                    
                    else:
                        print(f"   ❓ Unknown impact key: {key} = {value}")
                        
            except Exception as impact_error:
                print(f"   ❌ Error processing impact {impact}: {str(impact_error)}")
                continue
        
        # STAP 3: Pas gewichten toe op de scores
        adjusted_matches = []
        
        for match in original_matches:
            print(f"\n🔄 Processing match: {match.get('name', 'Unknown')}")
            
            # Start met originele score
            original_score = match.get("matchScore", 0)
            adjusted_score = original_score
            
            print(f"   📊 Original score: {original_score}")
            
            # Pas gewicht aanpassingen toe
            if weight_adjustments and match.get("details", {}).get("scores"):
                scores = match["details"]["scores"]
                total_adjustment = 0
                adjustment_count = 0
                
                for criteria, weight in weight_adjustments.items():
                    if criteria in scores:
                        criteria_score = scores[criteria]
                        
                        # Bereken impact: (score - 5) * weight_factor * importance
                        weight_factor = (weight - 1.0)  # -0.5 tot +0.5
                        impact = (criteria_score - 5.0) * weight_factor * 3  # Max 3 punten impact
                        
                        total_adjustment += impact
                        adjustment_count += 1
                        
                        print(f"   🎯 {criteria}: score={criteria_score}, weight={weight}, impact={impact:.2f}")
                
                if adjustment_count > 0:
                    avg_adjustment = total_adjustment / adjustment_count
                    adjusted_score = max(0, min(100, original_score + avg_adjustment))
                    print(f"   📈 Weight adjustments: {avg_adjustment:.2f} -> Score: {original_score} -> {adjusted_score:.1f}")
            
            # Pas preferred match bonus toe
            if preferred_match_id and match.get("id") == preferred_match_id:
                adjusted_score *= boost_factor
                adjusted_score = min(100, adjusted_score)  # Cap at 100%
                print(f"   ⭐ Preferred match bonus: {boost_factor} -> Final score: {adjusted_score:.1f}")
            
            # Pas reduce_similar_attributes toe (verlaag scores van lagere matches)
            elif boost_factor < 1.0:  # reduce scenario
                # Alleen toepassen op matches die niet de beste zijn
                if original_score < max(m.get("matchScore", 0) for m in original_matches):
                    adjusted_score *= boost_factor
                    print(f"   📉 Reduce penalty applied: {boost_factor} -> Score: {adjusted_score:.1f}")
            
            # Pas boost_similar_attributes toe
            elif boost_factor > 1.0:  # boost scenario
                adjusted_score *= boost_factor
                adjusted_score = min(100, adjusted_score)
                print(f"   📈 Boost applied: {boost_factor} -> Score: {adjusted_score:.1f}")
            
            # Maak kopie van match met aangepaste score
            adjusted_match = match.copy()
            adjusted_match["matchScore"] = round(adjusted_score, 1)
            adjusted_matches.append(adjusted_match)
            
            print(f"   ✅ Final score: {original_score} -> {adjusted_score:.1f}")
        
        # STAP 4: Sorteer opnieuw op aangepaste scores
        adjusted_matches.sort(key=lambda x: x.get("matchScore", 0), reverse=True)
        
        print(f"\n🏁 FINAL RANKING:")
        for i, match in enumerate(adjusted_matches[:5]):
            print(f"   {i+1}. {match.get('name', 'Unknown')}: {match.get('matchScore')}%")
        
        return {
            "success": True,
            "matches": adjusted_matches,
            "weight_adjustments": weight_adjustments,
            "preferred_match_id": preferred_match_id,
            "applied_impacts": impacts,
            "total_found": len(adjusted_matches)
        }
        
    except Exception as e:
        print(f"❌ Error in recalculate_matches: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Herberekening error: {str(e)}")

@router.post("/debug-score-calculation")
async def debug_score_calculation(request: Request):
    """
    Debug endpoint om score berekening te testen
    """
    try:
        request_data = await request.json()
        impacts = request_data.get("impacts", [])
        test_match = {
            "id": "test_123",
            "name": "Test Bank",
            "matchScore": 75,
            "details": {
                "scores": {
                    "kosten": 7.0,
                    "begeleiding": 6.0,
                    "duurzaamheid": 8.0,
                    "functionaliteiten": 5.0
                }
            }
        }
        
        return {
            "success": True,
            "test_match": test_match,
            "impacts": impacts
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

# BEHOUDT de bestaande optimized functie voor backward compatibility
# VERVANG de laatste match_diensten_enhanced functie (vanaf regel ~180) met deze versie:

@router.post("/match-diensten-enhanced")
async def match_diensten_enhanced(user_preferences: Dict[str, Any]):
    """
    ENHANCED Match diensten - Multi-criteria scoring met gewogen factoren + BANK FILTERING + SOFT PREFERENCES
    """
    try:
        logging.info(f"Enhanced matching aanvraag: {user_preferences}")
        
        # 🏦 Extract bank filter + soft preferences
        bank_filter = user_preferences.get('bank_filter', {})
        soft_preferences = user_preferences.get('soft_preferences', [])
        
        logging.info(f"🏦 DEBUG: Bank filter received: {bank_filter}")
        logging.info(f"🎯 DEBUG: Soft preferences received: {soft_preferences}")
        
        # Extract user preferences
        type_dienst = user_preferences.get("type_dienst")
        bedrag = user_preferences.get("bedrag", 0)
        kosten_belangrijk = user_preferences.get("kosten_belangrijkheid", "geen_voorkeur")
        duurzaamheid_belangrijk = user_preferences.get("duurzaamheid_belangrijkheid", "geen_voorkeur")
        begeleiding_belangrijk = user_preferences.get("begeleiding_belangrijkheid", "geen_voorkeur")
        functionaliteiten_belangrijk = user_preferences.get("functionaliteiten_belangrijkheid", "geen_voorkeur")
        rendement_belangrijk = user_preferences.get("rendement_belangrijkheid", "geen_voorkeur")
        
        # Type mapping van gebruiker clusters naar database waarden
        type_mapping = {
            "Doe-het-zelf": ["Brokerage", "Execution Only"],
            "Samen of laten beleggen": ["Adviserend beheer", "Vermogensbeheer"], 
            "Pensioensparen": ["Pensioensparen"]
        }
        
        # Stap 1: Filter diensten op type en status
        filters = "status=eq.actief"
        if type_dienst and type_dienst in type_mapping:
            db_types = type_mapping[type_dienst]
            type_filter = ",".join([f'"{t}"' for t in db_types])
            filters += f"&type_aanbod=in.({type_filter})"
        
        # 🏦 Bank filtering toevoegen
        if bank_filter:
            filter_type = bank_filter.get('type')
            banks = bank_filter.get('banks', [])
            
            if filter_type == 'include' and banks:
                bank_filter_str = ",".join([f'"{bank}"' for bank in banks])
                filters += f"&naam_aanbieder=in.({bank_filter_str})"
                logging.info(f"🏦 INCLUDE filter toegepast: {banks}")
                
            elif filter_type == 'exclude' and banks:
                bank_filter_str = ",".join([f'"{bank}"' for bank in banks])
                filters += f"&naam_aanbieder=not.in.({bank_filter_str})"
                logging.info(f"🏦 EXCLUDE filter toegepast: {banks}")
        
        logging.info(f"🔍 Final database filters: {filters}")
        
        diensten = await supabase.select("diensten", f"*&{filters}")
        logging.info(f"Gevonden {len(diensten)} diensten van type {type_dienst}")
        
        # Stap 2: Filter op minimum bedrag
        filtered_diensten = []
        for dienst in diensten:
            minimum = dienst.get("minimum")
            if minimum is None or bedrag >= minimum:
                filtered_diensten.append(dienst)
        
        logging.info(f"Na bedrag filtering: {len(filtered_diensten)} diensten over")
        
        if not filtered_diensten:
            return {
                "success": True,
                "matches": [],
                "total_found": 0,
                "message": "Geen diensten gevonden die voldoen aan uw criteria",
                "filters_applied": {"bank_filter": bank_filter}
            }
        
        # Stap 3: Bulk data ophalen
        dienst_ids = [d.get("dienst_id") for d in filtered_diensten]
        dienst_ids_str = ",".join(map(str, dienst_ids))
        
        all_kosten = await supabase.select("kosten", f"*&dienst_id=in.({dienst_ids_str})")
        all_functionaliteiten = await supabase.select("functionaliteiten", f"*&dienst_id=in.({dienst_ids_str})")
        all_rendementen = await supabase.select("rendementen", f"*&dienst_id=in.({dienst_ids_str})")
        
        kosten_lookup = {k['dienst_id']: k for k in all_kosten}
        functionaliteiten_lookup = {f['dienst_id']: f for f in all_functionaliteiten}
        rendementen_lookup = {r['dienst_id']: r for r in all_rendementen}
        
        logging.info(f"Data opgehaald voor {len(filtered_diensten)} diensten")
        
        # Stap 4: Bereken percentiel scores
        tco_scores = calculate_percentile_scores([kosten_lookup.get(d['dienst_id'], {}).get('tco') for d in filtered_diensten], reverse=True)
        rendement_scores = calculate_percentile_scores([rendementen_lookup.get(d['dienst_id'], {}).get('rendement_5j') for d in filtered_diensten], reverse=False)
        
        # Stap 5: Bereken gewogen scores voor elke dienst
        matches = []
        for i, dienst in enumerate(filtered_diensten):
            dienst_id = dienst.get("dienst_id")
            naam_aanbieder = dienst.get("naam_aanbieder", "Onbekende aanbieder")
            
            # Haal data op
            kosten_data = kosten_lookup.get(dienst_id, {})
            functionaliteiten_data = functionaliteiten_lookup.get(dienst_id, {})
            rendement_data = rendementen_lookup.get(dienst_id, {})
            
            # Bereken individuele scores
            scores = {
                'duurzaamheid': dienst.get('score_duurzaamheid', 5),
                'begeleiding': dienst.get('score_persoonlijke_begeleiding', 5),
                'functionaliteiten': functionaliteiten_data.get('score_functionaliteiten', 5),
                'kosten': tco_scores[i] if tco_scores[i] is not None else 5,
                'rendement': rendement_scores[i] if rendement_scores[i] is not None else 5
            }
            
            # Bereken gewichten
            gewichten = {
                'duurzaamheid': get_weight(duurzaamheid_belangrijk),
                'begeleiding': get_weight(begeleiding_belangrijk),
                'functionaliteiten': get_weight(functionaliteiten_belangrijk),
                'kosten': get_weight(kosten_belangrijk),
                'rendement': get_weight(rendement_belangrijk)
            }
            
            # Bereken gewogen totaalscore
            total_score = calculate_weighted_score(scores, gewichten)
            
            # Bank boost (existing logic)
            boost_applied = False
            if bank_filter.get('type') == 'boost':
                boost_banks = bank_filter.get('banks', [])
                if boost_banks and any(bank in naam_aanbieder for bank in boost_banks):
                    total_score = min(10.0, total_score + 1.0)
                    boost_applied = True
                    logging.info(f"🏦 BOOST toegepast op {naam_aanbieder}: +1.0 punt")
            
            # Converteer naar percentage
            match_score = score_to_match_percentage(total_score)
            
            match = {
                "id": f"dienst_{dienst_id}",
                "name": naam_aanbieder,
                "logo": f"{naam_aanbieder.lower().replace(' ', '_')}.svg",
                "description": f"{dienst.get('type_aanbod')} van {naam_aanbieder}",
                "strengths": parse_db_strengths(dienst.get("sterktes", "")),
                "weaknesses": parse_db_weaknesses(dienst.get("zwaktes", "")),
                "matchScore": match_score,
                "rating": dienst.get("sterren_score", 0),
                "details": {
                    "minimum_bedrag": dienst.get("minimum"),
                    "tco": kosten_data.get("tco"),
                    "rendement_5j": rendement_data.get("rendement_5j"),
                    "sterren_score": dienst.get("sterren_score"),
                    "kenmerken": dienst.get("kenmerken"),
                    "scores": scores,
                    "gewichten": gewichten,
                    "total_score": total_score,
                    "boost_applied": boost_applied
                }
            }
            matches.append(match)
        
        # Sorteer op matchScore
        matches.sort(key=lambda x: x["matchScore"], reverse=True)
        
        # 🎯 NIEUW: Apply soft preferences
        if soft_preferences:
            logging.info(f"🚀 Applying {len(soft_preferences)} soft preferences...")
            matches = apply_soft_preferences(matches, soft_preferences)
        else:
            logging.info("ℹ️ No soft preferences to apply")
        
        logging.info(f"✅ Enhanced matching succesvol: {len(matches)} matches gevonden")
        
        return {
            "success": True,
            "matches": matches[:10],  # Return 10 matches instead of 3 to see boost effect
            "total_found": len(matches),
            "filters_applied": {
                "type_dienst": type_dienst,
                "bedrag": bedrag,
                "bank_filter": bank_filter,
                "soft_preferences": soft_preferences,  # Include in response
                "gewichten": {
                    "kosten": get_weight(kosten_belangrijk),
                    "duurzaamheid": get_weight(duurzaamheid_belangrijk),
                    "begeleiding": get_weight(begeleiding_belangrijk),
                    "functionaliteiten": get_weight(functionaliteiten_belangrijk),
                    "rendement": get_weight(rendement_belangrijk)
                }
            }
        }
        
    except Exception as e:
        logging.error(f"Error in enhanced matching: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Enhanced matching error: {str(e)}")

def apply_soft_preferences(matches, soft_preferences):
    """Apply soft preference actions to matches"""
    logging.info(f"🚀 Applying soft preferences: {soft_preferences}")
    
    for preference in soft_preferences:
        action = preference.get('action')
        
        if action == 'boost_banks':
            banks_to_boost = preference.get('banks', [])
            boost_factor = 1.4  # 40% boost
            
            logging.info(f"💪 Boosting banks: {banks_to_boost} with factor {boost_factor}")
            
            boosted_count = 0
            for match in matches:
                bank_name = match.get('name', '')
                
                # Check if this bank should be boosted
                def normalize(text):
                    return text.lower().replace("bank", "").replace("belgië", "").strip()

                should_boost = any(normalize(boost_bank) in normalize(bank_name) for boost_bank in banks_to_boost)

                
                if should_boost:
                    old_score = match['matchScore']
                    new_score = min(99, int(old_score * boost_factor))  # Cap at 99%
                    match['matchScore'] = new_score
                    match['details']['boost_applied'] = True
                    boosted_count += 1
                    
                    logging.info(f"📈 {bank_name}: {old_score}% → {new_score}% (SOFT BOOST)")
                else:
                    # Ensure boost_applied is set to False for non-boosted banks
                    if not match['details'].get('boost_applied', False):
                        match['details']['boost_applied'] = False
            
            logging.info(f"✅ Soft boosted {boosted_count} banks matching {banks_to_boost}")
        
        elif action == 'exclude_banks':
            banks_to_exclude = preference.get('banks', [])
            logging.info(f"❌ Excluding banks: {banks_to_exclude}")
            
            original_count = len(matches)
            matches = [
                match for match in matches 
                if not any(exclude_bank.lower() in match.get('name', '').lower() 
                          for exclude_bank in banks_to_exclude)
            ]
            excluded_count = original_count - len(matches)
            logging.info(f"❌ Excluded {excluded_count} banks")
    
    # Re-sort matches by score after applying preferences
    matches.sort(key=lambda x: x['matchScore'], reverse=True)
    logging.info(f"🔄 Re-sorted {len(matches)} matches by new scores")
    
    return matches
    
def get_weight(importance: str) -> float:
    """Converteer gebruikers belangrijkheid naar numeriek gewicht"""
    weights = {
        "heel_belangrijk": 0.3,
        "zeer_belangrijk": 0.3,
        "belangrijk": 0.15,
        "geen_voorkeur": 0.05
    }
    return weights.get(importance, 0.05)

def calculate_percentile_scores(values: List[Any], reverse: bool = False) -> List[int]:
    """
    Bereken percentiel-based scores van 1-10 voor een lijst van waarden
    reverse=True: lagere waarde = hogere score (voor kosten)
    reverse=False: hogere waarde = hogere score (voor rendement)
    """
    # Filter None waarden en bewaar originele indices
    valid_values = []
    valid_indices = []
    
    for i, val in enumerate(values):
        if val is not None and isinstance(val, (int, float)):
            valid_values.append(val)
            valid_indices.append(i)
    
    if not valid_values:
        return [None] * len(values)
    
    # Sorteer voor percentiel berekening
    sorted_values = sorted(valid_values, reverse=reverse)
    
    # Bereken scores
    scores = [None] * len(values)
    
    for i, val in enumerate(values):
        if val is not None and isinstance(val, (int, float)):
            # Vind positie in gesorteerde lijst
            if reverse:
                # Voor kosten: lagere waarde = hogere score
                rank = sorted_values.index(val)
            else:
                # Voor rendement: hogere waarde = hogere score  
                rank = len(sorted_values) - 1 - sorted_values[::-1].index(val)
            
            # Converteer naar 1-10 schaal
            percentile = rank / (len(sorted_values) - 1) if len(sorted_values) > 1 else 0.5
            score = max(1, min(10, int(percentile * 9) + 1))
            scores[i] = score
    
    return scores

def normalize_score(score: float) -> float:
    """Schaal 1-10 score niet-lineair naar 0.0–1.0"""
    if score >= 9:
        return 1.0
    elif score >= 7:
        return 0.8
    elif score >= 5:
        return 0.5
    elif score >= 3:
        return 0.2
    else:
        return 0.0

def calculate_weighted_score(scores: Dict[str, float], gewichten: Dict[str, float]) -> float:
    """Bereken gewogen gemiddelde van genormaliseerde scores"""
    total_weighted_score = 0
    total_weight = 0

    for criterium, score in scores.items():
        if criterium in gewichten and score is not None:
            gewicht = gewichten[criterium]
            total_weighted_score += normalize_score(score) * gewicht
            total_weight += gewicht

    if total_weight == 0:
        return sum(normalize_score(s) for s in scores.values() if s is not None) / len([s for s in scores.values() if s is not None])
    
    return total_weighted_score / total_weight

def score_to_match_percentage(score: float) -> int:
    """
    Zet genormaliseerde totaalscore (0–1) om naar een percentage (0–100)
    met sigmoid-schaal voor betere spreiding.
    """
    score = min(max(score, 0), 1)
    a = 12     # scherpte van de curve
    c = 0.6    # middenwaarde (score = 0.6 → 50%)
    percentage = 100 / (1 + math.exp(-a * (score - c)))
    return int(round(percentage))

def parse_db_strengths(sterktes_str: str) -> List[str]:
    """Parse database sterktes string"""
    if not sterktes_str:
        return ["Betrouwbare dienstverlening"]
    
    strengths = [s.strip() for s in sterktes_str.split(',') if s.strip()]
    return strengths[:3]

def parse_db_weaknesses(zwaktes_str: str) -> List[str]:
    """Parse database zwaktes string"""
    if not zwaktes_str:
        return []
    
    weaknesses = [w.strip() for w in zwaktes_str.split(',') if w.strip()]
    return weaknesses[:2]