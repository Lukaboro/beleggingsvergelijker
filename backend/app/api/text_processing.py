# app/api/text_processing.py

from fastapi import APIRouter, Request
from typing import Dict, Any
import logging
import os
from anthropic import Anthropic
import json

# Import matching logic
from ..utils.matcher import calculate_bank_scores

router = APIRouter()

# Initialize Anthropic client
anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def build_belgian_analysis_prompt(free_text: str, current_preferences: Dict[str, Any]) -> str:
    """
    Build intelligent context-aware prompt for Belgian investment services analysis
    Replaces hardcoded rules with domain knowledge and flexible interpretation
    """
    
    prompt = f"""Je bent een AI assistent gespecialiseerd in Belgische investeringsdiensten matching.

CONTEXT & SITUATIE:
- Gebruiker heeft al initiële voorkeuren ingesteld via vragenlijst
- We hebben matches gevonden op basis van deze voorkeuren
- Gebruiker wil nu refinements/aanpassingen maken via vrije tekst
- Je doel: interpreteren wat gebruiker wil en juiste acties voorstellen

HUIDIGE VOORKEUREN:
{current_preferences}

GEBRUIKER VRAAG: "{free_text}"

BELGISCHE MARKT KENNIS:
- Grote banken: KBC, Belfius, BNP Paribas Fortis, ING, Crelan, Argenta
- FYSIEKE KANTOREN: KBC en Belfius hebben veruit de meeste kantoren in België
- ONLINE-ONLY: Keytrade Bank is een internetbroker ZONDER fysieke kantoren
- Evaluatie criteria: kosten, begeleiding, duurzaamheid, functionaliteiten, rendement
- Types: Doe-het-zelf (brokerage), Samen beleggen (advies), Pensioensparen

BANK KARAKTERISTIEKEN (voor clarifications):
- **KBC/Belfius**: Grote netwerken, veel kantoren, traditionele dienstverlening
- **Triodos**: Duurzaam bankieren, impact investing, ethische focus
- **Keytrade**: Online focus, lage kosten, zelfstandig beleggen
- **Crelan**: Coöperatief, persoonlijke service, lokale aanpak

BESCHIKBARE ACTIES:
1. preference_updates: Pas voorkeur criteria aan
   - "kosten": heel_belangrijk/zeer_belangrijk/belangrijk/geen_voorkeur
   - "duurzaamheid": heel_belangrijk/zeer_belangrijk/belangrijk/geen_voorkeur
   - "begeleiding": heel_belangrijk/zeer_belangrijk/belangrijk/geen_voorkeur
   - "functionaliteiten": heel_belangrijk/zeer_belangrijk/belangrijk/geen_voorkeur
   - "rendement": heel_belangrijk/zeer_belangrijk/belangrijk/geen_voorkeur

2. Bank filtering:
   - include_banks: toon alleen specifieke banken
   - exclude_banks: sluit specifieke banken uit
   - boost_banks: geef voorkeur aan specifieke banken

3. clarifications_needed: Gebruik bij ambiguïteit om gebruiker intentie te bevestigen

CLARIFICATION-FIRST STRATEGIE:
🎯 **BIJ AMBIGUE BANK VOORKEUREN - VRAAG ALTIJD OM VERDUIDELIJKING:**

AMBIGUE GEVALLEN (→ clarifications_needed):
- **Bank voorkeur zonder context**: 
  "Ik heb voorkeur voor [BANK]" → "Wilt u specifiek [BANK] hoger scoren, of geeft u prioriteit aan wat [BANK] kenmerkt (bijv. duurzaamheid bij Triodos, veel kantoren bij KBC)?"

- **Vage criteria**:
  "veel kantoren" → "Zoekt u naar banken met de meeste kantoren (KBC/Belfius), of kantoren specifiek in uw regio?"
  "goedkoop" → "Wilt u de kostenprioriteit verhogen, of zoekt u specifiek naar de goedkoopste opties?"
  "grote bank" → "Bedoelt u een bank met veel kantoren, hoge rating, of wilt u andere voorkeuren aanpassen?"

- **Onduidelijke intentie**:
  "betere service" → "Bedoelt u meer persoonlijke begeleiding of betere digitale functionaliteiten?"
  "meer flexibiliteit" → "Op welk gebied zoekt u meer flexibiliteit: kosten, producten, of toegang?"

DUIDELIJKE GEVALLEN (→ directe actie):
- "Maak kosten belangrijker" → preference_updates
- "Ik wil [bank] uitsluiten" → exclude_banks
- "Verhoog duurzaamheid prioriteit" → preference_updates
- "Alleen online banken" → include_banks voor online-only banken
- "Absoluut [bank]" / "Zeker [bank]" → boost_banks (sterke voorkeur)

INTELLIGENTE INTERPRETATIE PRINCIPES:
- **GEEN AANNAMES**: Maak geen gevolgtrekkingen over wat gebruiker "eigenlijk wil"
- **LETTERLIJK NEMEN**: Expliciete vragen direct uitvoeren
- **BIJ TWIJFEL**: Gebruik clarification om intentie te bevestigen
- **FOCUS**: Wat expliciet gevraagd wordt, niet wat het "zou kunnen betekenen"

VOORBEELDEN VAN CLARIFICATION VRAGEN:
Input: "Ik heb voorkeur voor Triodos"
→ clarifications_needed: ["Wilt u specifiek Triodos hoger scoren, of geeft u prioriteit aan duurzaam bankieren zoals Triodos dat aanbiedt?"]

Input: "Ik wil veel kantoren"
→ clarifications_needed: ["Zoekt u naar banken met de meeste kantoren (KBC/Belfius), of kantoren specifiek dichtbij u?"]

Input: "Maak duurzaamheid belangrijker"
→ preference_updates: {{"duurzaamheid": "heel_belangrijk"}}

Input: "Ik wil absoluut KBC"
→ soft_preferences: ["boost_banks:KBC"]

RESPONSE FORMAT (EXACT JSON):
{{
    "preference_updates": {{}},
    "soft_preferences": [],
    "clarifications_needed": [],
    "reasoning": "Korte uitleg van interpretatie of waarom clarification nodig is",
    "confidence": "high/medium/low"
}}

VEILIGHEIDSFILTERS & COMPLIANCE:
⚠️ WEIGER en leg uit waarom bij:
- Discriminatoire criteria (ras, religie, geslacht, nationaliteit)
- Compliance-problematische vragen (belastingontduiking, witwassen, FATCA omzeiling)
- Wettelijk twijfelachtige verzoeken
- Onrealistische verwachtingen (>20% gegarandeerd rendement, gratis premium diensten)
- Vragen die goede matching onmogelijk maken

⚠️ Als input problematisch is, return:
{{
    "preference_updates": {{}},
    "soft_preferences": [],
    "clarifications_needed": [],
    "reasoning": "Deze vraag kan ik niet verwerken omdat [reden]",
    "confidence": "high",
    "safety_concern": true,
    "safety_message": "Uitleg waarom dit niet mogelijk/toegestaan is"
}}

BELANGRIJKE RICHTLIJNEN:
- **CLARIFICATION IS VEILIG**: Gebruik het vaak bij ambiguïteit
- **GEBRUIKER HELPEN**: Beter clarification dan verkeerde aanname
- **DOMEINKENNIS GEBRUIKEN**: Maak slimme clarification opties
- Belgische markt = bekend terrein, focus op intentie niet geografie
- Veiligheid en compliance altijd prioriteit

Geef ALLEEN geldige JSON terug, geen andere tekst."""

    return prompt

