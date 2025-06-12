// Updated IterativeQuestionsSection.jsx with Clarifications

import React, { useState } from 'react';
import { MessageSquare, Sparkles, Loader2, Check, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import API_URL from '../data/apiConfig';

const IterativeQuestionsSection = ({ 
  matches, 
  userPreferences, 
  onAnswerSubmit,
  onTextRefinement,
  isRecalculating = false,
  showTextRefinement = false
}) => {
  // Existing state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showQuestions, setShowQuestions] = useState(true);
  const [scenario, setScenario] = useState(null);
  
  // Text refinement state
  const [freeText, setFreeText] = useState('');
  const [isProcessingText, setIsProcessingText] = useState(false);
  const [textAnalysisResult, setTextAnalysisResult] = useState(null);
  const [showTextInput, setShowTextInput] = useState(true);
  const [textProcessed, setTextProcessed] = useState(false);

  // NEW: Clarification state
  const [pendingClarifications, setPendingClarifications] = useState([]);
  const [isHandlingClarification, setIsHandlingClarification] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState(null);

  // Detect scenario when component mounts
  React.useEffect(() => {
    if (matches && matches.length > 0) {
      const detectedScenario = detectScenario(matches, userPreferences);
      setScenario(detectedScenario);
    }
  }, [matches, userPreferences]);

  // NEW: Handle clarification responses
  const handleClarificationResponse = async (clarificationId, selectedOption) => {
    setIsHandlingClarification(true);
    
    try {
      console.log('🤔 Processing clarification:', clarificationId, selectedOption);
      
      const response = await fetch(`${API_URL}/process-clarification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clarification_id: clarificationId,
          selected_option: selectedOption,
          preferences: userPreferences
        })
      });
      
      const result = await response.json();
      console.log('✅ Clarification result:', result);
      
      if (result.success) {
        setPendingClarifications([]);
        setAppliedFilter(result.appliedFilter);
        setTextProcessed(true);
        
        // Update matches with filtered/boosted results
        if (onTextRefinement) {
          onTextRefinement({
            updatedPreferences: userPreferences, // Same preferences
            matches: result.matches,
            textAnalysis: {
              reasoning: `Filter toegepast: ${result.appliedFilter}`,
              applied_filter: result.appliedFilter,
              filter_active: result.filterActive
            },
            preferencesChanged: true, // Mark as changed to show update
            originalText: freeText
          });
        }
      } else {
        alert('Er was een probleem met het toepassen van de filter: ' + result.error);
      }
    } catch (error) {
      console.error('Clarification error:', error);
      alert('Er was een fout bij het verwerken van je keuze');
    } finally {
      setIsHandlingClarification(false);
    }
  };

  // Updated text refinement processing
  const processTextRefinement = async () => {
    if (!freeText.trim()) return;
    
    setIsProcessingText(true);
    try {
      const response = await fetch(`${API_URL}/process-text-and-match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: freeText,
          preferences: userPreferences || {}
        }),
      });

      const result = await response.json();
      console.log('🎯 Text processing result:', result);
      
      if (result.success) {
        console.log("🎯 Full result object:", result);
        console.log("📋 textAnalysis:", result.textAnalysis);
        console.log("🤔 clarifications_needed:", result.textAnalysis?.clarifications_needed);
  
        // Check if clarifications are needed - FIX: check in textAnalysis
        const clarifications = result.textAnalysis?.clarifications_needed || [];
        console.log("📝 Processing clarifications:", clarifications);
  
        if (clarifications.length > 0) {
          console.log('✅ Setting pending clarifications!');
          setPendingClarifications(clarifications);
          setTextAnalysisResult(result.textAnalysis);
          return; // Don't process matches yet, wait for clarification
        }

        // Normal processing - no clarifications needed
        setTextAnalysisResult(result.textAnalysis);
        setTextProcessed(true);
        
        // Notify parent component about preference updates
        if (onTextRefinement) {
          onTextRefinement({
            updatedPreferences: result.updatedPreferences,
            matches: result.newMatches,
            textAnalysis: result.textAnalysis,
            preferencesChanged: result.preferencesChanged,
            originalText: freeText
          });
        }
      } else {
        alert('Er was een probleem met de analyse: ' + result.error);
      }
    } catch (error) {
      console.error('Text processing error:', error);
      alert('Er was een fout bij het verwerken van je tekst');
    } finally {
      setIsProcessingText(false);
    }
  };

  // [Rest of existing functions: detectScenario, generateCloseRaceQuestions, etc. - unchanged]
  const detectScenario = (matches, preferences) => {
    if (matches.length < 2) return null;

    const topMatch = matches[0];
    const secondMatch = matches[1];
    const scoreDiff = topMatch.matchScore - secondMatch.matchScore;

    if (scoreDiff <= 5) {
      return {
        type: 'close_race',
        urgency: 'high',
        title: '🤔 Zeer close race!',
        description: `${topMatch.name} (${topMatch.matchScore}%) vs ${secondMatch.name} (${secondMatch.matchScore}%) - slechts ${scoreDiff}% verschil!`,
        questions: generateCloseRaceQuestions(topMatch, secondMatch, preferences)
      };
    }

    if (topMatch.matchScore < 75) {
      return {
        type: 'low_scores',
        urgency: 'medium',
        title: '🎯 Misschien te strenge criteria?',
        description: `Je beste match scoort ${topMatch.matchScore}%. Wil je flexibeler zijn?`,
        questions: generateFlexibilityQuestions(topMatch, preferences)
      };
    }

    return {
      type: 'refinement',
      urgency: 'low', 
      title: '✨ Verfijn je matches',
      description: 'Goede matches gevonden! Wil je ze nog verder optimaliseren?',
      questions: generateRefinementQuestions(topMatch, secondMatch, preferences)
    };
  };

  const generateCloseRaceQuestions = (match1, match2, preferences) => {
    return [{
      id: 'cost_vs_quality',
      type: 'choice',
      question: `Belangrijke afweging: Wat weegt zwaarder voor jou?`,
      options: [
        {
          id: 'choose_cheaper',
          text: `💰 Lagere kosten zijn belangrijker`,
          impact: { weight_kosten: 1.5 }
        },
        {
          id: 'choose_quality',
          text: `📈 Betere overall score is belangrijker`,
          impact: { weight_kosten: 0.8 }
        }
      ]
    }];
  };

  const generateFlexibilityQuestions = (match, preferences) => {
    return [{
      id: 'criteria_flexibility',
      type: 'choice',
      question: `De beste optie (${match.name}) scoort ${match.matchScore}%. Wil je je criteria aanpassen?`,
      options: [
        {
          id: 'broaden_search',
          text: '🔍 Ja, laat meer opties zien',
          impact: { lower_thresholds: true }
        },
        {
          id: 'keep_strict',
          text: '✅ Nee, ik houd mijn eisen aan',
          impact: { maintain_standards: true }
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
      question: `${match1.name} valt op door '${mainStrength}'. Hoe belangrijk is dit?`,
      options: [
        {
          id: 'very_important',
          text: '⭐ Zeer belangrijk',
          impact: { boost_similar_attributes: true }
        },
        {
          id: 'not_priority',
          text: '🤷 Niet zo belangrijk',
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

  return (
    <div className="space-y-6">
      {/* Existing Iterative Questions */}
      {scenario && showQuestions && (
        <div className={`border rounded-lg p-6 ${getUrgencyColor(scenario.urgency)}`}>
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
      )}

      {/* Text Refinement Section */}
      {showTextRefinement && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div 
            className="p-4 cursor-pointer" 
            onClick={() => setShowTextInput(!showTextInput)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {textProcessed ? '✅ Verfijning voltooid' : 'Nog iets toe te voegen?'}
                </h3>
                <Sparkles className="w-4 h-4 text-green-500" />
              </div>
              {!textProcessed && (
                showTextInput ? <ChevronUp className="w-5 h-5 text-green-600" /> 
                             : <ChevronDown className="w-5 h-5 text-green-600" />
              )}
            </div>
            
            <p className="text-sm text-green-700 mt-1">
              {textProcessed 
                ? `"${freeText.substring(0, 50)}..." → ${appliedFilter || 'Matches herberekend!'}`
                : 'Vertel ons in eigen woorden wat nog belangrijk is voor je keuze'
              }
            </p>
          </div>
          
          {showTextInput && !textProcessed && (
            <div className="px-4 pb-4">
              <textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="Bijvoorbeeld: 'Belgische bank graag' of 'geen KBC' of 'liever digitale banken'..."
                className="w-full h-24 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isProcessingText}
              />
              
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-gray-600">
                  💡 AI analyseert je input en vraagt bevestiging indien nodig
                </p>
                <button
                  onClick={processTextRefinement}
                  disabled={!freeText.trim() || isProcessingText}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessingText ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyseren...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyseer input
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* NEW: Clarification Section */}
          {pendingClarifications.length > 0 && (
            <div className="px-4 pb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">
                    Even verduidelijken...
                  </h4>
                </div>
                
                {pendingClarifications.map((clarificationText, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-blue-800 mb-3 font-medium">
                      {clarificationText}
                    </p>
              
                    <div className="space-y-2">
                      <button
                        onClick={() => handleClarificationResponse(index, {
                          action: 'boost_specific',
                          text: '🎯 Specifiek deze bank hoger scoren'
                        })}
                        disabled={isHandlingClarification}
                        className="block w-full text-left p-3 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors bg-white"
                      >
                        <span className="text-blue-900">🎯 Specifiek deze bank hoger scoren</span>
                      </button>
                
                      <button
                        onClick={() => handleClarificationResponse(index, {
                          action: 'adjust_criteria',
                          text: '⚖️ Prioriteit aanpassen'
                        })}
                        disabled={isHandlingClarification}
                        className="block w-full text-left p-3 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors bg-white"
                      >
                        <span className="text-blue-900">⚖️ Prioriteit aanpassen</span>
                      </button>
                
                      <button
                        onClick={() => handleClarificationResponse(index, {
                          action: 'cancel',
                          text: '❌ Laat maar zitten'
                        })}
                        disabled={isHandlingClarification}
                        className="block w-full text-left p-3 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors bg-white"
                      >
                        <span className="text-blue-900">❌ Laat maar zitten</span>
                      </button>
                    </div>                    
                    {isHandlingClarification && (
                      <div className="flex items-center gap-2 mt-3 text-blue-700">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Filter wordt toegepast...</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Text Analysis Result */}
          {textAnalysisResult && textProcessed && !pendingClarifications.length && (
            <div className="px-4 pb-4">
              <div className="bg-white border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">
                    {appliedFilter ? 'Filter toegepast' : 'Verfijning toegepast'}
                  </h4>
                </div>
                <p className="text-green-800 text-sm mb-3">
                  {appliedFilter || textAnalysisResult.reasoning}
                </p>
                
                {textAnalysisResult.soft_preferences?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {textAnalysisResult.soft_preferences.map((pref, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {pref.category}: {pref.importance}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IterativeQuestionsSection;