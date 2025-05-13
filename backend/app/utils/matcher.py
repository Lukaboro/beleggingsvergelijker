from typing import Dict, List, Any
from app.data.bank_data import BANK_DATA

def calculate_bank_scores(user_preferences: Dict[str, Any]) -> List[Dict]:
    """
    Calculate scores for each bank based on user preferences
    """
    # Extra debug logging aan het begin
    print("="*50)
    print("ONTVANGEN USER PREFERENCES:")
    for key, value in user_preferences.items():
        print(f"  {key}: {value} (type: {type(value).__name__})")
    print("="*50)
    
    bank_scores = []

    # Extract user preferences
    investment_goal = user_preferences.get("investment_goal")
    investment_horizon = user_preferences.get("investment_horizon")
    management_style = user_preferences.get("management_style")
    preference = user_preferences.get("preference")
    amount = int(user_preferences.get("amount", 0))  # Zorg ervoor dat amount een integer is

    # EXTRA DEBUG: Controleer specifiek voor min_rating en alternatieve sleutelwoorden
    print("Direct controleren op verschillende mogelijke sleutels voor min_rating:")
    for possible_key in ["min_rating", "minimum_rating", "rating", "minimale_rating", "minimum_rating"]:
        value = user_preferences.get(possible_key)
        print(f"  - Sleutel '{possible_key}': {value}")

    # Veilige conversie van min_rating
    min_rating_raw = user_preferences.get("min_rating")
    print(f"Gevonden min_rating_raw: {min_rating_raw} (type: {type(min_rating_raw).__name__})")
    
    try:
        min_rating = int(min_rating_raw) if min_rating_raw is not None else None
        # Als 0, behandel als geen voorkeur
        if min_rating == 0:
            print("min_rating is 0 ('Geen voorkeur'), zetten op None voor geen filtering")
            min_rating = None
    except (TypeError, ValueError):
        print(f"Fout bij conversie van min_rating '{min_rating_raw}' naar int")
        min_rating = None

    # Debug log
    print(f"Uiteindelijke min_rating voor filtering: {min_rating}")
    print("Alle banken en hun ratings:")
    for bank in BANK_DATA:
        print(f"  - {bank['name']}: {bank.get('rating', 'Geen rating')}")

    # Lijst om uitgesloten banken bij te houden
    excluded_banks = []
    
    for bank in BANK_DATA:
        # Filter op minimale rating indien opgegeven
        bank_rating = bank.get("rating", 0)
        print(f"Controleren bank {bank['name']} (rating {bank_rating})")
        
        if min_rating is not None and bank_rating < min_rating:
            print(f"  ❌ Bank {bank['name']} UITGESLOTEN door ratingfilter: {bank_rating} < {min_rating}")
            excluded_banks.append(bank['name'])
            continue
        else:
            print(f"  ✓ Bank {bank['name']} voldoet aan rating criteria")

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

    # Uitgebreide debug output voor resultaten
    print("="*50)
    print(f"Uitgesloten banken: {', '.join(excluded_banks) if excluded_banks else 'Geen'}")
    print("Alle banken voor sortering:")
    for bs in bank_scores:
        print(f"Bank: {bs['name']}, Score: {bs['matchScore']}, Rating: {bs['rating']}")
    
    print("="*50)
    print("Sorteren banken op matchScore...")
    bank_scores.sort(key=lambda x: x["matchScore"], reverse=True)
    
    print("Top 3 banken na sortering:")
    for i, bs in enumerate(bank_scores[:3], 1):
        print(f"{i}. {bs['name']}, Score: {bs['matchScore']}, Rating: {bs['rating']}")
    print("="*50)

    return bank_scores[:3]