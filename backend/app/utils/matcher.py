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
    amount = user_preferences.get("amount", 0)
    
    for bank in BANK_DATA:
        score = 0
        
        # Calculate score based on investment goal
        if investment_goal and "investment_goal" in bank["recommendation_points"]:
            score += bank["recommendation_points"]["investment_goal"].get(investment_goal, 0)
            
        # Calculate score based on investment horizon
        if investment_horizon and "investment_horizon" in bank["recommendation_points"]:
            score += bank["recommendation_points"]["investment_horizon"].get(investment_horizon, 0)
            
        # Calculate score based on management style
        if management_style and "management_style" in bank["recommendation_points"]:
            score += bank["recommendation_points"]["management_style"].get(management_style, 0)
            
        # Calculate score based on preference
        if preference and "preferences" in bank["recommendation_points"]:
            score += bank["recommendation_points"]["preferences"].get(preference, 0)
            
        # Check if amount is in range
        if "amount_range" in bank["target_profiles"]:
            min_amount, max_amount = bank["target_profiles"]["amount_range"]
            if not (min_amount <= amount <= max_amount):
                score -= 5  # Penalty if amount is out of range
        
        bank_scores.append({
            "id": bank["id"],
            "name": bank["name"],
            "logo": bank["logo"],
            "description": bank["description"],
            "strengths": bank["strengths"],
            "weaknesses": bank["weaknesses"],
            "score": score
        })
    
    # Sort banks by score (highest first)
    bank_scores.sort(key=lambda x: x["score"], reverse=True)
    
    return bank_scores[:3]  # Return top 3 matches