@router.post("/debug-text-analysis") 
async def debug_text_analysis(request: Request):
    """Debug endpoint voor text analysis zonder Claude API call"""
    try:
        request_data = await request.json()
        free_text = request_data.get("free_text", "")
        current_preferences = request_data.get("current_preferences", {})
        
        # Generate prompt maar geen API call
        analysis_prompt = build_belgian_analysis_prompt(free_text, current_preferences)
        
        # Mock response voor debugging
        mock_response = {
            "preference_updates": {},
            "soft_preferences": [
                {"category": "bekendheid", "importance": "belangrijk", "description": "Zoekt bekende, betrouwbare aanbieder"},
                {"category": "kosten", "importance": "zeer_belangrijk", "description": "Prijsbewust, wil goedkope oplossing"}
            ],
            "reasoning": "Debug mode - geen echte analyse uitgevoerd",
            "confidence": "medium",
            "detected_themes": ["betrouwbaarheid", "kosteneffectiviteit"]
        }
        
        return {
            "success": True,
            "debug_mode": True,
            "generated_prompt": analysis_prompt,
            "mock_response": mock_response,
            "free_text_input": free_text
        }
        
    except Exception as e:
        logging.error(f"Error in debug text analysis: {str(e)}")
        return {
            "success": False,
            "error": f"Debug error: {str(e)}"
        }

