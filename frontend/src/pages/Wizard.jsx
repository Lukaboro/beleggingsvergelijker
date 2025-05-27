// frontend/src/pages/Wizard.jsx - Database-gedreven versie

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import apiService from '../services/api';
import API_URL from '../data/apiConfig';

const Wizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  
  // Nieuwe state voor dynamische vragen
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [dienstTypes, setDienstTypes] = useState([]);

  // Laad dynamische data bij component mount
  useEffect(() => {
    loadDynamicQuestions();
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const loadDynamicQuestions = async () => {
    try {
      setQuestionsLoading(true);
      
      // Haal unieke type_aanbod waarden op uit diensten tabel
      const dienstenData = await apiService.getTableData('diensten', {
        select: 'type_aanbod',
        filter_column: 'status',
        filter_value: 'actief'
      });
      
      console.log('Diensten data:', dienstenData);
      
      // Extract unieke type_aanbod waarden
      const uniqueTypes = [...new Set(
        dienstenData.data
          .map(item => item.type_aanbod)
          .filter(type => type && type.trim() !== '')
      )];
      
      console.log('Unieke dienst types:', uniqueTypes);
      setDienstTypes(uniqueTypes);
      
      // Logaritmische schaal voor bedrag slider
      const logScale = [0, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];
      
      // Bouw dynamische vragen array
      const dynamicQuestions = [
        {
          id: 'type_dienst',
          title: 'Welk type beleggingsdienst zoek je?',
          description: 'Kies het type dienst dat het beste bij je wensen past.',
          type: 'options',
          options: uniqueTypes.map(type => ({
            value: type,
            label: type
          }))
        },
        {
          id: 'bedrag',
          title: 'Welk bedrag ben je van plan te beleggen?',
          description: 'Sleep de slider naar het gewenste bedrag.',
          type: 'slider',
          min: 0,
          max: 1000000,
          step: 5000,
          defaultValue: 50000,
          logScale: logScale, // Voor logaritmische weergave
          helpText: 'Dit bedrag wordt gebruikt om diensten te filteren op minimum beleggingsbedrag.'
        },
        {
          id: 'kosten_belangrijkheid',
          title: 'Hoe belangrijk zijn lage kosten voor jou?',
          description: 'Dit bepaalt welke diensten we voorstellen op basis van hun totale kosten.',
          type: 'options',
          helpText: 'Zeer belangrijk: alleen diensten met <1.5% totale kosten. Belangrijk: diensten met <2.2% totale kosten. Niet belangrijk: alle diensten.',
          options: [
            { value: 'zeer_belangrijk', label: 'Zeer belangrijk - Ik wil de laagste kosten' },
            { value: 'belangrijk', label: 'Belangrijk - Kosten wegen mee in mijn beslissing' },
            { value: 'niet_belangrijk', label: 'Niet belangrijk - Andere factoren zijn belangrijker' }
          ]
        }
      ];
      
      setQuestions(dynamicQuestions);
      setQuestionsLoading(false);
      
    } catch (error) {
      console.error('Error loading dynamic questions:', error);
      setError('Kon vragen niet laden. Probeer het opnieuw.');
      setQuestionsLoading(false);
    }
  };

  // Mock data voor gebruik als fallback (ongewijzigd)
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

  const handleNext = (answer) => {
    const updatedAnswers = { ...answers, [questions[currentStep].id]: answer };
    setAnswers(updatedAnswers);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitAnswers(updatedAnswers);
    }
  };
  
  const useFallbackData = (userAnswers, reason) => {
    console.log(`Gebruik fallback data vanwege: ${reason}`);
    localStorage.setItem('matchResults', JSON.stringify(mockMatches));
    localStorage.setItem('userPreferences', JSON.stringify(userAnswers));
    setIsLoading(false);
    navigate('/results');
  };
  
  const submitAnswers = async (userAnswers) => {
    console.log("Versturen van antwoorden naar backend:", JSON.stringify(userAnswers));
    
    setIsLoading(true);
    setError(null);
    
    const timeout = setTimeout(() => {
      console.error("API aanroep timeout na 30 seconden");
      useFallbackData(userAnswers, "API aanroep timeout");
    }, 30000);
    
    setTimeoutId(timeout);
    
    try {
      // Nieuwe API endpoint voor database-matching
      const response = await fetch(`${API_URL}/match-diensten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userAnswers),
      });
      
      clearTimeout(timeout);
      setTimeoutId(null);
      
      if (response.status === 404) {
        console.error("API endpoint niet gevonden (404)");
        useFallbackData(userAnswers, "API endpoint niet gevonden");
        return;
      }
      
      const responseText = await response.text();
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Error bij het parsen van JSON:", jsonError);
        useFallbackData(userAnswers, "Ongeldige JSON response");
        return;
      }
      
      if (!response.ok) {
        console.error(`API error: ${response.status}`, data);
        useFallbackData(userAnswers, `API error: ${response.status}`);
        return;
      }
      
      if (!data.matches || !Array.isArray(data.matches)) {
        console.error("Onverwacht response formaat:", data);
        useFallbackData(userAnswers, "Onverwacht response formaat");
        return;
      }
      
      localStorage.setItem('matchResults', JSON.stringify(data.matches));
      localStorage.setItem('userPreferences', JSON.stringify(userAnswers));
      
      setIsLoading(false);
      navigate('/results');
    } catch (error) {
      clearTimeout(timeout);
      setTimeoutId(null);
      console.error("Error bij het versturen van antwoorden:", error);
      useFallbackData(userAnswers, error.message);
    }
  };
  
  const handleCancel = () => {
    setIsLoading(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    useFallbackData(answers, "Geannuleerd door gebruiker");
  };
  
  // Loading state voor vragen
  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">
              Jouw persoonlijke beleggingsprofiel
            </h1>
            <p className="text-gray-600">
              Vragen worden geladen...
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Even geduld, we laden de meest recente opties...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
            <button
              onClick={() => {
                setError(null);
                loadDynamicQuestions();
              }}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mr-4"
            >
              Probeer opnieuw
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            >
              Terug naar start
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normale wizard flow
  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
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