// Maak een nieuw bestand: frontend/src/components/IterativeQuestionsSection.jsx

import React, { useState } from 'react';

const IterativeQuestionsSection = ({ 
  matches, 
  userPreferences, 
  onAnswerSubmit, 
  isRecalculating = false 
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showQuestions, setShowQuestions] = useState(true);
  const [scenario, setScenario] = useState(null);

  // Detect scenario when component mounts
  React.useEffect(() => {
    if (matches && matches.length > 0) {
      const detectedScenario = detectScenario(matches, userPreferences);
      setScenario(detectedScenario);
    }
  }, [matches, userPreferences]);

  const detectScenario = (matches, preferences) => {
    if (matches.length < 2) return null;

    const topMatch = matches[0];
    const secondMatch = matches[1];
    const scoreDiff = topMatch.matchScore - secondMatch.matchScore;

    // Close race detection
    if (scoreDiff <= 5) {
      return {
        type: 'close_race',
        urgency: 'high',
        title: '🤔 Zeer close race!',
        description: `${topMatch.name} (${topMatch.matchScore}%) vs ${secondMatch.name} (${secondMatch.matchScore}%) - slechts ${scoreDiff}% verschil!`,
        questions: generateCloseRaceQuestions(topMatch, secondMatch, preferences)
      };
    }

    // Low scores detection
    if (topMatch.matchScore < 75) {
      return {
        type: 'low_scores',
        urgency: 'medium',
        title: '🎯 Misschien te strenge criteria?',
        description: `Je beste match scoort ${topMatch.matchScore}%. Wil je flexibeler zijn?`,
        questions: generateFlexibilityQuestions(topMatch, preferences)
      };
    }

    // Always-on refinement
    return {
      type: 'refinement',
      urgency: 'low', 
      title: '✨ Verfijn je matches',
      description: 'Goede matches gevonden! Wil je ze nog verder optimaliseren?',
      questions: generateRefinementQuestions(topMatch, secondMatch, preferences)
    };
  };

  const generateCloseRaceQuestions = (match1, match2, preferences) => {
    const questions = [];

    // Cost difference question
    const tco1 = match1.details?.tco || 0;
    const tco2 = match2.details?.tco || 0;
    const costDiff = Math.abs(tco1 - tco2) * 100;

    if (costDiff > 0.2) {
      const cheaper = tco1 < tco2 ? match1 : match2;
      const costlier = tco1 < tco2 ? match2 : match1;

      questions.push({
        id: 'cost_vs_quality',
        type: 'choice',
        question: `Belangrijke afweging: ${cheaper.name} is ${costDiff.toFixed(2)}% per jaar goedkoper, maar ${costlier.name} scoort hoger op andere vlakken. Wat weegt zwaarder?`,
        options: [
          {
            id: 'choose_cheaper',
            text: `💰 Kies voor lagere kosten (${cheaper.name})`,
            impact: { weight_kosten: 1.5, preferred_match: cheaper.id }
          },
          {
            id: 'choose_quality',
            text: `📈 Kies voor betere overall score (${costlier.name})`,
            impact: { weight_kosten: 0.8, preferred_match: costlier.id }
          }
        ]
      });
    }

    // Service vs Digital question
    const hasPersonalService = match1.strengths?.some(s => 
      s.toLowerCase().includes('persoonlijk') || 
      s.toLowerCase().includes('begeleiding')
    );
    const hasDigitalStrength = match2.strengths?.some(s => 
      s.toLowerCase().includes('platform') || 
      s.toLowerCase().includes('digitaal')
    );

    if (hasPersonalService && hasDigitalStrength) {
      questions.push({
        id: 'service_vs_digital',
        type: 'choice',
        question: `Verschillende sterke punten: ${match1.name} biedt meer persoonlijke begeleiding, ${match2.name} heeft een sterker digitaal platform. Wat past beter bij jou?`,
        options: [
          {
            id: 'prefer_personal',
            text: `👥 Ik waardeer persoonlijke begeleiding`,
            impact: { weight_begeleiding: 1.4, preferred_match: match1.id }
          },
          {
            id: 'prefer_digital', 
            text: `💻 Ik prefereer een sterk digitaal platform`,
            impact: { weight_functionaliteiten: 1.4, preferred_match: match2.id }
          }
        ]
      });
    }

    return questions;
  };

  const generateFlexibilityQuestions = (match, preferences) => {
    return [{
      id: 'criteria_flexibility',
      type: 'choice',
      question: `De beste optie (${match.name}) scoort ${match.matchScore}%. Wil je je criteria aanpassen voor meer keuze?`,
      options: [
        {
          id: 'broaden_search',
          text: '🔍 Ja, laat meer opties zien (bredere criteria)',
          impact: { lower_thresholds: true, expand_scope: true }
        },
        {
          id: 'keep_strict',
          text: '✅ Nee, ik houd mijn eisen aan (kwaliteit boven kwantiteit)',
          impact: { maintain_standards: true }
        },
        {
          id: 'reconfigure',
          text: '🔄 Laat me mijn prioriteiten opnieuw instellen',
          impact: { restart_wizard: true }
        }
      ]
    }];
  };

  const generateRefinementQuestions = (match1, match2, preferences) => {
    if (!match1.strengths || match1.strengths.length === 0) return [];

    const mainStrength = match1.strengths[0];
    
    return [{
      id: 'strength_validation',
      type: 'choice',
      question: `${match1.name} valt op door '${mainStrength}'. Hoe belangrijk is dit voor jou?`,
      options: [
        {
          id: 'very_important',
          text: '⭐ Zeer belangrijk - dit is precies wat ik zoek',
          impact: { boost_similar_attributes: true }
        },
        {
          id: 'nice_to_have',
          text: '👍 Leuk meegenomen, maar niet doorslaggevend',
          impact: { neutral_weight: true }
        },
        {
          id: 'not_priority',
          text: '🤷 Eigenlijk niet zo belangrijk voor mij',
          impact: { reduce_similar_attributes: true }
        }
      ]
    }];
  };

  const handleAnswerChange = (questionId, optionId, impact) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: { optionId, impact }
    }));
  };

  const handleSubmitAnswers = () => {
    const impacts = Object.values(selectedAnswers).map(answer => answer.impact);
    onAnswerSubmit(impacts);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getUrgencyTextColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-800';
      case 'medium': return 'text-yellow-800';  
      case 'low': return 'text-blue-800';
      default: return 'text-gray-800';
    }
  };

  if (!scenario || !showQuestions) return null;

  return (
    <div className={`border rounded-lg p-6 mb-8 ${getUrgencyColor(scenario.urgency)}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className={`text-lg font-semibold mb-2 ${getUrgencyTextColor(scenario.urgency)}`}>
            {scenario.title}
          </h2>
          <p className={`text-sm ${getUrgencyTextColor(scenario.urgency)} mb-4`}>
            {scenario.description}
          </p>
        </div>
        <button
          onClick={() => setShowQuestions(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {scenario.questions.map((question, qIndex) => (
        <div key={question.id} className="mb-6">
          <h3 className="font-medium text-gray-800 mb-3">
            {question.question}
          </h3>
          
          <div className="space-y-2">
            {question.options.map((option, oIndex) => (
              <label
                key={option.id}
                className={`block p-3 border rounded-lg cursor-pointer transition-colors hover:bg-white ${
                  selectedAnswers[question.id]?.optionId === option.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.id}
                  onChange={() => handleAnswerChange(question.id, option.id, option.impact)}
                  className="sr-only"
                />
                <span className="text-sm text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={() => setShowQuestions(false)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Overslaan
        </button>
        <button
          onClick={handleSubmitAnswers}
          disabled={Object.keys(selectedAnswers).length !== scenario.questions.length || isRecalculating}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            Object.keys(selectedAnswers).length === scenario.questions.length && !isRecalculating
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isRecalculating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
              Herberekenen...
            </>
          ) : (
            '🔄 Herbereken matches'
          )}
        </button>
      </div>
    </div>
  );
};

export default IterativeQuestionsSection;