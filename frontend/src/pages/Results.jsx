// frontend/src/pages/Results.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BankCard from '../components/BankCard';
import LeadForm from '../components/LeadForm';

const Results = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [userPreferences, setUserPreferences] = useState({});
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  
  useEffect(() => {
    // Get matches and preferences from localStorage
    const storedMatches = localStorage.getItem('matchResults');
    const storedPreferences = localStorage.getItem('userPreferences');
    
    if (!storedMatches || !storedPreferences) {
      // Redirect to start if no data is available
      navigate('/');
      return;
    }
    
    setMatches(JSON.parse(storedMatches));
    setUserPreferences(JSON.parse(storedPreferences));
  }, [navigate]);
  
  const handleContactRequest = (bankId) => {
    setSelectedBank(bankId);
    setShowLeadForm(true);
  };
  
  const handleGuidanceRequest = (bankId) => {
    setSelectedBank(bankId);
    setShowLeadForm(true);
    // Pre-select guidance option in form
  };
  
  const handleLeadSubmit = async (leadData) => {
    try {
      const response = await fetch('http://localhost:8000/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...leadData,
          preferences: userPreferences,
        }),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // Show success message and redirect to report page
        navigate('/report');
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      // Handle error
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">
        Jouw drie meest geschikte partners
      </h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {matches.map((bank) => (
          <BankCard
            key={bank.id}
            bank={bank}
            onContactRequest={() => handleContactRequest(bank.id)}
            onGuidanceRequest={() => handleGuidanceRequest(bank.id)}
          />
        ))}
      </div>
      
      {showLeadForm && (
        <div className="mt-12">
          <LeadForm
            bankId={selectedBank}
            onSubmit={handleLeadSubmit}
            onCancel={() => setShowLeadForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Results;