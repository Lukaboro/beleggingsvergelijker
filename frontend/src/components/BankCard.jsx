// frontend/src/components/BankCard.jsx

import React from 'react';

const BankCard = ({ bank, onContactRequest, onGuidanceRequest }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
      <div className="p-6">
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