@router.post("/process-user-text")
async def process_user_text(request: Request):
    """Process user text with Claude API and return analysis"""
    try:
        # Parse JSON body manually with proper encoding
        request_data = await request.json()
        logging.info(f"Text processing aanvraag: {request_data}")
        
        # Extract input data
        free_text = request_data.get("free_text", "").strip()
        current_preferences = request_data.get("current_preferences", {})
        
        if not free_text:
            return {
                "success": False,
                "error": "Geen tekst input ontvangen"
            }
        
        # Ensure UTF-8 encoding for text processing
        try:
            free_text = free_text.encode('utf-8').decode('utf-8')
        except UnicodeError as e:
            logging.warning(f"UTF-8 encoding issue: {e}")
            # Fallback: remove problematic characters
            free_text = free_text.encode('ascii', errors='ignore').decode('ascii')
        
        # Build context-aware prompt for Claude (ASCII safe)
        analysis_prompt = build_belgian_analysis_prompt(free_text, current_preferences)
        
        # Ensure prompt is ASCII safe for Claude API
        try:
            analysis_prompt = analysis_prompt.encode('ascii', errors='replace').decode('ascii')
        except UnicodeError:
            analysis_prompt = analysis_prompt.replace('ë', 'e').replace('ï', 'i').replace('é', 'e')
        
        # Call Claude API
        message = anthropic_client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1500,
            temperature=0.1,
            messages=[
                {
                    "role": "user", 
                    "content": analysis_prompt
                }
            ]
        )
        
        # Parse Claude response 
        claude_response = message.content[0].text.strip()
        
        # Try to parse JSON response
        import json
        try:
            analysis_result = json.loads(claude_response)
        except json.JSONDecodeError as e:
            logging.warning(f"Claude response was not valid JSON: {claude_response}")
            # Fallback response
            analysis_result = {
                "preference_updates": {},
                "soft_preferences": [],
                "reasoning": "Er was een probleem met het parsen van de analyse",
                "confidence": "low",
                "detected_themes": []
            }
        
        return {
            "success": True,
            "free_text_input": free_text,
            **analysis_result
        }
        
    except Exception as e:
        logging.error(f"Error in text processing: {str(e)}")
        return {
            "success": False,
            "error": f"Text processing error: {str(e)}"
        }

@router.post("/process-text-and-match")
async def process_text_and_match(request: Request):
    """Process user text input and update matches accordingly"""
    print("🚀🚀🚀 TEXT PROCESSING ENDPOINT CALLED!")  # ← ZICHTBARE DEBUG
    
    try:
        request_data = await request.json()
        print(f"📨 Raw request_data: {request_data}")  # ← DEBUG REQUEST
        
        user_input = request_data.get("text", "").strip()
        current_preferences = request_data.get("preferences", {})
        
        print(f"🔍 user_input: '{user_input}' (length: {len(user_input)})")  # ← DEBUG INPUT
        print(f"📊 current_preferences: {current_preferences}")  # ← DEBUG PREFS
        
        # 🚀 VALIDATION (commented out for now):
        # if len(user_input) < 3 or user_input.lower() in ['a', 'test', '123', 'e', 'q', 'w']:
        #    return {
        #        "success": False,
        #       "error": "Geef een uitgebreidere beschrijving van je voorkeuren (minimaal 3 karakters)"
        #}
        
        logging.info(f"Processing text: {user_input}")
        logging.info(f"Current preferences: {current_preferences}")
        
        # Step 1: Analyze text with Claude
        print("🧠 Building Claude prompt...")  # ← DEBUG STEP
        prompt = build_belgian_analysis_prompt(user_input, current_preferences)
        
        try:
            print("🤖 Calling Claude API...")  # ← DEBUG STEP
            message = anthropic_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1500,
                messages=[{"role": "user", "content": prompt}]
            )
            
            response_text = message.content[0].text
            print(f"✅ Claude response received: {response_text[:200]}...")  # ← DEBUG RESPONSE
            logging.info(f"Claude response: {response_text}")
            
        except Exception as claude_error:
            print(f"❌ Claude API error: {str(claude_error)}")  # ← DEBUG ERROR
            logging.error(f"Claude API error: {str(claude_error)}")
            return {
                "success": False,
                "error": f"Text analysis error: {str(claude_error)}"
            }
        
        # Step 2: Parse JSON response
        try:
            print("📋 Parsing Claude JSON response...")  # ← DEBUG STEP
            import json
            # Extract JSON from Claude response
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                json_text = response_text[json_start:json_end].strip()
            else:
                json_text = response_text.strip()
            
            analysis_result = json.loads(json_text)
            print(f"✅ JSON parsed successfully: {analysis_result}")  # ← DEBUG PARSED
            
            # Check for safety concerns
            if analysis_result.get("safety_concern"):
                return {
                "success": False,
                "error": analysis_result.get("safety_message", "Deze vraag kan niet worden verwerkt"),
                "safety_issue": True
                }       

        except json.JSONDecodeError as e:
            print(f"❌ JSON parsing error: {str(e)}")  # ← DEBUG ERROR
            print(f"❌ Raw response: {response_text}")  # ← DEBUG RAW
            logging.error(f"JSON parsing error: {str(e)}")
            logging.error(f"Raw response: {response_text}")
            return {
                "success": False,
                "error": f"Failed to parse analysis: {str(e)}"
            }
        
