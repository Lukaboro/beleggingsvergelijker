// frontend/src/components/QuestionCard.jsx - Aangepaste versie

import React, { useState, useEffect } from 'react';

const QuestionCard = ({ question, onAnswer }) => {
  // Initialiseer de selectedValue op basis van het type vraag
  const [selectedValue, setSelectedValue] = useState(
    question.type === 'slider' ? question.defaultValue : 
    question.type === 'rating' ? 0 : ''
  );
  
  // Nieuw: state voor help popup
  const [showHelp, setShowHelp] = useState(false);

  // Effect om selectedValue te resetten wanneer de vraag verandert
  useEffect(() => {
    setSelectedValue(
      question.type === 'slider' ? question.defaultValue : 
      question.type === 'rating' ? 0 : ''
    );
  }, [question]);

  const handleOptionClick = (value) => {
    setSelectedValue(value);
    onAnswer(value);
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setSelectedValue(value);
    // Debug log
    console.log("Slider waarde gewijzigd naar:", value);
  };

  const handleNextClick = () => {
    console.log("Volgende knop geklikt met waarde:", selectedValue);
    onAnswer(selectedValue);
  };
  
  // Toggle help popup
  const toggleHelp = (e) => {
    e.preventDefault();
    setShowHelp(!showHelp);
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
          </div>
          
          <div className="text-center mb-6">
            <span className="text-2xl font-bold text-orange-600">
              €{selectedValue.toLocaleString('nl-NL')}
            </span>
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
        // Nieuw: rating type vraag
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