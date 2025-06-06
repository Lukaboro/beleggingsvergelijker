// frontend/src/pages/Report.jsx - FIXED VERSION

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../data/apiConfig';

const Report = () => {
  const navigate = useNavigate();
  const [reportUrl, setReportUrl] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const userPreferences = JSON.parse(localStorage.getItem('userPreferences'));
    
    if (!userPreferences) {
      navigate('/');
      return;
    }
    
    // Generate the AI-enhanced report
    const generateReport = async () => {
      try {
        console.log("Generating AI report with API URL:", `${API_URL}/generate-ai-report`);
        console.log("User preferences:", userPreferences);
        
        const response = await fetch(`${API_URL}/generate-ai-report`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userPreferences),
        });
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log("AI Report response:", data);
        
        if (!data.success) {
          throw new Error(data.detail || 'Failed to generate report');
        }
        
        // Set report content for preview
        setReportContent(data.report_content);
        
        // Set PDF URL - check if actually provided
        if (data.report_url && data.report_url !== null) {
          // Fix de URL constructie
          let fullReportUrl;
          if (data.report_url.startsWith('http')) {
            fullReportUrl = data.report_url;
          } else if (data.report_url.startsWith('/')) {
            // Absolute path - gebruik de base URL
            fullReportUrl = `${window.location.origin}${data.report_url}`;
          } else {
            // Relative path - combineer met API base
            fullReportUrl = `${API_URL.replace('/api', '')}/${data.report_url}`;
          }
          
          console.log("Full report URL:", fullReportUrl);
          setReportUrl(fullReportUrl);
        } else {
          console.log("No PDF URL provided - PDF generation disabled");
          setReportUrl(''); // Geen PDF beschikbaar
        }
        
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error generating AI report:', error);
        setError(error.message);
        
        // Fallback: Toon een mock rapport in plaats van nog een API call
        setReportContent(generateMockReport(userPreferences));
        setReportUrl(''); // Geen PDF beschikbaar
        setIsLoading(false);
      }
    };
    
    generateReport();
  }, [navigate]);
  
  // Mock rapport als fallback
  const generateMockReport = (userPreferences) => {
    return `
# Persoonlijk Beleggingsrapport

## Samenvatting
Op basis van uw voorkeuren hebben we een analyse gemaakt van de beste beleggingspartners voor uw profiel.

## Uw profiel
- **Bedrag**: €${userPreferences.bedrag || 'Niet gespecificeerd'}
- **Type dienst**: ${userPreferences.type_dienst || 'Niet gespecificeerd'}

## Aanbevelingen
We hebben drie partners gevonden die goed aansluiten bij uw profiel. Bekijk de resultaten pagina voor meer details.

## Volgende stappen
1. Bekijk de gedetailleerde matches op de resultaten pagina
2. Neem contact op met de aanbevolen partners
3. Plan een persoonlijk gesprek

*Dit is een vereenvoudigd rapport. Voor een volledige AI-analyse kunt u het later opnieuw proberen.*
    `;
  };
  
  // Helper function to format report content for display
  const formatReportContent = (content) => {
    if (!content) return '';
    
    // Convert markdown-style formatting to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-orange-600 mt-8 mb-6">$1</h1>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>')
      .replace(/<p class="mb-4"><h/g, '<h')
      .replace(/<\/h([1-6])><\/p>/g, '</h$1>');
  };
  
  if (error && !reportContent) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Er is iets misgegaan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {error}
          </p>
          <button
            onClick={() => navigate('/results')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Terug naar resultaten
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-orange-600 mb-4">
          Je persoonlijke AI-beleggingsrapport is klaar!
        </h1>
        <p className="text-xl text-gray-600">
          Hieronder kun je een preview bekijken en het volledige rapport downloaden.
        </p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Je AI-rapport wordt gegenereerd...</p>
          <p className="text-sm text-gray-500 mt-2">Dit kan even duren terwijl we je matches analyseren</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Success indicator */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-center mb-6">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              {error ? 'Rapport gegenereerd (vereenvoudigd)' : 'AI-Rapport succesvol gegenereerd'}
            </h2>
            
            <p className="text-center text-gray-600 mb-6">
              Je rapport bevat een {error ? 'basis' : 'gepersonaliseerde'} analyse van waarom deze beleggingspartners het beste bij jouw profiel passen.
            </p>
            
            <div className="text-center">
              {reportUrl ? (
                <a
                  href={reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 mr-4"
                >
                  📄 Download volledige PDF
                </a>
              ) : (
                <span className="inline-block bg-gray-400 text-white font-bold py-3 px-6 rounded-lg shadow-md mr-4 cursor-not-allowed">
                  📄 PDF ontwikkeling gepland
                </span>
              )}
              <button
                onClick={() => document.getElementById('report-preview').scrollIntoView({ behavior: 'smooth' })}
                className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
              >
                👁️ Bekijk preview
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                <p className="text-sm">⚠️ AI-analyse tijdelijk niet beschikbaar. Getoond wordt een basis rapport. Probeer het later opnieuw voor een volledige AI-analyse.</p>
              </div>
            )}
          </div>

          {/* Report Preview */}
          {reportContent && (
            <div id="report-preview" className="bg-white rounded-lg shadow-md p-8">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  📊 Rapport Preview
                </h3>
                <p className="text-gray-600">
                  Hieronder een preview van je {error ? 'basis' : 'gepersonaliseerde'} analyse. {reportUrl ? 'Download de PDF voor de volledige versie.' : ''}
                </p>
              </div>
              
              <div 
                className="prose prose-lg max-w-none report-content"
                dangerouslySetInnerHTML={{ __html: formatReportContent(reportContent) }}
                style={{
                  lineHeight: '1.6',
                  maxHeight: '600px',
                  overflowY: 'auto',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '24px',
                  backgroundColor: '#fafafa'
                }}
              />
              
              {reportUrl && (
                <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                  <p className="text-orange-800 text-sm">
                    💡 <strong>Dit is een preview.</strong> Download de volledige PDF voor alle details, grafieken en complete analyse.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                🚀 Volgende stappen
              </h3>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-orange-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Bestudeer het rapport en de gepersonaliseerde analyse</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-orange-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Neem contact op met de aanbevolen beleggingspartners</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-orange-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Plan een persoonlijk gesprek voor een gedetailleerde analyse</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-orange-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Gebruik de inzichten om je beleggingsstrategie te verfijnen</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center mt-10">
        <button
          onClick={() => navigate('/results')}
          className="text-orange-600 hover:text-orange-800 font-medium"
        >
          ← Terug naar de resultaten
        </button>
      </div>
    </div>
  );
};

export default Report;