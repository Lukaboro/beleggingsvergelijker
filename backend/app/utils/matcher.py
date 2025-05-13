from typing import Dict, List, Any
from app.data.bank_data import BANK_DATA
import time  # Voor het genereren van een unieke timestamp

def calculate_bank_scores(user_preferences: Dict[str, Any]) -> List[Dict]:
    """
    Calculate scores for each bank based on user preferences
    with anti-caching maatregelen
    """
    # Genereer een timestamp om te zien of deze functie opnieuw wordt aangeroepen
    current_timestamp = time.time()
    print(f"[DEBUG {current_timestamp}] Functie aangeroepen met user_preferences: {user_preferences}")
    
    # Robuuste min_rating verwerking (zoals eerder)
    min_rating = None
    min_rating_raw = user_preferences.get("min_rating")
    
    if min_rating_raw is not None:
        try:
            if isinstance(min_rating_raw, str) and min_rating_raw.strip():
                min_rating = int(min_rating_raw)
            elif isinstance(min_rating_raw, int):
                min_rating = min_rating_raw
            elif isinstance(min_rating_raw, (float, bool)):
                min_rating = int(min_rating_raw)
        except (ValueError, TypeError):
            min_rating = None
    
    if min_rating == 0:
        min_rating = None
    
    print(f"[DEBUG {current_timestamp}] min_rating na verwerking: {min_rating}")
    
    # Andere user preferences ophalen
    investment_goal = user_preferences.get("investment_goal")
    investment_horizon = user_preferences.get("investment_horizon")
    management_style = user_preferences.get("management_style")
    preference = user_preferences.get("preference")
    
    # Robuuste conversie van amount
    amount = 0
    try:
        amount_raw = user_preferences.get("amount", 0)
        amount = int(amount_raw) if amount_raw is not None else 0
    except (ValueError, TypeError):
        amount = 0
    
    # Maak een kopie van BANK_DATA om te voorkomen dat we een gecachte versie gebruiken
    current_bank_data = list(BANK_DATA)
    print(f"[DEBUG {current_timestamp}] Aantal banken geladen: {len(current_bank_data)}")
    
    bank_scores = []
    filtered_banks = []  # Bijhouden welke banken worden uitgefilterd
    
    for bank in current_bank_data:
        bank_id = bank.get("id", "unknown")
        
        # Robuuste verwerking van bank_rating
        bank_rating = 0
        try:
            rating_raw = bank.get("rating", 0)
            bank_rating = int(rating_raw) if rating_raw is not None else 0
        except (ValueError, TypeError):
            bank_rating = 0
        
        # Filter by minimum rating if specified
        if min_rating is not None and bank_rating < min_rating:
            print(f"[DEBUG {current_timestamp}] Bank {bank_id} gefilterd: rating {bank_rating} < min_rating {min_rating}")
            filtered_banks.append(bank_id)
            continue
        
        # Rest van de scoring logica blijft hetzelfde...
        score = 0
        matches = []
        penalties = []
        
        # Calculate score based on investment goal
        if investment_goal and "investment_goal" in bank["recommendation_points"]:
            goal_score = bank["recommendation_points"]["investment_goal"].get(investment_goal, 0)
            score += goal_score
            if goal_score > 7:
                matches.append(f"Beleggingsdoel: {investment_goal}")
            elif goal_score < 3:
                penalties.append(f"Niet optimaal voor beleggingsdoel: {investment_goal}")
        
        # Andere scoring criteria
        # [Code voor andere criteria]
        
        # Calculate score based on investment horizon
        if investment_horizon and "investment_horizon" in bank["recommendation_points"]:
            horizon_score = bank["recommendation_points"]["investment_horizon"].get(investment_horizon, 0)
            score += horizon_score
            if horizon_score > 7:
                matches.append(f"Beleggingshorizon: {investment_horizon}")
            elif horizon_score < 3:
                penalties.append(f"Niet optimaal voor tijdshorizon: {investment_horizon}")

        # Calculate score based on management style
        if management_style and "management_style" in bank["recommendation_points"]:
            style_score = bank["recommendation_points"]["management_style"].get(management_style, 0)
            score += style_score
            if style_score > 7:
                matches.append(f"Beheerstijl: {management_style}")
            elif style_score < 3:
                penalties.append(f"Niet optimaal voor beheerstijl: {management_style}")

        # Calculate score based on preference
        if preference and "preferences" in bank["recommendation_points"]:
            pref_score = bank["recommendation_points"]["preferences"].get(preference, 0)
            score += pref_score
            if pref_score > 7:
                matches.append(f"Voorkeur: {preference}")
            elif pref_score < 3:
                penalties.append(f"Niet optimaal voor voorkeur: {preference}")

        # Check if amount is in range
        if "amount_range" in bank["target_profiles"]:
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
            "logo": bank["logo"],
            "description": bank["description"],
            "strengths": bank["strengths"],
            "weaknesses": bank["weaknesses"],
            "matchScore": match_percentage,
            "key_matches": matches,
            "key_mismatches": penalties,
            "rating": bank_rating  # Gebruik de geconverteerde bank_rating
        })
    
    # Log uitgefilterde banken
    print(f"[DEBUG {current_timestamp}] Uitgefilterde banken: {', '.join(filtered_banks) if filtered_banks else 'geen'}")
    
    # Sort results by match score
    bank_scores.sort(key=lambda x: x["matchScore"], reverse=True)
    
    # Debug welke banken in de top 3 zitten vóór retourneren
    for i, bank in enumerate(bank_scores[:3], 1):
        print(f"[DEBUG {current_timestamp}] Top {i}: {bank['id']} - Score: {bank['matchScore']}, Rating: {bank['rating']}")
    
    # Voeg een force-unique indicator toe aan resultaten om caching tegen te gaan
    final_results = bank_scores[:3]
    for bank in final_results:
        bank["_nocache"] = current_timestamp
    
    # Return top 3 banks
    return final_results