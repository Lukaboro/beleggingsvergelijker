# Fix voor calculate_bank_scores functie
# Dit zorgt ervoor dat de filter altijd correct werkt en de data nooit gecached wordt

from typing import Dict, List, Any
from app.data.bank_data import BANK_DATA
import time

def calculate_bank_scores(user_preferences: Dict[str, Any]) -> List[Dict]:
    """
    Calculate scores for each bank based on user preferences with forced filtering
    """
    # Genereer een timestamp om te zien of deze functie opnieuw wordt aangeroepen
    current_timestamp = time.time()
    print(f"[DEBUG {current_timestamp}] Functie aangeroepen met user_preferences: {user_preferences}")
    
    # VERBETERD: Robuuste min_rating verwerking
    min_rating = None
    min_rating_raw = user_preferences.get("min_rating")
    
    print(f"[DEBUG {current_timestamp}] min_rating_raw: {min_rating_raw} (type: {type(min_rating_raw).__name__})")
    
    # Behandel alle mogelijke vormen waarin min_rating kan binnenkomen
    try:
        # Converteer van JSON/frontend formaten (string, number)
        if isinstance(min_rating_raw, str) and min_rating_raw.strip():
            min_rating = int(min_rating_raw)
        elif isinstance(min_rating_raw, (int, float)):
            min_rating = int(min_rating_raw)
        
        # Behandel edge cases
        if min_rating == 0:
            min_rating = None
    except (ValueError, TypeError) as e:
        print(f"[DEBUG {current_timestamp}] Error bij min_rating conversie: {e}")
        min_rating = None
    
    print(f"[DEBUG {current_timestamp}] min_rating na verwerking: {min_rating}")
    
    # Andere user preferences ophalen - robuuster gemaakt
    investment_goal = user_preferences.get("investment_goal", "")
    investment_horizon = user_preferences.get("investment_horizon", "")
    management_style = user_preferences.get("management_style", "")
    preference = user_preferences.get("preference", "")
    
    # Robuuste conversie van amount
    amount = 0
    try:
        amount_raw = user_preferences.get("amount", 0)
        if amount_raw is not None:
            # Verwerk string formaten ("25000") en numerieke waarden
            if isinstance(amount_raw, str) and amount_raw.strip():
                amount = int(amount_raw)
            elif isinstance(amount_raw, (int, float)):
                amount = int(amount_raw)
    except (ValueError, TypeError) as e:
        print(f"[DEBUG {current_timestamp}] Error bij amount conversie: {e}")
        amount = 0
    
    # Maak een kopie van BANK_DATA om te voorkomen dat we een gecachte versie gebruiken
    current_bank_data = list(BANK_DATA)
    print(f"[DEBUG {current_timestamp}] Aantal banken geladen: {len(current_bank_data)}")
    
    # Log de ratings van alle banken voor debugging
    for bank in current_bank_data:
        bank_id = bank.get("id", "unknown")
        bank_rating = bank.get("rating", 0)
        print(f"[DEBUG {current_timestamp}] Bank {bank_id} heeft rating: {bank_rating}")
    
    bank_scores = []
    filtered_banks = []  # Bijhouden welke banken worden uitgefilterd
    
    for bank in current_bank_data:
        bank_id = bank.get("id", "unknown")
        bank_name = bank.get("name", "Unknown Bank")
        
        # Robuuste verwerking van bank_rating
        bank_rating = 0
        try:
            rating_raw = bank.get("rating", 0)
            bank_rating = int(rating_raw) if rating_raw is not None else 0
        except (ValueError, TypeError):
            bank_rating = 0
        
        # KERNPROBLEEM FIX: Striktere en expliciete filtering op min_rating
        # Dit zou het probleem moeten oplossen waarbij banken met een te lage rating toch worden getoond
        if min_rating is not None:
            if bank_rating < min_rating:
                print(f"[DEBUG {current_timestamp}] ⛔ Bank {bank_id} GEFILTERD: rating {bank_rating} < min_rating {min_rating}")
                filtered_banks.append(f"{bank_name} (rating: {bank_rating})")
                continue
            else:
                print(f"[DEBUG {current_timestamp}] ✅ Bank {bank_id} GEACCEPTEERD: rating {bank_rating} >= min_rating {min_rating}")
        
        # Rest van de scoring logica blijft hetzelfde...
        score = 0
        matches = []
        penalties = []
        
        # Calculate score based on investment goal
        if investment_goal and "investment_goal" in bank.get("recommendation_points", {}):
            goal_score = bank["recommendation_points"]["investment_goal"].get(investment_goal, 0)
            score += goal_score
            if goal_score > 7:
                matches.append(f"Beleggingsdoel: {investment_goal}")
            elif goal_score < 3:
                penalties.append(f"Niet optimaal voor beleggingsdoel: {investment_goal}")
        
        # Calculate score based on investment horizon
        if investment_horizon and "investment_horizon" in bank.get("recommendation_points", {}):
            horizon_score = bank["recommendation_points"]["investment_horizon"].get(investment_horizon, 0)
            score += horizon_score
            if horizon_score > 7:
                matches.append(f"Beleggingshorizon: {investment_horizon}")
            elif horizon_score < 3:
                penalties.append(f"Niet optimaal voor tijdshorizon: {investment_horizon}")

        # Calculate score based on management style
        if management_style and "management_style" in bank.get("recommendation_points", {}):
            style_score = bank["recommendation_points"]["management_style"].get(management_style, 0)
            score += style_score
            if style_score > 7:
                matches.append(f"Beheerstijl: {management_style}")
            elif style_score < 3:
                penalties.append(f"Niet optimaal voor beheerstijl: {management_style}")

        # Calculate score based on preference
        if preference and "preferences" in bank.get("recommendation_points", {}):
            pref_score = bank["recommendation_points"]["preferences"].get(preference, 0)
            score += pref_score
            if pref_score > 7:
                matches.append(f"Voorkeur: {preference}")
            elif pref_score < 3:
                penalties.append(f"Niet optimaal voor voorkeur: {preference}")

        # Check if amount is in range
        if "amount_range" in bank.get("target_profiles", {}):
            min_amount, max_amount = bank["target_profiles"]["amount_range"]
            if min_amount <= amount <= max_amount:
                matches.append(f"Bedrag: €{amount}")
            else:
                score -= 10  # Higher penalty if amount is out of range
                if amount < min_amount:
                    penalties.append(f"Bedrag te laag (minimum €{min_amount})")
                else:
                    penalties.append(f"Bedrag te hoog (maximum €{max_amount})")
        
        # Normalize score to percentage (max score could be 40)
        match_percentage = min(max(int((score / 40) * 100), 0), 100)
        
        bank_scores.append({
            "id": bank["id"],
            "name": bank["name"],
            "logo": bank.get("logo", ""),
            "description": bank.get("description", ""),
            "strengths": bank.get("strengths", []),
            "weaknesses": bank.get("weaknesses", []),
            "matchScore": match_percentage,
            "key_matches": matches,
            "key_mismatches": penalties,
            "rating": bank_rating  # Gebruik de geconverteerde bank_rating
        })
    
    # Log uitgefilterde banken
    print(f"[DEBUG {current_timestamp}] Uitgefilterde banken: {', '.join(filtered_banks) if filtered_banks else 'geen'}")
    
    # Sort results by match score
    bank_scores.sort(key=lambda x: x["matchScore"], reverse=True)
    
    # EXTRA VEILIGHEID: Nogmaals filteren na sortering om ZEKER te zijn dat banken met te lage rating er niet in zitten
    if min_rating is not None:
        # Verwijder opnieuw banken met een te lage rating, zelfs al zouden ze een hoge score hebben
        bank_scores = [bank for bank in bank_scores if bank["rating"] >= min_rating]
        print(f"[DEBUG {current_timestamp}] EXTRA FILTERING: {len(bank_scores)} banken over na extra rating check")
    
    # Debug welke banken in de top 3 zitten vóór retourneren
    print(f"[DEBUG {current_timestamp}] DEFINITIEVE RESULTATEN:")
    for i, bank in enumerate(bank_scores[:3], 1):
        print(f"[DEBUG {current_timestamp}] Top {i}: {bank['id']} - Score: {bank['matchScore']}, Rating: {bank['rating']}")
    
    # Voeg een force-unique indicator toe aan resultaten om caching tegen te gaan
    final_results = bank_scores[:3]
    for bank in final_results:
        bank["_nocache"] = current_timestamp
    
    # Return top 3 banks
    return final_results