from fastapi import APIRouter, HTTPException
from app.core.supabase_client import supabase
import logging
from typing import Dict, Any, List

router = APIRouter(prefix="/api", tags=["matching"])

@router.post("/match-diensten")
async def match_diensten(user_preferences: Dict[str, Any]):
    """
    UITGEBREIDE Match diensten - stap voor stap
    """
    try:
        logging.info(f"Enhanced matching aanvraag: {user_preferences}")
        
        type_dienst = user_preferences.get("type_dienst")
        bedrag = user_preferences.get("bedrag", 0)
        kosten_belangrijk = user_preferences.get("kosten_belangrijkheid", "niet_belangrijk")
        
        # Stap 1: Filter diensten op type en status
        filters = "status=eq.actief"
        if type_dienst:
            filters += f"&type_aanbod=eq.{type_dienst}"
        
        diensten = await supabase.select("diensten", f"*&{filters}")
        logging.info(f"Gevonden {len(diensten)} diensten van type {type_dienst}")
        
        # Stap 2: Filter op minimum bedrag in Python
        filtered_diensten = []
        for dienst in diensten:
            minimum = dienst.get("minimum")
            if minimum is None or bedrag >= minimum:
                filtered_diensten.append(dienst)
        
        logging.info(f"Na bedrag filtering: {len(filtered_diensten)} diensten over")
        
        # Stap 3: Haal kosten data op voor top diensten
        matches = []
        for i, dienst in enumerate(filtered_diensten[:3]):   # Max 3 voor snelheid
            dienst_id = dienst.get("dienst_id")
            
            # Probeer kosten op te halen
            try:
                kosten_data = await supabase.select("kosten", f"*&dienst_id=eq.{dienst_id}")
                tco = kosten_data[0].get("tco", 999) if kosten_data else 999
            except Exception as e:
                logging.warning(f"Kosten niet gevonden voor dienst {dienst_id}: {e}")
                tco = 999  # Fallback als kosten niet gevonden
            
            # Kosten filtering
            if kosten_belangrijk == "zeer_belangrijk" and tco >= 0.015:
                continue
            elif kosten_belangrijk == "belangrijk" and tco >= 0.022:
                continue
            
            # Enhanced match score
            base_score = 70
            if tco < 0.015:
                base_score += 20
            elif tco < 0.022:
                base_score += 10
            
            if dienst.get("sterren_score", 0) >= 4:
                base_score += 10
            
            match = {
                "id": f"dienst_{dienst_id}",
                "name": dienst.get("naam_aanbieder", "Onbekende aanbieder"),
                "logo": f"{dienst.get('naam_aanbieder', 'default').lower().replace(' ', '_')}.svg",
                "description": f"{dienst.get('type_aanbod')} van {dienst.get('naam_aanbieder')}",
                "strengths": parse_db_strengths(dienst.get("sterktes", "")),
                "weaknesses": parse_db_weaknesses(dienst.get("zwaktes", "")),
                "matchScore": min(base_score, 100),
                "rating": dienst.get("sterren_score", 0),
                "details": {
                    "minimum_bedrag": dienst.get("minimum"),
                    "tco": tco,
                    "sterren_score": dienst.get("sterren_score"),
                    "kenmerken": dienst.get("kenmerken")
                }
            }
            matches.append(match)
        
        # Sorteer op score
        matches.sort(key=lambda x: x["matchScore"], reverse=True)
        
        return {
            "success": True,
            "matches": matches[:3],  # Top 3
            "total_found": len(matches),
            "filters_applied": {
                "type_dienst": type_dienst,
                "bedrag": bedrag,
                "kosten_belangrijkheid": kosten_belangrijk
            }
        }
        
    except Exception as e:
        logging.error(f"Error in enhanced matching: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Enhanced matching error: {str(e)}")

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