# VERVANG het hele stuk van "Step 3" tot "Step 5" met deze code:

        # Step 3: Update preferences based on analysis
        print("🔄 Updating preferences...")
        updated_preferences = current_preferences.copy()
        
        # Apply preference updates with CORRECT KEY MAPPING
        preference_updates = analysis_result.get("preference_updates", {})
        print(f"📝 Raw preference updates: {preference_updates}")
        
        # MAP Claude keys to backend keys
        key_mapping = {
            "kosten": "kosten_belangrijkheid",
            "duurzaamheid": "duurzaamheid_belangrijkheid", 
            "begeleiding": "begeleiding_belangrijkheid",
            "functionaliteiten": "functionaliteiten_belangrijkheid",
            "rendement": "rendement_belangrijkheid"
        }
        
        for claude_key, value in preference_updates.items():
            backend_key = key_mapping.get(claude_key, claude_key)
            updated_preferences[backend_key] = value
            print(f"✅ Mapped {claude_key} -> {backend_key}: {value}")
            logging.info(f"Updated {backend_key}: {value}")
        
        print(f"📊 Final updated_preferences: {updated_preferences}")
        
        # 🎯 NEW: Process soft_preferences from Claude response
        print("🎯 Processing soft preferences...")
        soft_preferences_list = []
        raw_soft_prefs = analysis_result.get('soft_preferences', [])
        print(f"🎯 Raw soft preferences from Claude: {raw_soft_prefs}")
        
        for pref in raw_soft_prefs:
            if isinstance(pref, str) and ':' in pref:
                action, rest = pref.split(':', 1)
                banks = [b.strip() for b in rest.split(',') if b.strip()]
                soft_preferences_list.append({'action': action.strip(), 'banks': banks})

                try:
                    action, banks_str = pref.split(':', 1)
                    banks = [bank.strip() for bank in banks_str.split(',')]
                    soft_preferences_list.append({
                        'action': action,
                        'banks': banks
                    })
                    print(f"📋 Parsed soft preference: {action} -> {banks}")
                except Exception as parse_error:
                    print(f"⚠️ Error parsing soft preference '{pref}': {parse_error}")
        
        # Add soft_preferences to the request
        if soft_preferences_list:
            updated_preferences['soft_preferences'] = soft_preferences_list
            print(f"🚀 Added soft_preferences to request: {soft_preferences_list}")
        else:
            updated_preferences['soft_preferences'] = []
            print("ℹ️ No soft preferences to apply")
        
        # Step 4: Get new matches with updated preferences
        print("🎯 Getting new matches...")
        
        # IMPORT FIX: Use relative import properly
        try:
            from ..api.matching import match_diensten_enhanced
            print("✅ Import successful: match_diensten_enhanced")
        except ImportError as import_error:
            print(f"❌ Import error: {str(import_error)}")
            # Alternative import path
            try:
                from app.api.matching import match_diensten_enhanced
                print("✅ Alternative import successful")
            except ImportError:
                print("❌ All imports failed - using calculate_bank_scores fallback")
                from ..utils.matcher import calculate_bank_scores
                # Fallback to old function
                new_matches = calculate_bank_scores(updated_preferences)
                
                return {
                    "success": True,
                    "updatedPreferences": updated_preferences,
                    "newMatches": new_matches,
                    "textAnalysis": {
                        "free_text_input": user_input,
                        **analysis_result
                    },
                    "preferencesChanged": len(preference_updates) > 0,
                    "originalText": user_input
                }
        
        # 🚀 Call matching with soft_preferences included
        print(f"🎯 Calling matching with preferences: {updated_preferences.keys()}")
        matches_response = await match_diensten_enhanced(updated_preferences)
        print(f"🎯 Matches response keys: {matches_response.keys() if isinstance(matches_response, dict) else 'Not a dict'}")
        
        if not matches_response.get("success"):
            error_msg = f"Matching failed: {matches_response.get('error', 'Unknown error')}"
            print(f"❌ {error_msg}")
            raise Exception(error_msg)
        
        new_matches = matches_response.get("matches", [])
        print(f"✅ Got {len(new_matches)} new matches")
        
        # 🔍 DEBUG: Check if any matches have boost_applied = True
        boosted_matches = [m for m in new_matches if m.get('details', {}).get('boost_applied', False)]
        print(f"📈 Found {len(boosted_matches)} boosted matches: {[m.get('name') for m in boosted_matches]}")

        # Step 5: Return results
        final_result = {
            "success": True,
            "updatedPreferences": updated_preferences,
            "newMatches": new_matches,
            "textAnalysis": {
                "free_text_input": user_input,
                **analysis_result
            },
            "preferencesChanged": len(preference_updates) > 0,
            "softPreferencesApplied": len(soft_preferences_list) > 0,  # NEW: Track soft prefs
            "originalText": user_input
        }
        
        print(f"🎉 Returning successful result with {len(new_matches)} matches")
        print(f"🔄 Preferences changed: {len(preference_updates) > 0}")
        print(f"🎯 Soft preferences applied: {len(soft_preferences_list) > 0}")
        
        return final_result
    except Exception as e:
        print(f"❌❌❌ EXCEPTION in text processing: {str(e)}")  # ← DEBUG EXCEPTION
        logging.error(f"Text + matching error: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": f"Text + matching error: {str(e)}"
        }

