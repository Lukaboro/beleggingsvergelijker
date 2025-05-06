# backend/app/data/bank_data.py

# Dit is de data die we gebruiken voor het matchen van banken met gebruikers
BANK_DATA = [
    {
        "id": "bank1",
        "name": "Nova Invest",
        "logo": "nova_invest.svg",
        "description": "Innovatieve online broker gericht op zelfstandige beleggers",
        "strengths": [
            "Lage kosten en transparante tarieven",
            "Uitgebreid educatief platform",
            "Eenvoudige en intuïtieve interface"
        ],
        "weaknesses": [
            "Beperkte persoonlijke ondersteuning",
            "Geen fysieke kantoren"
        ],
        "target_profiles": {
            "investment_goal": ["groei", "inkomen"],
            "investment_horizon": ["3-10 jaar", ">10 jaar"],
            "management_style": ["zelf doen", "met hulp"],
            "preferences": ["lage kosten"],
            "amount_range": [0, 100000]
        },
        "recommendation_points": {
            "investment_goal": {
                "groei": 10,
                "pensioen": 5,
                "kapitaalbehoud": 2,
                "inkomen": 7
            },
            "investment_horizon": {
                "<3 jaar": 2,
                "3-10 jaar": 10,
                ">10 jaar": 8
            },
            "management_style": {
                "zelf doen": 10,
                "met hulp": 7,
                "volledig uitbesteden": 0
            },
            "preferences": {
                "lage kosten": 10,
                "duurzaamheid": 5,
                "vertrouwen/advies": 2
            }
        }
    },
    {
        "id": "bank2",
        "name": "GreenCap",
        "logo": "greencap.svg",
        "description": "Duurzame vermogensbeheerder met focus op impact investing",
        "strengths": [
            "Specialisatie in duurzame beleggingsstrategieën",
            "Persoonlijke begeleiding door experts",
            "Transparante impact rapportage"
        ],
        "weaknesses": [
            "Hogere kosten dan pure online aanbieders",
            "Beperkt aanbod niet-duurzame beleggingen"
        ],
        "target_profiles": {
            "investment_goal": ["groei", "pensioen"],
            "investment_horizon": ["3-10 jaar", ">10 jaar"],
            "management_style": ["met hulp", "volledig uitbesteden"],
            "preferences": ["duurzaamheid"],
            "amount_range": [25000, 250000]
        },
        "recommendation_points": {
            "investment_goal": {
                "groei": 0,
                "pensioen": 9,
                "kapitaalbehoud": 6,
                "inkomen": 5
            },
            "investment_horizon": {
                "<3 jaar": 3,
                "3-10 jaar": 7,
                ">10 jaar": 10
            },
            "management_style": {
                "zelf doen": 2,
                "met hulp": 10,
                "volledig uitbesteden": 8
            },
            "preferences": {
                "lage kosten": 3,
                "duurzaamheid": 10,
                "vertrouwen/advies": 7
            }
        }
    },
    {
        "id": "bank3",
        "name": "Fortex",
        "logo": "fortex.svg",
        "description": "Traditionele bank met uitgebreide vermogensplanning en advies",
        "strengths": [
            "Persoonlijke adviseur en lokale kantoren",
            "Volledig geïntegreerde bankdiensten",
            "Focus op veiligheid en stabiliteit"
        ],
        "weaknesses": [
            "Hogere kosten voor transacties en beheer",
            "Minder innovatieve beleggingsopties"
        ],
        "target_profiles": {
            "investment_goal": ["pensioen", "kapitaalbehoud"],
            "investment_horizon": ["<3 jaar", "3-10 jaar", ">10 jaar"],
            "management_style": ["met hulp", "volledig uitbesteden"],
            "preferences": ["vertrouwen/advies"],
            "amount_range": [50000, 250000]
        },
        "recommendation_points": {
            "investment_goal": {
                "groei": 0,
                "pensioen": 10,
                "kapitaalbehoud": 10,
                "inkomen": 8
            },
            "investment_horizon": {
                "<3 jaar": 7,
                "3-10 jaar": 8,
                ">10 jaar": 9
            },
            "management_style": {
                "zelf doen": 0,
                "met hulp": 8,
                "volledig uitbesteden": 10
            },
            "preferences": {
                "lage kosten": 2,
                "duurzaamheid": 5,
                "vertrouwen/advies": 10
            }
        }
    }
]