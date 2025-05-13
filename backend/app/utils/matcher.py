from typing import Dict, List, Any
from app.data.bank_data import BANK_DATA

def calculate_bank_scores(user_preferences: Dict[str, Any]) -> List[Dict]:
    """
    Calculate scores for each bank based on user preferences
    """
    # Log de belangrijke parameters
    print("="*50)
    print("ONTVANGEN USER PREFERENCES:")
    min_rating_raw = user_preferences.get("min_rating")
    print(f"min_rating: {min_rating_raw} (type: {type(min_rating_raw).__name__})")
    
    # Verwerk min_rating
    try:
        min_rating = int(min_rating_raw) if min_rating_raw is not None else None
        if min_rating == 0:  # Behandel 0 als 'geen voorkeur'
            min_rating = None
    except (TypeError, ValueError):
        min_rating = None
    
    print(f"Verwerkte min_rating: {min_rating}")
    
    # Zoek Argenta in de bankgegevens
    argenta_found = False
    argenta_rating = None
    
    for bank in BANK_DATA:
        if bank["id"] == "argenta":
            argenta_found = True
            argenta_rating = bank.get("rating", 0)
            print(f"Argenta gevonden in BANK_DATA met rating: {argenta_rating}")
            break
    
    if not argenta_found:
        print("Argenta niet gevonden in BANK_DATA!")
    
    # Extract user preferences
    investment_goal = user_preferences.get("investment_goal")
    investment_horizon = user_preferences.get("investment_horizon")
    management_style = user_preferences.get("management_style")
    preference = user_preferences.get("preference")
    amount = int(user_preferences.get("amount", 0))
    
    bank_scores = []
    
    for bank in BANK_DATA:
        # Speciale debugging voor Argenta
        is_argenta = bank["id"] == "argenta"
        
        # Filter op minimale rating indien opgegeven
        bank_rating = bank.get("rating", 0)
        
        if is_argenta:
            print(f"Rating check voor Argenta - bank_rating: {bank_rating}, min_rating: {min_rating}")
            print(f"Zou Argenta uitgesloten moeten worden? {min_rating is not None and bank_rating < min_rating}")
        
        if min_rating is not None and bank_rating < min_rating:
            if is_argenta:
                print("Argenta UITGESLOTEN door rating check!")
            continue
        else:
            if is_argenta:
                print("Argenta GEACCEPTEERD na rating check!")
        
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
        
        # Andere score berekeningen...
        # [behoud de rest van de score berekeningen zoals in je originele code]
        
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
                score -= 10  # Verhoogde penalty als het bedrag buiten bereik is
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
            "rating": bank_rating
        })
    
    # Sorteer de resultaten
    bank_scores.sort(key=lambda x: x["matchScore"], reverse=True)
    
    # Check of Argenta in de top 3 zit
    argenta_in_top3 = any(bank["id"] == "argenta" for bank in bank_scores[:3])
    print(f"Is Argenta in de top 3 resultaten? {argenta_in_top3}")
    
    # Bekijk de top 3 banken
    print("Top 3 banken:")
    for i, bank in enumerate(bank_scores[:3], 1):
        print(f"{i}. {bank['name']} (ID: {bank['id']}) - Score: {bank['matchScore']}, Rating: {bank['rating']}")
    
    # Geef de top 3 banken terug
    return bank_scores[:3]