# NEW: Clarification processing endpoint with REAL re-matching
# VERVANG je process_clarification functie met deze generieke versie:

# VERVANG alleen de data extractie deel in je process_clarification:

@router.post("/process-clarification")
async def process_clarification(request: Request):
    try:
        request_data = await request.json()
        clarification_id = request_data.get('clarification_id')
        selected_option = request_data.get('selected_option')
        current_preferences = request_data.get('preferences', {})

        print(f"🤔 Processing clarification: {clarification_id}")
        print(f"📋 Selected option: {selected_option}")

        # Extract action
        if isinstance(selected_option, dict):
            action = selected_option.get('action', selected_option)
            clarification_text = selected_option.get('text', "")
        else:
            action = selected_option
            clarification_text = ""
        
        print(f"🎯 Action: {action}")
        print(f"📝 Clarification text: {clarification_text}")
        
        soft_preferences_list = []
        applied_filter = "Geen wijzigingen toegepast"
        filter_active = False

        # Alleen implementatie voor boost_specific voorlopig
        if action == "boost_specific":
            # NIEUW: Haal banknaam uit expliciet 'target'-veld in plaats van uit tekst
            bank_name = selected_option.get("target", "").strip()
            print(f"🏦 Geselecteerde bank via 'target': '{bank_name}'")

            if bank_name:
                soft_preferences_list = [{
                    "action": "boost_banks",
                    "banks": [bank_name]
                }]
                current_preferences["soft_preferences"] = soft_preferences_list
                applied_filter = f"Boost toegepast voor {bank_name}"
                filter_active = True
            else:
                applied_filter = f"❌ Geen banknaam herkend in 'target'"
                print(f"⚠️ Geen geldige banknaam ontvangen voor boost_specific")
        
        # ✅ Herbereken matches
        try:
            from ..api.matching import match_diensten_enhanced
        except ImportError:
            from app.api.matching import match_diensten_enhanced

        print(f"🚀 Matching op basis van preferences: {current_preferences}")
        matches_response = await match_diensten_enhanced(current_preferences)

        if not matches_response.get("success"):
            return {"success": False, "error": "Matching mislukt"}

        new_matches = matches_response.get("matches", [])
        print(f"✅ {len(new_matches)} nieuwe matches gevonden")

        return {
            "success": True,
            "matches": new_matches,
            "appliedFilter": applied_filter,
            "filterActive": filter_active,
            "originalMatchCount": len(new_matches),
            "filteredMatchCount": len(new_matches),
            "note": "Boost toegepast via clarification" if filter_active else "Geen wijziging"
        }

    except Exception as e:
        print(f"💥 Error in process_clarification: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"success": False, "error": str(e)}
