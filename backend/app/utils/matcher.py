# backend/app/utils/matcher.py

from typing import Dict, List, Any
from app.data.bank_data import BANK_DATA

def calculate_bank_scores(user_preferences: Dict[str, Any]) -> List[Dict]:
    """
    Calculate scores for each bank based on user preferences
    """
    bank_scores = []

    # Extract user preferences
    investment_goal = user_preferences.get("investment_goal")
    investment_horizon = user_preferences.get("investment_horizon")
    management_style = user_preferences.get("management_style")
    preference = user_preferences.get("preference")
    amount = int(user_preferences.get("amount", 0))  # Zorg ervoor dat amount een integer is

    # Veilige conversie van minimum_rating
    min_rating_raw = user_preferences.get("minimum_rating")
    try:
        min_rating = int(min_rating_raw) if min_rating_raw is not None else None
    except (TypeError, ValueError):
        min_rating = None

    # Debug log
    print(f"User preferences: {user_preferences}")

    for bank in BANK_DATA:
        # Filter op minimale rating indien opgegeven
        bank_rating = bank.get("rating", 0)
        if min_rating is not None and bank_rating < min_rating:
            print(f"Bank {bank['name']} uitgesloten door ratingfilter: {bank_rating} < {min_rating}")
            continue

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

    for bs in bank_scores:
        print(f"Bank: {bs['name']}, Score: {bs['matchScore']}, Rating: {bs['rating']}, Matches: {bs['key_matches']}, Mismatches: {bs['key_mismatches']}")

    bank_scores.sort(key=lambda x: x["matchScore"], reverse=True)

    return bank_scores[:3]