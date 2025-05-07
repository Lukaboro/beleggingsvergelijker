// frontend/src/pages/ResultsPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../data/apiConfig'; // Importeer je API config

const ResultsPage = () => {
  const [matches, setMatches] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  // Nieuwe state variabelen
  const [userEmail, setUserEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [contactType, setContactType] = useState('');
  const [selectedBankId, setSelectedBankId] = useState(null);

  useEffect(() => {
    const storedMatches = localStorage.getItem('matchResults');
    if (storedMatches) {
      setMatches(JSON.parse(storedMatches));
    }
  }, []);

  // Vereenvoudigde versie van de contactfuncties
  const handleContactRequest = (bankId) => {
    // Gebruik prompt in plaats van een popup formulier
    const email = window.prompt(`Voer je e-mailadres in om contact op te nemen met ${matches.find(b => b.id === bankId).name}:`);
  
    if (!email) return; // Als gebruiker annuleert of leeg laat
  
    // Bewaar deze informatie lokaal (geen API call)
    alert(`Bedankt! Je contactverzoek met e-mail ${email} is geregistreerd.`);
  };

  const handleGuidanceRequest = (bankId) => {
    // Gebruik prompt in plaats van een popup formulier
    const email = window.prompt(`Voer je e-mailadres in voor begeleiding bij ${matches.find(b => b.id === bankId).name}:`);
  
    if (!email) return; // Als gebruiker annuleert of leeg laat
  
    // Bewaar deze informatie lokaal (geen API call)
    alert(`Bedankt! Je begeleidingsverzoek met e-mail ${email} is geregistreerd.`);
  };  
    
  const submitLeadInfo = async () => {
    if (!userEmail) {
      alert('Vul alstublieft een e-mailadres in');
       return;
    }
    
    const bank = matches.find(b => b.id === selectedBankId);
    const userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    
    try {
      console.log("API call naar:", `${API_URL}/submit-lead`);
      console.log("Met data:", {
        email: userEmail,
        name: '',
        interest_in_guidance: contactType === 'guidance',
        preferences: userPreferences
      });
      
      const response = await fetch(`${API_URL}/submit-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          name: '', // Optioneel, kan je later uitbreiden
          interest_in_guidance: contactType === 'guidance',
          preferences: userPreferences
        }),
      });
      
      const data = await response.json();
      console.log("API response:", data);
      
      if (data.status === 'success') {
        alert(`Bedankt! Je verzoek voor ${contactType === 'guidance' ? 'begeleiding' : 'contact'} bij ${bank.name} is ontvangen.`);
        setShowEmailForm(false);
        setUserEmail('');
      } else {
        alert('Er is iets misgegaan. Probeer het later opnieuw.');
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      alert(`Er is iets misgegaan: ${error.message}`);
    }
  };

  // Test functie voor de popup
  const handleTestPopup = () => {
    setShowEmailForm(true);
    console.log("Test popup geactiveerd");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      {/* Test knop voor de popup */}
      <button 
        onClick={handleTestPopup}
        className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded z-50"
      >
        Test Popup
      </button>
      
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
        {/* Nieuwe rapportknop */}
        <Link
          to="/report"
          className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition ml-2"
        >
          Rapport genereren
        </Link>
      </div>
      
      {/* Email formulier popup met verhoogde z-index */}
      {showEmailForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {contactType === 'guidance' ? 'Vraag begeleiding aan' : 'Neem contact op'}
            </h3>
            <p className="mb-4">
              Laat je e-mailadres achter en we nemen zo snel mogelijk contact met je op.
            </p>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Je e-mailadres"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              required
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEmailForm(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Annuleren
              </button>
              <button
                onClick={submitLeadInfo}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Versturen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;