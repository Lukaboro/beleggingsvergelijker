// frontend/src/pages/Report.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Report = () => {
  const navigate = useNavigate();
  const [reportUrl, setReportUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const userPreferences = JSON.parse(localStorage.getItem('userPreferences'));
    
    if (!userPreferences) {
      navigate('/');
      return;
    }
    
    // Generate the report
    const generateReport = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/generate-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userPreferences),
        });
        
        const data = await response.json();
        setReportUrl(data.report_url);
        setIsLoading(false);
      } catch (error) {
        console.error('Error generating report:', error);
        setIsLoading(false);
      }
    };
    
    generateReport();
  }, [navigate]);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">
          Je persoonlijke beleggingsrapport is klaar!
        </h1>
        <p className="text-xl text-gray-600">
          Hieronder kun je het rapport bekijken of downloaden voor toekomstig gebruik.
        </p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Je rapport wordt gegenereerd...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-8">
            <svg className="w-24 h-24 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Rapport succesvol gegenereerd
          </h2>
          
          <p className="text-center text-gray-600 mb-8">
            Je rapport bevat een overzicht van je voorkeuren en een gedetailleerde analyse van de best passende beleggingspartners.
          </p>
          
          <div className="text-center mb-8">
            <a
              href={reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
            >
              Bekijk je rapport
            </a>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Volgende stappen
            </h3>
            <ul className="text-gray-600 space-y-3">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Bestudeer het rapport en de aanbevelingen</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Neem contact op met de aanbevolen beleggingspartners</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Plan een persoonlijk gesprek voor een gedetailleerde analyse</span>
              </li>
            </ul>
          </div>
        </div>
      )}
      
      <div className="text-center mt-10">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Terug naar de startpagina
        </button>
      </div>
    </div>
  );
};

export default Report;