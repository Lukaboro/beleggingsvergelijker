// frontend/src/pages/Wizard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import API_URL from '../data/apiConfig';

// Vragen array behouden
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
    max: 1000000,
    step: 5000,
    defaultValue: 50000,
  },
];

// Mock data voor gebruik als fallback
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

const Wizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Aparte state voor timeout tracking
  const [timeoutId, setTimeoutId] = useState(null);
  
  // Cleanup effect om timeout te annuleren bij unmount
  useEffect(() => {
    // Wis eerder opgeslagen resultaten om zeker verse data te krijgen
    localStorage.removeItem('matchResults');
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);
  
  const handleNext = (answer) => {
    // Update answers
    const updatedAnswers = { ...answers, [questions[currentStep].id]: answer };
    setAnswers(updatedAnswers);
    
    // Move to next question or submit
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit answers
      submitAnswers(updatedAnswers);
    }
  };
  
  const useFallbackData = (userAnswers, reason) => {
    console.log(`Gebruik fallback data vanwege: ${reason}`);
    
    // Sla mock resultaten op in localStorage
    localStorage.setItem('matchResults', JSON.stringify(mockMatches));
    localStorage.setItem('userPreferences', JSON.stringify(userAnswers));
    
    setIsLoading(false);
    
    // Navigeer naar resultaten
    navigate('/results');
  };
  
  const submitAnswers = async (userAnswers) => {
    console.log("Versturen van antwoorden naar backend:", JSON.stringify(userAnswers));
    console.log("API URL:", `${API_URL}/match`);
    
    setIsLoading(true);
    setError(null);
    
    // Stel timeout in voor 5 seconden
    const timeout = setTimeout(() => {
      console.error("API aanroep timeout na 10 seconden");
      useFallbackData(userAnswers, "API aanroep timeout");
    }, 10000);
    
    setTimeoutId(timeout);
    
    try {
      // De standaard fetch API heeft geen ingebouwde timeout
      // We gebruiken onze eigen timeout-mechanisme
      const response = await fetch(`${API_URL}/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userAnswers),
      });
      
      // Annuleer de timeout omdat we een antwoord hebben
      clearTimeout(timeout);
      setTimeoutId(null);
      
      console.log("Response status:", response.status);
      
      if (response.status === 404) {
        console.error("API endpoint niet gevonden (404)");
        useFallbackData(userAnswers, "API endpoint niet gevonden");
        return;
      }
      
      // Lees de ruwe response tekst voor debugging
      const responseText = await response.text();
      console.log("Ruwe response:", responseText);
      
      // Als het geen geldige JSON is, gebruik fallback
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Error bij het parsen van JSON:", jsonError);
        useFallbackData(userAnswers, "Ongeldige JSON response");
        return;
      }
      
      console.log("Geparseerde API response data:", data);
      
      if (!response.ok) {
        console.error(`API error: ${response.status}`, data);
        useFallbackData(userAnswers, `API error: ${response.status}`);
        return;
      }
      
      // Controleer of de data de verwachte structuur heeft
      if (!data.matches || !Array.isArray(data.matches)) {
        console.error("Onverwacht response formaat:", data);
        useFallbackData(userAnswers, "Onverwacht response formaat");
        return;
      }
      
      // Sla resultaten op in localStorage
      localStorage.setItem('matchResults', JSON.stringify(data.matches));
      localStorage.setItem('userPreferences', JSON.stringify(userAnswers));
      
      setIsLoading(false);
      
      // Navigeer naar resultaten
      navigate('/results');
    } catch (error) {
      // Annuleer de timeout in geval van een fout
      clearTimeout(timeout);
      setTimeoutId(null);
      
      console.error("Error bij het versturen van antwoorden:", error);
      useFallbackData(userAnswers, error.message);
    }
  };
  
  // Skip naar fallback data als gebruiker annuleert
  const handleCancel = () => {
    setIsLoading(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    
    useFallbackData(answers, "Geannuleerd door gebruiker");
  };
  
  // Bereken huidige vraag en voortgang
  const currentQuestion = questions[currentStep];
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

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-md p-6 mt-4 text-center">
            <p className="text-gray-600 mb-2">Bezig met verwerken van je antwoorden...</p>
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <button
              onClick={handleCancel}
              className="text-blue-600 underline mt-4"
            >
              Annuleren en doorgaan met voorbeeldresultaten
            </button>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-md p-6 mt-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Probeer opnieuw
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 mt-4">
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              onAnswer={handleNext}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Wizard;