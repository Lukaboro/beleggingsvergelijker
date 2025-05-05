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
    const updatedAnswers = { ...answers, [questions[currentStep].id]: answer };
    setAnswers(updatedAnswers);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit answers to backend and navigate to results
      submitAnswers(updatedAnswers);
    }
  };
  
  const submitAnswers = async (userAnswers) => {
    try {
      const response = await fetch('http://localhost:8000/api/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userAnswers),
      });
      
      const data = await response.json();
      
      // Store results in localStorage for access on results page
      localStorage.setItem('matchResults', JSON.stringify(data.matches));
      localStorage.setItem('userPreferences', JSON.stringify(userAnswers));
      
      // Navigate to results page
      navigate('/results');
    } catch (error) {
      console.error('Error submitting answers:', error);
      // Handle error (show error message)
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
        question={currentQuestion}
        onAnswer={handleNext}
      />
    </div>
  );
};

export default Wizard;