// frontend/src/components/BankCard.jsx

import React, { useState } from 'react';

const BankCard = ({ bank, onContactRequest, onGuidanceRequest }) => {
  // State toevoegen om te controleren of de afbeelding geladen is
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fallback SVG icoon gebruiken als de afbeelding niet kan worden geladen
  const renderFallbackIcon = () => (
    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
      <div className="p-6">
        {/* Logo met extreme maatregelen */}
        {bank.logo && !imageError ? (
         <div className="flex justify-center mb-4">
          <img
           src={`/images/${bank.logo}`}
            alt={`${bank.name} logo`}
            className="max-w-[64px] max-h-[64px] w-auto h-auto object-contain"
           onLoad={() => setImageLoaded(true)}
           onError={() => setImageError(true)}
         />
        </div>
        ) : renderFallbackIcon()}
        
        <h3 className="text-xl font-bold text-blue-800 mb-3">{bank.name}</h3>
        <p className="text-gray-600 mb-4">{bank.description}</p>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-gray-700">Sterke punten</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {bank.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-gray-700">Aandachtspunten</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {bank.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-4 h-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-col space-y-2">
          <button
            onClick={onContactRequest}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 text-center"
          >
            Ik neem contact op
          </button>
          <button
            onClick={onGuidanceRequest}
            className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 font-medium py-2 px-4 rounded-lg transition duration-300 text-center"
          >
            Ik wens begeleiding
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankCard;