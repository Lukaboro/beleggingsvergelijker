// frontend/src/components/QuestionCard.jsx - Complete gefixte versie

import React, { useState, useEffect } from 'react';

const QuestionCard = ({ question, onAnswer }) => {
  // Alle state variabelen correct gedefinieerd
  const [selectedValue, setSelectedValue] = useState(
    question.type === 'slider' ? question.defaultValue : 
    question.type === 'rating' ? 0 : ''
  );
  
  const [sliderPosition, setSliderPosition] = useState(0);
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Logaritmische slider helper functies - HYBRIDE VERSIE MET FIJNERE CONTROLE
  const logMin = 1; // Minimum waarde voor log berekening
  const actualMin = 0; // Echte minimum (€0)
  const logMax = 1000000; // Maximum waarde
  const linearThreshold = 1000; // Tot €1000 gebruiken we lineaire schaal
  
  const getSliderPositionFromValue = (value) => {
    if (value <= actualMin) return 0;
    
    if (value <= linearThreshold) {
      // Lineaire schaal voor lage bedragen (0-1000): eerste 20% van slider
      return (value / linearThreshold) * 20;
    } else {
      // Logaritmische schaal voor hoge bedragen (1000-1M): laatste 80% van slider
      const logValue = Math.log(value);
      const logMinValue = Math.log(linearThreshold);
      const logMaxValue = Math.log(logMax);
      
      return 20 + ((logValue - logMinValue) / (logMaxValue - logMinValue)) * 80;
    }
  };

  const getValueFromSliderPosition = (position) => {
    if (position <= 0) return 0;
    
    if (position <= 20) {
      // Lineaire schaal voor eerste 20% (0-1000) met fijnere stappen
      const value = (position / 20) * linearThreshold;
      
      // Fijnere afrondingen voor zeer lage bedragen
      if (value <= 50) {
        return Math.round(value / 5) * 5; // Stappen van €5
      } else if (value <= 200) {
        return Math.round(value / 10) * 10; // Stappen van €10
      } else {
        return Math.round(value / 25) * 25; // Stappen van €25
      }
    } else {
      // Logaritmische schaal voor laatste 80% (1000-1M)
      const logMinValue = Math.log(linearThreshold);
      const logMaxValue = Math.log(logMax);
      
      const logValue = logMinValue + ((position - 20) / 80) * (logMaxValue - logMinValue);
      const value = Math.exp(logValue);
      
      // Round to nearest 100 for clean numbers
      return Math.round(value / 100) * 100;
    }
  };

  const formatCurrency = (value) => {
    return `€${value.toLocaleString('nl-NL')}`;
  };

  const formatCurrencyCompact = (value) => {
    if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `€${(value / 1000).toFixed(0)}K`;
    return `€${value.toLocaleString('nl-NL')}`;
  };

  // Effect om selectedValue te resetten wanneer de vraag verandert
  useEffect(() => {
    const initialValue = question.type === 'slider' ? question.defaultValue : 
                        question.type === 'rating' ? 0 : '';
    
    setSelectedValue(initialValue);
    
    // Voor logaritmische slider: zet de juiste slider positie
    if (question.type === 'slider' && question.logScale) {
      const position = getSliderPositionFromValue(initialValue);
      setSliderPosition(position);
    }
  }, [question]);

  const handleOptionClick = (value) => {
    setSelectedValue(value);
    onAnswer(value);
  };

  const handleSliderChange = (e) => {
    const position = parseFloat(e.target.value);
    
    if (question.logScale) {
      // Continue logaritmische schaal
      const value = getValueFromSliderPosition(position);
      setSliderPosition(position);
      setSelectedValue(value);
      console.log("Continue logaritmische slider:", {
        position: position.toFixed(1),
        value,
        formatted: formatCurrency(value)
      });
    } else {
      // Lineaire schaal (fallback)
      const value = parseInt(e.target.value, 10);
      setSelectedValue(value);
      console.log("Lineaire slider waarde:", value);
    }
  };

  const handleNextClick = () => {
    console.log("Volgende knop geklikt met waarde:", selectedValue);
    onAnswer(selectedValue);
  };
  
  const toggleHelp = (e) => {
    e.preventDefault();
    setShowHelp(!showHelp);
  };

  const handleManualInputChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, ''); // Alleen cijfers
    setManualInput(value);
  };

  const handleManualInputSubmit = () => {
    const value = parseInt(manualInput, 10) || 0;
    const clampedValue = Math.min(Math.max(value, 0), logMax);
    
    setSelectedValue(clampedValue);
    setSliderPosition(getSliderPositionFromValue(clampedValue));
    setManualInput('');
    setShowManualInput(false);
    
    console.log("Handmatige invoer:", clampedValue);
  };

  const handleManualInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleManualInputSubmit();
    }
    if (e.key === 'Escape') {
      setManualInput('');
      setShowManualInput(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 transition duration-300">
      {/* Titel met help icon als helpText bestaat */}
      <div className="flex items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800">{question.title}</h2>
        
        {question.helpText && (
          <button 
            onClick={toggleHelp}
            className="ml-2 text-gray-400 hover:text-orange-500 focus:outline-none"
            title="Klik voor meer informatie"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      <p className="text-gray-600 mb-6">{question.description}</p>
      
      {/* Help popup */}
      {showHelp && (
        <div className="bg-orange-50 border border-orange-200 text-gray-700 p-4 rounded-md mb-6">
          <div className="flex justify-between">
            <h4 className="font-medium mb-2">Hulp bij deze vraag</h4>
            <button 
              onClick={toggleHelp}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p>{question.helpText}</p>
        </div>
      )}
      
      {question.type === 'slider' ? (
        <div className="mb-8">
          <div className="mb-6">
            {question.logScale ? (
              // CONTINUE LOGARITMISCHE SLIDER
              <>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.1}
                  value={sliderPosition}
                  onChange={handleSliderChange}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                
                {/* Hybride schaal markers */}
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>€0</span>
                  <span>€500</span>
                  <span>€1.000</span>
                  <span>€10.000</span>
                  <span>€100.000</span>
                  <span>€1.000.000</span>
                </div>
                <div className="text-center mt-1 mb-4">
                  <span className="text-xs text-gray-400">
                    Lineair tot €1.000, dan logaritmisch
                  </span>
                </div>
                
                {/* Handmatige invoer sectie */}
                <div className="text-center mt-4 mb-4">
                  {!showManualInput ? (
                    <button
                      type="button"
                      onClick={() => setShowManualInput(true)}
                      className="text-sm text-orange-600 hover:text-orange-700 underline"
                    >
                      Exact bedrag invoeren
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm">€</span>
                      <input
                        type="text"
                        value={manualInput}
                        onChange={handleManualInputChange}
                        onKeyDown={handleManualInputKeyPress}
                        placeholder="Bedrag zonder euro teken"
                        className="w-40 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleManualInputSubmit}
                        className="px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                      >
                        OK
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowManualInput(false);
                          setManualInput('');
                        }}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Annuleer
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Huidige waarde - prominent weergegeven */}
                <div className="text-center mt-6 mb-6">
                  <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-4 inline-block border border-orange-200">
                    <span className="text-sm text-gray-600 block mb-1">Geselecteerd bedrag:</span>
                    <div className="text-3xl font-bold text-orange-600">
                      {formatCurrency(selectedValue)}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // LINEAIRE SLIDER (fallback)
              <>
                <input
                  type="range"
                  min={question.min}
                  max={question.max}
                  step={question.step}
                  value={selectedValue}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">€{question.min.toLocaleString('nl-NL')}</span>
                  <span className="text-sm text-gray-500">€{question.max.toLocaleString('nl-NL')}</span>
                </div>
                <div className="text-center mb-6">
                  <span className="text-2xl font-bold text-orange-600">
                    €{selectedValue.toLocaleString('nl-NL')}
                  </span>
                </div>
              </>
            )}
          </div>
          
          <button
            type="button"
            onClick={handleNextClick}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
          >
            Volgende
          </button>
        </div>
      ) : question.type === 'rating' ? (
        // Rating type vraag
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`w-full text-left p-4 rounded-lg border transition duration-300 hover:border-orange-400 hover:bg-orange-50 ${
                selectedValue === option.value ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <span className="font-medium flex-1">{option.label}</span>
                {option.value > 0 && (
                  <div className="flex">
                    {[...Array(option.value)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
                {option.value === 0 && (
                  <span className="text-gray-500 text-sm italic">Alle opties weergeven</span>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        // Bestaande opties type vraag
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`w-full text-left p-4 rounded-lg border transition duration-300 hover:border-orange-400 hover:bg-orange-50 ${
                selectedValue === option.value ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
              }`}
            >
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;