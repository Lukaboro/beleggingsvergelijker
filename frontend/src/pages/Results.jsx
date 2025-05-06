// frontend/src/pages/ResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BankCard from '../components/BankCard';

const ResultsPage = () => {
  const [matches, setMatches] = useState([]);
  const [userPreferences, setUserPreferences] = useState({});
  const [selectedBank, setSelectedBank] = useState(null);
  
  useEffect(() => {
    // Haal resultaten op uit localStorage
    const storedMatches = localStorage.getItem('matchResults');
    const storedPreferences = localStorage.getItem('userPreferences');
    
    if (storedMatches) {
      const parsedMatches = JSON.parse(storedMatches);
      setMatches(parsedMatches);
    }
    
    if (storedPreferences) {
      setUserPreferences(JSON.parse(storedPreferences));
    }
  }, []);
  
  const handleContactRequest = (bankId) => {
    setSelectedBank(matches.find(bank => bank.id === bankId));
    // Hier zou een modal of een redirect naar een contactpagina kunnen komen
    alert(`Contact aanvraag voor ${matches.find(bank => bank.id === bankId).name}`);
  };
  
  const handleGuidanceRequest = (bankId) => {
    setSelectedBank(matches.find(bank => bank.id === bankId));
    // Hier zou een modal of een redirect naar een begeleidingspagina kunnen komen
    alert(`Begeleiding aanvraag voor ${matches.find(bank => bank.id === bankId).name}`);
  };
  
  // Vervang de bank logos door SVG iconen als tijdelijke oplossing
  const getBankIcon = (bank) => {
    // Hier kunnen we verschillende iconen toewijzen op basis van bank eigenschappen
    // of gewoon een standaard icoon gebruiken
    return (
      <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
    );
  };
  
  // Aangepaste versie van de BankCard voor de resultatenpagina
  const CustomBankCard = ({ bank, index }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
        <div className="p-6">
          {/* Match score indicator */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-gray-500">Match score:</span>
            <span className="text-lg font-bold text-blue-600">{bank.matchScore}%</span>
          </div>
          
          {/* Bank logo of icon */}
          {getBankIcon(bank)}
          
          <h3 className="text-xl font-bold text-blue-800 mb-3">{bank.name}</h3>
          <p className="text-gray-600 mb-4">{bank.description}</p>
          
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-gray-700">Sterke punten</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {bank.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start">
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
              {bank.weaknesses.map((weakness, idx) => (
                <li key={idx} className="flex items-start">
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
              onClick={() => handleContactRequest(bank.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 text-center"
            >
              Ik neem contact op
            </button>
            <button
              onClick={() => handleGuidanceRequest(bank.id)}
              className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 font-medium py-2 px-4 rounded-lg transition duration-300 text-center"
            >
              Ik wens begeleiding
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
          Jouw top 3 beleggingspartners
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Gebaseerd op je voorkeuren hebben we deze beleggingspartners voor je geselecteerd.
          Vergelijk ze en kies degene die het beste bij je past.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {matches.map((bank, index) => (
          <CustomBankCard key={bank.id} bank={bank} index={index} />
        ))}
      </div>
      
      <div className="text-center">
        <Link
          to="/"
          className="inline-block py-3 px-6 bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 rounded-lg transition duration-300 mr-4"
        >
          Terug naar homepage
        </Link>
        
        <Link
          to="/wizard"
          className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
        >
          Opnieuw beginnen
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;