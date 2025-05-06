// frontend/src/components/QuestionCard.jsx
import React, { useState, useEffect } from 'react';

const QuestionCard = ({ question, onAnswer }) => {
  // Initialiseer de selectedValue op basis van het type vraag
  const [selectedValue, setSelectedValue] = useState(
    question.type === 'slider' ? question.defaultValue : ''
  );

  // Effect om selectedValue te resetten wanneer de vraag verandert
  useEffect(() => {
    setSelectedValue(question.type === 'slider' ? question.defaultValue : '');
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 transition duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{question.title}</h2>
      <p className="text-gray-600 mb-6">{question.description}</p>
      
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
            <span className="text-2xl font-bold text-blue-600">
              €{selectedValue.toLocaleString('nl-NL')}
            </span>
          </div>
          
          <button
            type="button"
            onClick={handleNextClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
          >
            Volgende
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`w-full text-left p-4 rounded-lg border transition duration-300 hover:border-blue-400 hover:bg-blue-50 ${
                selectedValue === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
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