# backend/app/utils/pdf_generator.py

import os
from datetime import datetime
from jinja2 import Environment, FileSystemLoader
import pdfkit
from typing import Dict, List, Any

def generate_report(preferences: Dict[str, Any], matches: List[Dict]) -> str:
    """
    Generate a report based on user preferences and matched banks
    """
    # Huidige directory van het script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Ga twee niveaus omhoog (van /app/utils naar /) en dan naar /app/templates
    template_dir = os.path.join(os.path.dirname(os.path.dirname(current_dir)), "app", "templates")

    # Setup Jinja2 environment
    env = Environment(loader=FileSystemLoader(template_dir))
    template = env.get_template("report_template.html")
    
    # Prepare data for template
    today = datetime.now().strftime("%d-%m-%Y")
    
    # Map preference codes to readable text
    preference_labels = {
        "investment_goal": {
            "groei": "Vermogensgroei op lange termijn",
            "pensioen": "Pensioenopbouw",
            "kapitaalbehoud": "Behoud van kapitaal met beperkt risico",
            "inkomen": "Genereren van regelmatig inkomen"
        },
        "investment_horizon": {
            "<3 jaar": "Korte termijn (minder dan 3 jaar)",
            "3-10 jaar": "Middellange termijn (3 tot 10 jaar)",
            ">10 jaar": "Lange termijn (meer dan 10 jaar)"
        },
        "management_style": {
            "zelf doen": "Zelf beleggen (volledige controle)",
            "met hulp": "Met begeleiding (advies, maar zelf beslissen)",
            "volledig uitbesteden": "Volledig uitbesteden (vermogensbeheer)"
        },
        "preference": {
            "lage kosten": "Lage kosten en transparante tarieven",
            "duurzaamheid": "Duurzaam en maatschappelijk verantwoord beleggen",
            "vertrouwen/advies": "Persoonlijk advies en vertrouwen"
        }
    }
    
    # Create readable preferences
    readable_preferences = {
        "investment_goal": preference_labels["investment_goal"].get(preferences.get("investment_goal", ""), "Onbekend"),
        "investment_horizon": preference_labels["investment_horizon"].get(preferences.get("investment_horizon", ""), "Onbekend"),
        "management_style": preference_labels["management_style"].get(preferences.get("management_style", ""), "Onbekend"),
        "preference": preference_labels["preference"].get(preferences.get("preference", ""), "Onbekend"),
        "amount": f"€{preferences.get('amount', 0):,}".replace(",", ".")
    }
    
    # Render HTML template
    html_content = template.render(
        date=today,
        preferences=readable_preferences,
        matches=matches
    )
    
    # Create output directory if it doesn't exist
    os.makedirs("reports", exist_ok=True)
    
    # Generate unique filename - gebruik .html in plaats van .pdf
    filename = f"beleggingsadvies_{datetime.now().strftime('%Y%m%d%H%M%S')}.html"
    output_path = f"reports/{filename}"
    
    # Write HTML directly to file in plaats van PDF genereren
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    # Return URL to download the report
    return f"/api/reports/{filename}"