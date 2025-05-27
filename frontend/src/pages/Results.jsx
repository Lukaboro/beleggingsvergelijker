
// frontend/src/pages/ResultsPage.jsx - VERBETERDE VERSIE MET ANTI-CACHING

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../data/apiConfig'; // Importeer je API config

const ResultsPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [contactType, setContactType] = useState('');
  const [selectedBankId, setSelectedBankId] = useState(null);

  useEffect(() => {
    // BELANGRIJKE FIX: Met deze functie garanderen we dat de resultaten kloppen met de actuele voorkeuren
    const fetchResults = async () => {
      setLoading(true);
      
      try {
        // Haal de opgeslagen voorkeuren op
        const userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
        console.log("Opgehaalde userPreferences:", userPreferences);
        
        // Controleer of min_rating is ingesteld en debug het
        console.log("min_rating in voorkeuren:", userPreferences.min_rating, 
                    "type:", typeof userPreferences.min_rating);
        
        // Roep de backend aan om verse resultaten te krijgen
        const response = await fetch(`${API_URL}/match-diensten`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate'
          },
          body: JSON.stringify(userPreferences),
        });
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        // Parse de response
        const text = await response.text();
        console.log("Ruwe API response:", text);
        
        const data = JSON.parse(text);
        console.log("API resultaten:", data);
        
        if (data.matches && Array.isArray(data.matches)) {
          // Update localStorage en state met nieuwe resultaten
          localStorage.setItem('matchResults', JSON.stringify(data.matches));
          setMatches(data.matches);
          
          // Debug info over banken ratings
          console.log("Ontvangen bank ratings:");
          data.matches.forEach(bank => {
            console.log(`${bank.name}: rating = ${bank.rating}, score = ${bank.matchScore}`);
          });
          
          // Extra validatie voor min_rating
          if (userPreferences.min_rating && userPreferences.min_rating !== '0') {
            const minRatingValue = parseInt(userPreferences.min_rating);
            const invalidBanks = data.matches.filter(bank => bank.rating < minRatingValue);
            
            if (invalidBanks.length > 0) {
              console.warn("WAARSCHUWING: Deze banken hebben een lagere rating dan het minimum:");
              invalidBanks.forEach(bank => {
                console.warn(`- ${bank.name} (Rating: ${bank.rating}, Min vereist: ${minRatingValue})`);
              });
            } else {
              console.log("✅ Alle banken voldoen aan de minimum rating vereiste");
            }
          }
        } else {
          throw new Error("Ongeldig formaat voor matches in response");
        }
      } catch (error) {
        console.error("Error bij ophalen resultaten:", error);
        
        // Fallback naar opgeslagen resultaten indien beschikbaar
        const storedMatches = localStorage.getItem('matchResults');
        if (storedMatches) {
          console.log("Gebruik opgeslagen resultaten als fallback");
          setMatches(JSON.parse(storedMatches));
        } else {
          console.error("Geen opgeslagen resultaten beschikbaar");
        }
      } finally {
        setLoading(false);
      }
    };
    
    // Roep de fetchResults functie aan bij het laden van de pagina
    fetchResults();
  }, []);

  // Vereenvoudigde versie van de contactfuncties
  const handleContactRequest = (bankId) => {
    setSelectedBankId(bankId);
    setContactType('contact');
    setShowEmailForm(true);
  };

  const handleGuidanceRequest = (bankId) => {
    setSelectedBankId(bankId);
    setContactType('guidance');
    setShowEmailForm(true);
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
          name: '', 
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

  // Loading state tonen
  if (loading) {
    return (
      <div className="results-page bg-gray-50 min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Resultaten laden...</h2>
          <p className="text-gray-600">
            We zoeken de beste beleggingspartners op basis van je criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 mb-4">
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
                <span className="text-lg font-bold text-orange-600">{bank.matchScore}%</span>
              </div>

              {/* Rating indicator toevoegen */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">Rating</span>
                <div className="flex">
                  {[...Array(bank.rating || 0)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Opnieuw gestileerde icon container met strikte afmetingen */}
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" style={{maxWidth: '32px', maxHeight: '32px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">{bank.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{bank.description}</p>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-1">Sterke punten</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {bank.strengths.map((point, i) => (
                    <li key={i} className="flex items-start">
                      {/* Kleinere SVG met inline styling */}
                      <svg className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" 
                           style={{maxWidth: '16px', maxHeight: '16px'}} 
                           fill="none" 
                           stroke="currentColor" 
                           viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-1">Aandachtspunten</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {bank.weaknesses.map((point, i) => (
                    <li key={i} className="flex items-start">
                      {/* Kleinere SVG met inline styling */}
                      <svg className="w-4 h-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" 
                           style={{maxWidth: '16px', maxHeight: '16px'}} 
                           fill="none" 
                           stroke="currentColor" 
                           viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856" />
                      </svg>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-2">
             <button
                onClick={() => handleContactRequest(bank.id)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Ik neem contact op
              </button>
              <button
                onClick={() => handleGuidanceRequest(bank.id)}
                className="w-full border border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold py-2 px-4 rounded-lg transition"
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
          className="py-3 px-6 bg-white hover:bg-gray-100 text-orange-600 border border-orange-600 rounded-lg font-medium transition"
        >
          Terug naar homepage
        </Link>
        <Link
          to="/wizard"
          className="py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition"
        >
          Opnieuw beginnen
        </Link>
        {/* Rapportknop */}
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
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded"
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