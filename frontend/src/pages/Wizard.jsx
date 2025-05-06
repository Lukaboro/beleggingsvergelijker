// frontend/src/pages/Wizard.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import API_URL from '../data/apiConfig';

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

  // Controleer of currentStep een geldige waarde heeft
  if (currentStep < 0 || currentStep >= questions.length) {
    console.error(`Ongeldige currentStep waarde: ${currentStep}`);
    // Herstel naar een veilige waarde
    setCurrentStep(0);
    return <div className="p-8 text-center">Laden...</div>;
  }

  // Nu weten we zeker dat currentQuestion geldig is
  const currentQuestion = questions[currentStep];

  const handleNext = (answer) => {
    console.log(`Antwoord ontvangen voor vraag ${currentStep + 1}:`, answer);
    
    const updatedAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(updatedAnswers);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitAnswers(updatedAnswers);
    }
  };

  const submitAnswers = async (userAnswers) => {
    console.log("Versturen van antwoorden naar backend:", userAnswers);
    console.log("API URL:", `${API_URL}/match`);
    
    try {
      const response = await fetch(`${API_URL}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userAnswers),
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("API response data:", data);
      
      localStorage.setItem('matchResults', JSON.stringify(data.matches));
      localStorage.setItem('userPreferences', JSON.stringify(userAnswers));
      navigate('/results');
    } catch (error) {
      console.error('Error submitting answers:', error);
      
      // Fallback naar mock data
      const mockMatches = [
        {
          id: "bank1",
          name: "Nova Invest",
          logo: "nova_invest.svg",
          description: "Innovatieve online broker gericht op zelfstandige beleggers",
          strengths: [
            "Lage kosten en transparante tarieven",
            "Uitgebreid educatief platform",
            "Eenvoudige en intuïtieve interface"
          ],
          weaknesses: [
            "Beperkte persoonlijke ondersteuning",
            "Geen fysieke kantoren"
          ],
          matchScore: 85
        },
        {
          id: "bank2",
          name: "GreenCap",
          logo: "greencap.svg",
          description: "Duurzame vermogensbeheerder met focus op impact investing",
          strengths: [
            "Specialisatie in duurzame beleggingsstrategieën",
            "Persoonlijke begeleiding door experts",
            "Transparante impact rapportage"
          ],
          weaknesses: [
            "Hogere kosten dan pure online aanbieders",
            "Beperkt aanbod niet-duurzame beleggingen"
          ],
          matchScore: 70
        },
        {
          id: "bank3",
          name: "Fortex",
          logo: "fortex.svg",
          description: "Traditionele bank met uitgebreide vermogensplanning en advies",
          strengths: [
            "Persoonlijke adviseur en lokale kantoren",
            "Volledig geïntegreerde bankdiensten",
            "Focus op veiligheid en stabiliteit"
          ],
          weaknesses: [
            "Hogere kosten voor transacties en beheer",
            "Minder innovatieve beleggingsopties"
          ],
          matchScore: 60
        }
      ];
      
      localStorage.setItem('matchResults', JSON.stringify(mockMatches));
      localStorage.setItem('userPreferences', JSON.stringify(userAnswers));
      navigate('/results');
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Titel boven de progress bar */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">
            Jouw persoonlijke beleggingsprofiel
          </h1>
          <p className="text-gray-600">
            Beantwoord een paar korte vragen. We vinden de partner die bij je past.
          </p>
        </div>

        <ProgressBar progress={progress} />

        <div className="text-center mt-6 mb-2">
          <span className="text-sm font-medium text-gray-500">
            Vraag {currentStep + 1} van {questions.length}
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mt-4">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

export default Wizard;
