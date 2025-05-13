# Dit is de data die we gebruiken voor het matchen van banken met gebruikers

# backend/app/data/bank_data.py

BANK_DATA = [
    {
        "id": "kbc",
        "name": "KBC",
        "logo": "kbc.svg",
        "description": "Sterk vertegenwoordigde bank met zowel retail als private banking, inzet op digitale innovatie.",
        "strengths": [
            "Gebruiksvriendelijke app en digitale tools",
            "Groot kantorennetwerk en lokale aanwezigheid",
            "Sterke reputatie bij particuliere beleggers"
        ],
        "weaknesses": [
            "Minder scherpe tarieven",
            "Beperkte flexibiliteit in beleggingskeuzes"
        ],
        "target_profiles": {
            "investment_goal": ["groei", "pensioen"],
            "investment_horizon": ["3-10 jaar", ">10 jaar"],
            "management_style": ["met hulp", "volledig uitbesteden"],
            "preferences": ["vertrouwen/advies", "duurzaamheid"],
            "amount_range": [10000, 250000]
        },
        "recommendation_points": {
            "investment_goal": {
                "groei": 7,
                "pensioen": 8,
                "kapitaalbehoud": 5,
                "inkomen": 6
            },
            "investment_horizon": {
                "<3 jaar": 3,
                "3-10 jaar": 8,
                ">10 jaar": 9
            },
            "management_style": {
                "zelf doen": 4,
                "met hulp": 8,
                "volledig uitbesteden": 9
            },
            "preferences": {
                "lage kosten": 3,
                "duurzaamheid": 7,
                "vertrouwen/advies": 10
            }
        }
    },
    {
        "id": "bnp",
        "name": "BNP Paribas Fortis",
        "logo": "bnp.svg",
        "description": "Grote Belgische bank met breed beleggingsaanbod, inclusief duurzame en internationale fondsen.",
        "strengths": [
            "Sterke internationale expertise",
            "Breed fondsenaanbod, ook ESG",
            "Solide adviesverlening"
        ],
        "weaknesses": [
            "Minder flexibel voor zelfbeleggers",
            "Niet de goedkoopste optie"
        ],
        "target_profiles": {
            "investment_goal": ["pensioen", "kapitaalbehoud"],
            "investment_horizon": ["3-10 jaar", ">10 jaar"],
            "management_style": ["met hulp", "volledig uitbesteden"],
            "preferences": ["vertrouwen/advies", "duurzaamheid"],
            "amount_range": [25000, 500000]
        },
        "recommendation_points": {
            "investment_goal": {
                "groei": 5,
                "pensioen": 10,
                "kapitaalbehoud": 9,
                "inkomen": 6
            },
            "investment_horizon": {
                "<3 jaar": 3,
                "3-10 jaar": 8,
                ">10 jaar": 10
            },
            "management_style": {
                "zelf doen": 2,
                "met hulp": 9,
                "volledig uitbesteden": 10
            },
            "preferences": {
                "lage kosten": 2,
                "duurzaamheid": 9,
                "vertrouwen/advies": 10
            }
        }
    },
    {
        "id": "argenta",
        "name": "Argenta",
        "logo": "argenta.svg",
        "description": "Toegankelijke bank met focus op eenvoud en lage kosten, populair bij spaarders en starters.",
        "strengths": [
            "Zeer lage kostenstructuur",
            "Eenvoudige, begrijpelijke producten",
            "Sterk in klassieke beleggingsfondsen"
        ],
        "weaknesses": [
            "Beperkt adviesaanbod",
            "Minder geschikt voor vermogende klanten"
        ],
        "target_profiles": {
            "investment_goal": ["groei", "kapitaalbehoud"],
            "investment_horizon": ["3-10 jaar"],
            "management_style": ["zelf doen", "met hulp"],
            "preferences": ["lage kosten"],
            "amount_range": [2500, 50000]
        },
        "recommendation_points": {
            "investment_goal": {
                "groei": 7,
                "pensioen": 4,
                "kapitaalbehoud": 6,
                "inkomen": 3
            },
            "investment_horizon": {
                "<3 jaar": 4,
                "3-10 jaar": 9,
                ">10 jaar": 5
            },
            "management_style": {
                "zelf doen": 9,
                "met hulp": 7,
                "volledig uitbesteden": 2
            },
            "preferences": {
                "lage kosten": 10,
                "duurzaamheid": 4,
                "vertrouwen/advies": 4
            }
        }
    },
    {
        "id": "crelan",
        "name": "Crelan-Axa",
        "logo": "crelan.svg",
        "description": "Coöperatieve bank met persoonlijke service en lokale verankering, fusie met AXA Bank versterkt positie.",
        "strengths": [
            "Persoonlijke aanpak via lokale kantoren",
            "Breed aanbod klassieke fondsen",
            "Sterk in relatiebankieren"
        ],
        "weaknesses": [
            "Beperkte digitale innovatie",
            "Beperkte toegang tot nichemarkten of themafondsen"
        ],
        "target_profiles": {
            "investment_goal": ["pensioen", "kapitaalbehoud"],
            "investment_horizon": ["3-10 jaar", ">10 jaar"],
            "management_style": ["met hulp"],
            "preferences": ["vertrouwen/advies"],
            "amount_range": [10000, 150000]
        },
        "recommendation_points": {
            "investment_goal": {
                "groei": 4,
                "pensioen": 8,
                "kapitaalbehoud": 9,
                "inkomen": 6
            },
            "investment_horizon": {
                "<3 jaar": 3,
                "3-10 jaar": 7,
                ">10 jaar": 7
            },
            "management_style": {
                "zelf doen": 3,
                "met hulp": 9,
                "volledig uitbesteden": 5
            },
            "preferences": {
                "lage kosten": 5,
                "duurzaamheid": 6,
                "vertrouwen/advies": 9
            }
        }
    },
    {
        "id": "ing",
        "name": "ING",
        "logo": "ing.svg",
        "description": "Internationale speler met zowel digitale zelfbelegging als begeleiding via adviseurs.",
        "strengths": [
            "Goede online tools en beleggingsplatform",
            "Internationaal aanbod",
            "Combinatie van zelf beleggen en advies mogelijk"
        ],
        "weaknesses": [
            "Niet de goedkoopste optie",
            "Beperkte focus op Belgische fondsen"
        ],
        "target_profiles": {
            "investment_goal": ["groei", "inkomen"],
            "investment_horizon": ["3-10 jaar", ">10 jaar"],
            "management_style": ["zelf doen", "met hulp"],
            "preferences": ["lage kosten", "duurzaamheid"],
            "amount_range": [5000, 200000]
        },
        "recommendation_points": {
            "investment_goal": {
                "groei": 8,
                "pensioen": 6,
                "kapitaalbehoud": 4,
                "inkomen": 7
            },
            "investment_horizon": {
                "<3 jaar": 3,
                "3-10 jaar": 8,
                ">10 jaar": 8
            },
            "management_style": {
                "zelf doen": 9,
                "met hulp": 8,
                "volledig uitbesteden": 3
            },
            "preferences": {
                "lage kosten": 7,
                "duurzaamheid": 6,
                "vertrouwen/advies": 5
            }
        }
    },
    {
        "id": "belfius",
        "name": "Belfius",
        "logo": "belfius.svg",
        "description": "Sterk in digitale innovatie én lokaal verankerde dienstverlening, met groeiende focus op duurzaam beleggen.",
        "strengths": [
            "Innovatieve beleggingsapp",
            "Goede balans tussen digitaal en persoonlijk",
            "Focus op duurzame fondsen"
        ],
        "weaknesses": [
            "Niet de goedkoopste keuze",
            "Beperkt internationaal aanbod"
        ],
        "target_profiles": {
            "investment_goal": ["groei", "pensioen"],
            "investment_horizon": ["3-10 jaar", ">10 jaar"],
            "management_style": ["met hulp", "volledig uitbesteden"],
            "preferences": ["duurzaamheid", "vertrouwen/advies"],
            "amount_range": [10000, 300000]
        },
        "recommendation_points": {
            "investment_goal": {
                "groei": 7,
                "pensioen": 9,
                "kapitaalbehoud": 5,
                "inkomen": 5
            },
            "investment_horizon": {
                "<3 jaar": 3,
                "3-10 jaar": 9,
                ">10 jaar": 9
            },
            "management_style": {
                "zelf doen": 4,
                "met hulp": 9,
                "volledig uitbesteden": 8
            },
            "preferences": {
                "lage kosten": 4,
                "duurzaamheid": 9,
                "vertrouwen/advies": 9
            }
        }
    },
    {
        "id": "beobank",
        "name": "Beobank",
        "logo": "beobank.svg",
        "description": "Toegankelijke bank met focus op persoonlijke service, relatief klein aanbod beleggingsproducten.",
        "strengths": [
            "Laagdrempelig advies voor starters",
            "Lokale aanwezigheid",
            "Vriendelijke, persoonlijke aanpak"
        ],
        "weaknesses": [
            "Beperkt beleggingsaanbod",
            "Weinig digitale tools"
        ],
        "target_profiles": {
            "investment_goal": ["pensioen", "inkomen"],
            "investment_horizon": ["3-10 jaar"],
            "management_style": ["met hulp"],
            "preferences": ["vertrouwen/advies"],
            "amount_range": [5000, 75000]
        },
        "recommendation_points": {
            "investment_goal": {
                "groei": 4,
                "pensioen": 7,
                "kapitaalbehoud": 6,
                "inkomen": 7
            },
            "investment_horizon": {
                "<3 jaar": 2,
                "3-10 jaar": 8,
                ">10 jaar": 6
            },
            "management_style": {
                "zelf doen": 3,
                "met hulp": 8,
                "volledig uitbesteden": 5
            },
            "preferences": {
                "lage kosten": 5,
                "duurzaamheid": 3,
                "vertrouwen/advies": 8
            }
        }
    },
    {
        "id": "delen",
        "name": "Bank Delen",
        "logo": "delen.svg",
        "description": "Private bank met focus op vermogensbeheer, gespecialiseerd in familiale vermogens en ondernemers.",
        "strengths": [
            "Zeer persoonlijke aanpak",
            "Ervaren vermogensbeheerders",
            "Sterke reputatie in discretionair beheer"
        ],
        "weaknesses": [
            "Enkel voor grotere portefeuilles",
            "Beperkte transparantie in kosten"
        ],
        "target_profiles": {
            "investment_goal": ["kapitaalbehoud", "pensioen"],
            "investment_horizon": [">10 jaar"],
            "management_style": ["volledig uitbesteden"],
            "preferences": ["vertrouwen/advies"],
            "amount_range": [250000, 5000000]
        },
        "recommendation_points": {
            "investment_goal": {
                "groei": 2,
                "pensioen": 9,
                "kapitaalbehoud": 10,
                "inkomen": 8
            },
            "investment_horizon": {
                "<3 jaar": 2,
                "3-10 jaar": 5,
                ">10 jaar": 10
            },
            "management_style": {
                "zelf doen": 0,
                "met hulp": 4,
                "volledig uitbesteden": 10
            },
            "preferences": {
                "lage kosten": 2,
                "duurzaamheid": 5,
                "vertrouwen/advies": 10
            }
        }
    },
    {
        "id": "degroof",
        "name": "Degroof Petercam",
        "logo": "degroof.svg",
        "description": "Exclusieve private bank met hoogstaande expertise in beleggingen, fiscaliteit en estate planning.",
        "strengths": [
            "Hoogstaande expertise in financiële planning",
            "Ruime toegang tot institutionele beleggingen",
            "Sterk netwerk binnen family offices"
        ],
        "weaknesses": [
            "Enkel voor zeer vermogende klanten",
            "Complexe rapportering"
        ],
        "target_profiles": {
            "investment_goal": ["kapitaalbehoud", "pensioen"],
            "investment_horizon": [">10 jaar"],
            "management_style": ["volledig uitbesteden"],
            "preferences": ["vertrouwen/advies"],
            "amount_range": [500000, 10000000]
        },
        "recommendation_points": {
            "investment_goal": {
                "groei": 1,
                "pensioen": 8,
                "kapitaalbehoud": 10,
                "inkomen": 7
            },
            "investment_horizon": {
                "<3 jaar": 1,
                "3-10 jaar": 4,
                ">10 jaar": 10
            },
            "management_style": {
                "zelf doen": 0,
                "met hulp": 4,
                "volledig uitbesteden": 10
            },
            "preferences": {
                "lage kosten": 1,
                "duurzaamheid": 6,
                "vertrouwen/advies": 10
            }
        }
    }
]