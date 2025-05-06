// frontend/src/pages/ResultsPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ResultsPage = () => {
  const [matches, setMatches] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);

  useEffect(() => {
    const storedMatches = localStorage.getItem('matchResults');
    if (storedMatches) {
      setMatches(JSON.parse(storedMatches));
    }
  }, []);

  const handleContactRequest = (bankId) => {
    const bank = matches.find(b => b.id === bankId);
    setSelectedBank(bank);
    alert(`Contactaanvraag voor ${bank.name}`);
  };

  const handleGuidanceRequest = (bankId) => {
    const bank = matches.find(b => b.id === bankId);
    setSelectedBank(bank);
    alert(`Begeleiding aangevraagd voor ${bank.name}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
          Jouw top 3 beleggingspartners
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Gebaseerd op je antwoorden hebben we deze matches voor jou gevonden.
          Vergelijk de opties en kies de partner die het beste bij jou past.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        {matches.map((bank, index) => (
          <div
            key={bank.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">Matchscore</span>
                <span className="text-lg font-bold text-blue-600">{bank.matchScore}%</span>
              </div>

              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-blue-800 mb-2">{bank.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{bank.description}</p>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-1">Sterke punten</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {bank.strengths.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-1">Aandachtspunten</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {bank.weaknesses.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856" />
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-2">
              <button
                onClick={() => handleContactRequest(bank.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Ik neem contact op
              </button>
              <button
                onClick={() => handleGuidanceRequest(bank.id)}
                className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg transition"
              >
                Ik wens begeleiding
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center space-x-4">
        <Link
          to="/"
          className="py-3 px-6 bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 rounded-lg font-medium transition"
        >
          Terug naar homepage
        </Link>
        <Link
          to="/wizard"
          className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          Opnieuw beginnen
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;
