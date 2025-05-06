// frontend/src/pages/Wizard.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';

const questions = [
  {
    id: 'investment_goal',
    title: 'Wat is je belangrijkste beleggingsdoel?',
    description: 'Kies het doel dat het beste bij je situatie past.',
    options: [
      { value: 'groei', label: 'Vermogensgroei op lange termijn' },
      { value: 'pensioen', label: 'Pensioenopbouw' },
      { value: 'kapitaalbehoud', label: 'Behoud van kapitaal met beperkt risico' },
      { value: 'inkomen', label: 'Genereren van regelmatig inkomen' },
    ],
  },
  {
    id: 'investment_horizon',
    title: 'Hoe lang ben je van plan te beleggen?',
    description: 'Je beleggingshorizon bepaalt mede je risicoprofiel.',
    options: [
      { value: '<3 jaar', label: 'Korte termijn (minder dan 3 jaar)' },
      { value: '3-10 jaar', label: 'Middellange termijn (3 tot 10 jaar)' },
      { value: '>10 jaar', label: 'Lange termijn (meer dan 10 jaar)' },
    ],
  },
  {
    id: 'management_style',
    title: 'Hoe wil je je beleggingen beheren?',
    description: 'Kies de beheerstijl die het beste bij je past.',
    options: [
      { value: 'zelf doen', label: 'Zelf beleggen (volledige controle)' },
      { value: 'met hulp', label: 'Met begeleiding (advies, maar zelf beslissen)' },
      { value: 'volledig uitbesteden', label: 'Volledig uitbesteden (vermogensbeheer)' },
    ],
  },
  {
    id: 'preference',
    title: 'Wat is voor jou het belangrijkste bij het kiezen van een beleggingspartner?',
    description: 'Kies de factor die voor jou het zwaarst weegt.',
    options: [
      { value: 'lage kosten', label: 'Lage kosten en transparante tarieven' },
      { value: 'duurzaamheid', label: 'Duurzaam en maatschappelijk verantwoord beleggen' },
      { value: 'vertrouwen/advies', label: 'Persoonlijk advies en vertrouwen' },
    ],
  },
  {
    id: 'amount',
    title: 'Welk bedrag ben je van plan te beleggen?',
    description: 'Sleep de slider naar het gewenste bedrag.',
    type: 'slider',
    min: 0,
    max: 250000,
    step: 1000,
    defaultValue: 25000,
  },
];

const Wizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  
  const handleNext = (answer) => {
    console.log("Wizard handleNext opgeroepen met:", answer, "voor vraag:", questions[currentStep].id);
    
    // Zorg ervoor dat het antwoord wordt opgeslagen in de staat
    const updatedAnswers = { ...answers, [questions[currentStep].id]: answer };
    setAnswers(updatedAnswers);
    
    if (currentStep < questions.length - 1) {
      // Ga naar de volgende vraag
      setCurrentStep(currentStep + 1);
    } else {
      // Dit is de laatste vraag, verstuur antwoorden naar backend
      console.log("Alle vragen beantwoord, verstuur antwoorden:", updatedAnswers);
      submitAnswers(updatedAnswers);
    }
  };
  
  const submitAnswers = async (userAnswers) => {
    console.log("Versturen van antwoorden naar backend:", userAnswers);
    
    try {
      // Gebruik mock data voor test deployment
      const mockMatches = [
        {
          id: 1,
          name: "BeleggenPlus",
          logo: "bank1.png",
          description: "Ideaal voor beginners met focus op duurzaamheid",
          strengths: [
            "Lage minimum inleg (vanaf €100)",
            "Uitgebreide educatieve content",
            "Focus op duurzame beleggingen"
          ],
          weaknesses: [
            "Minder persoonlijke begeleiding",
            "Beperktere keuze in fondsen"
          ],
          matchScore: 92
        },
        {
          id: 2,
          name: "KapitaalGroei",
          logo: "bank2.png",
          description: "Traditionele aanpak met persoonlijk advies",
          strengths: [
            "Ervaren adviseurs beschikbaar",
            "Volledige portefeuillebeheer mogelijk",
            "Bewezen langetermijnresultaten"
          ],
          weaknesses: [
            "Hogere beheerkosten",
            "Minimum inleg van €10.000"
          ],
          matchScore: 78
        },
        {
          id: 3,
          name: "InvestNext",
          logo: "bank3.png",
          description: "Innovatief platform met lage kosten",
          strengths: [
            "Zeer lage beheerskosten",
            "Geavanceerde mobiele app",
            "Automatisch herbalanceren"
          ],
          weaknesses: [
            "Geen persoonlijk advies",
            "Nieuwere speler op de markt"
          ],
          matchScore: 67
        }
      ];
      
      // Sla mock resultaten op in localStorage
      localStorage.setItem('matchResults', JSON.stringify(mockMatches));
      localStorage.setItem('userPreferences', JSON.stringify(userAnswers));
      
      // Navigeer naar resultaten pagina
      navigate('/results');
    } catch (error) {
      console.error('Error submitting answers:', error);
      // Toon foutmelding
      alert("Er is een fout opgetreden bij het verwerken van je antwoorden. Probeer het later opnieuw.");
    }
  };
  
  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <ProgressBar progress={progress} />
      
      <div className="mt-6 text-center">
        <span className="text-sm font-medium text-gray-500">
          Vraag {currentStep + 1} van {questions.length}
        </span>
      </div>
      
      <QuestionCard
        key={currentQuestion.id} // Voeg key toe om re-render te forceren bij vraagwijziging
        question={currentQuestion}
        onAnswer={handleNext}
      />
    </div>
  );
};

export default Wizard;