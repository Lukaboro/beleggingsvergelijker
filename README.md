# BeleggingsTinder
"Prototype voor een gepersonaliseerde beleggingsvergelijker in React & FastAPI"

Een interactieve webapplicatie die gebruikers helpt om op basis van hun voorkeuren de best passende beleggingspartner te vinden. Dit prototype is ontworpen om gebruikersfeedback te verzamelen, ervaring op te doen met de gebruikersflow, en leads te genereren.

## 📋 Functionaliteiten

- **Introductiepagina** met uitleg over de service
- **Stapsgewijze vragenflow** met vragen over beleggingsdoelen, horizon, beheerstijl en voorkeuren
- **Resultaatpagina** met drie op maat gemaakte aanbevelingen
- **Leadformulier** voor gebruikers die contact willen opnemen
- **Persoonlijk rapport** dat gebruikers kunnen downloaden (dummy prototype)
- **About & disclaimer pagina**
Dit prototype focust op gebruiksvriendelijkheid, personalisatie en feedbackverzameling.

## 🔧 Technische Stack

### Frontend
- **React.js** - Voor een interactieve en responsieve gebruikersinterface
- **TailwindCSS** - Voor styling
- **React Router** - Voor navigatie
- **React Hook Form** - Voor formuliervalidatie

### Backend
- **FastAPI (Python)** - Lichtgewicht en snel framework voor de API
- **Jinja2** - Voor het genereren van PDF-rapporten

### Dataopslag
- JSON-bestand voor bankgegevens (geen database voor het prototype)
- CSV-export voor leads

## 🚀 Installatie & Setup

### Vereisten
- Node.js (18.x of nieuwer)
- Python (3.8 of nieuwer)
- npm of yarn
→ Open http://localhost:3000 voor frontend
→ Backend draait op http://localhost:8000

### Frontend Installatie
```bash
# Navigeer naar de frontend directory
cd frontend

# Installeer dependencies
npm install

# Start de ontwikkelserver
npm start
```

### Backend Installatie
```bash
# Navigeer naar de backend directory
cd backend

# Installeer dependencies
pip install -r requirements.txt

# Start de server
uvicorn main:app --reload
```

## 🌐 Deployment

### Frontend
De frontend is gedeployed op Vercel: [https://beleggingsvergelijker-pieter-de-knocks-projects.vercel.app/](https://beleggingsvergelijker-pieter-de-knocks-projects.vercel.app/)

### Backend
De backend API is gedeployed op Render: [https://beleggingsvergelijker.onrender.com]

## 📚 Projectstructuur

```
project-root/
├── frontend/                 # React applicatie
│   ├── public/               # Statische bestanden
│   └── src/
│       ├── components/       # Herbruikbare UI componenten
│       ├── pages/            # Pagina's (Intro, Wizard, Resultaat, etc.)
│       ├── assets/           # Afbeeldingen, logo's
│       ├── data/             # Lokale data voor frontend gebruik
│       ├── services/         # API service calls
│       └── utils/            # Helper functies
│
└── backend/                  # FastAPI applicatie
    ├── app/
    │   ├── api/              # API endpoints
    │   ├── core/             # Configuratie en instellingen
    │   ├── data/             # JSON data voor banken en matching logica
    │   ├── templates/        # PDF rapport templates
    │   └── utils/            # Helper functies
    ├── main.py               # FastAPI main applicatie
    └── requirements.txt      # Python dependencies
```

## 👥 Gebruiksscenario's

- **Gebruiker 1**: jong, wil zelf beleggen, lage kosten → krijgt Keytrade-achtig voorstel
- **Gebruiker 2**: ouder, zoekt duurzaamheid, wil begeleiding → krijgt duurzame vermogensbeheerder
- **Gebruiker 3**: gepensioneerd, zoekt veiligheid, wil advies → krijgt klassieke bank als match

## 📝 Ontwikkeling

Dit is een prototype en heeft momenteel de volgende beperkingen:
- Geen live bankdata of API-integraties
- Geen automatische rapportgeneratie (dummy is voldoende)
- Geen login- of gebruikersprofiel

## 📄 Juridisch

- **Disclaimer**: Geen beleggingsadvies, enkel informatief
- **Privacybeleid**: Leadgegevens worden niet gedeeld of verkocht
- **Toestemming**: Expliciete toestemming voor e-mailopvolging vereist

## 🔮 Toekomstige ontwikkelingen

- Integratie met echte bankdata via API's
- Uitgebreidere vragenlijst met meer factoren
- Geavanceerd matchingalgoritme
- Automatische generatie van genuanceerde rapporten
- Dashboard voor gebruikers om meerdere vergelijkingen te bewaren

📫 Contact
Feel free to connect or follow my journey:

🔗 LinkedIn – Pieter De Knock
🌍 oudeschoolkaarten.be
---

Ontwikkeld door [Pieter De Knock] - 2025