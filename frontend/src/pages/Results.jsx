// frontend/src/pages/ResultsPage.jsx - FIXED VERSION

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../data/apiConfig';
import IterativeQuestionsSection from '../components/IterativeQuestionsSection';

const ResultsPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [contactType, setContactType] = useState('');
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [showFullAiAnalysis, setShowFullAiAnalysis] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [originalMatches, setOriginalMatches] = useState([]);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [hasRecalculated, setHasRecalculated] = useState(false);
  
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      
      try {
        // Gebruik opgeslagen resultaten van wizard
        const storedMatches = localStorage.getItem('matchResults');
        const userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
        
        if (storedMatches) {
          const matches = JSON.parse(storedMatches);
          setMatches(matches);
          setOriginalMatches(matches);
          console.log("✅ Gebruikt opgeslagen resultaten");
          
          // Haal AI insights op
          fetchAiInsights(matches, userPreferences);
          
        } else {
          console.warn("Geen opgeslagen resultaten - fallback naar API");
          
          const response = await fetch(`${API_URL}/match-diensten-optimized`, {
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
          
          const data = await response.json();
          
          if (data.matches && Array.isArray(data.matches)) {
            setMatches(data.matches);
            setOriginalMatches(data.matches);
            localStorage.setItem('matchResults', JSON.stringify(data.matches));
            fetchAiInsights(data.matches, userPreferences);
          } else {
            throw new Error("Ongeldig formaat voor matches");
          }
        }
        
      } catch (error) {
        console.error("Error bij ophalen resultaten:", error);
        
        // Final fallback
        const mockData = [
          {
            id: "mock1",
            name: "Fallback Bank",
            matchScore: 75,
            strengths: ["Reliable fallback"],
            weaknesses: ["Mock data"],
            details: { tco: 0.02 }
          }
        ];
        
        setMatches(mockData);
        setOriginalMatches(mockData);

      } finally {
        setLoading(false);
      }
      
    };
    
    fetchResults();
  }, []);

  // Debug logging - TIJDELIJK
useEffect(() => {
  if (matches.length > 0) {
    console.log(`📊 Showing ${matches.length} matches out of total available:`);
    matches.forEach((match, index) => {
      console.log(`${index + 1}. ${match.name}: ${match.matchScore}% (boost: ${match.details?.boost_applied || false})`);
    });
  }
}, [matches]);

  const fetchAiInsights = async (matches, userPreferences) => {
    try {
      const response = await fetch(`${API_URL}/generate-ai-insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userPreferences,
          matches: matches
        }),
      });
      
      const data = await response.json();
      console.log("🔍 Raw AI response:", data);
      
      if (data.success && data.insights) {
        setAiInsights(data.insights);
        console.log("✅ AI insights loaded:", data.insights);
      }
    } catch (error) {
      console.error("Error fetching AI insights:", error);
    }
  };

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

// ADD THIS FUNCTION TO YOUR ResultsPage.jsx (around line 130, near other handler functions)

const handleTextSubmit = async (textInput) => {
  console.log("🔥 FRONTEND: Text being sent:", textInput);
  console.log("🔥 FRONTEND: Text length:", textInput.length);
  
  if (!textInput.trim()) {
    alert("Voer eerst tekst in");
    return;
  }
  
  try {
    const userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    
    const requestBody = {
      text: textInput,
      preferences: userPreferences
    };
    
    console.log("🔥 FRONTEND: Request body:", requestBody);
    
    const response = await fetch(`${API_URL}/text-processing/process-text-and-match`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log("🔥 FRONTEND: Response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("🔥 FRONTEND: Backend response:", data);
    
    if (data.success) {
      handleTextRefinement(data);
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error("❌ FRONTEND: Network error:", error);
    alert(`Network error: ${error.message}`);
  }
};

  // Voeg toe bij je andere handler functions (rond regel 130-140)
const handleTextRefinement = async ({ updatedPreferences, matches: newMatches, textAnalysis, preferencesChanged, originalText }) => {
  console.log("🎯 Text refinement results:", {
    updatedPreferences,
    newMatches,
    textAnalysis,
    preferencesChanged,
    originalText
  });

  if (preferencesChanged) {
    // Update localStorage with new preferences
    localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
    
    // Update matches state
    setMatches(newMatches);
    setHasRecalculated(true);
    
    // Show feedback to user
    alert(`✅ AI analyse voltooid: "${textAnalysis.reasoning}"`);
    
    // Fetch new AI insights for refined matches
    fetchAiInsights(newMatches, updatedPreferences);
  }
};

  // FIXED handleIterativeAnswers functie
  const handleIterativeAnswers = async (impacts) => {
    setIsRecalculating(true);

    try {
      console.log("🔄 Recalculating with impacts:", impacts);
      
      const userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
      
      console.log("📊 Original preferences:", userPreferences);
      console.log("📋 BEFORE recalculation - Current matches:");
      matches.forEach((match, index) => {
        console.log(`   ${index + 1}. ${match.name}: ${match.matchScore}%`);
      });

      // DETAILED IMPACT ANALYSIS
      console.log("🔍 DETAILED IMPACT ANALYSIS:");
      impacts.forEach((impact, index) => {
        console.log(`   Impact ${index + 1}:`, impact);
        console.log(`   Impact keys:`, Object.keys(impact));
        console.log(`   Impact values:`, Object.values(impact));
        
        // Check elk key-value paar
        Object.entries(impact).forEach(([key, value]) => {
          console.log(`     ${key}: ${value} (type: ${typeof value})`);
          if (key.startsWith('weight_')) {
            console.log(`     ⭐ FOUND WEIGHT KEY: ${key} = ${value}`);
          }
        });
      });

      console.log("📤 SENDING TO BACKEND:", {
        original_preferences: userPreferences,
        impacts: impacts
      });

      const response = await fetch(`${API_URL}/recalculate-matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_preferences: userPreferences,
          impacts: impacts
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      // Debug logging
      console.log("🔍 RAW BACKEND RESPONSE:");
      console.log("Full response object:", data);
      console.log("Impacts that were sent:", impacts);
      console.log("Applied impacts from backend:", data.applied_impacts);
      
      console.log("🎯 FULL Recalculation response:", data);
      console.log("🎯 Weight adjustments:", data.weight_adjustments);
      console.log("🎯 Applied impacts:", data.applied_impacts);

      if (data.success) {
        // Check for special actions first
        if (data.action === 'restart_wizard') {
          console.log("🔄 Restart wizard action received");
          alert('Je wordt doorgestuurd naar de wizard om opnieuw te beginnen met andere voorkeuren.');
          window.location.href = '/wizard';
          return;
        }
        
        if (Array.isArray(data.matches)) {
          // Log nieuwe matches VOOR het updaten
          console.log("📋 AFTER recalculation - New matches:");
          data.matches.forEach((match, index) => {
            console.log(`   ${index + 1}. ${match.name}: ${match.matchScore}%`);
          });
        } else {
          throw new Error("Invalid matches format in response");
        }
      } else {
        throw new Error(data.error || "Recalculation failed");
      }
        
        // Log score vergelijking
        console.log("📊 SCORE COMPARISON:");
        matches.forEach((oldMatch, index) => {
          const newMatch = data.matches.find(m => m.id === oldMatch.id);
          if (newMatch) {
            const scoreDiff = newMatch.matchScore - oldMatch.matchScore;
            console.log(`   ${oldMatch.name}: ${oldMatch.matchScore}% → ${newMatch.matchScore}% (${scoreDiff > 0 ? '+' : ''}${scoreDiff.toFixed(1)})`);
          }
        });

        setMatches(data.matches);
        setHasRecalculated(true);

        if (data.modified_preferences) {
          localStorage.setItem('userPreferences', JSON.stringify(data.modified_preferences));
        }

        fetchAiInsights(data.matches, data.modified_preferences || userPreferences);
        
        console.log("✅ Matches successfully recalculated");
        console.log(`📈 Found ${data.matches.length} matches, total available: ${data.total_found}`);

    } catch (error) {
      console.error("❌ Error recalculating matches:", error);
      alert(`Herberekening mislukt: ${error.message}`);
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      // Bereid data voor
      const userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
      const storedMatches = localStorage.getItem('matchResults');
      const parsedMatches = storedMatches ? JSON.parse(storedMatches) : matches;
      
      // Claude analysis ophalen (gebruik bestaande aiInsights of fallback)
      let claudeAnalysis;
      if (aiInsights && aiInsights.key_insight) {
        claudeAnalysis = `💡 Belangrijkste bevinding: ${aiInsights.key_insight}\n\n⚖️ Trade-offs: ${aiInsights.trade_offs}\n\n🎯 Prioriteiten analyse: ${aiInsights.priority_analysis}`;
      } else {
        claudeAnalysis = "Gebaseerd op uw voorkeuren hebben we de beste matches voor u geselecteerd.";
      }
      
      console.log("📄 Genereren rapport...");
      console.log("📊 Data being sent:", { userPreferences, parsedMatches: parsedMatches.slice(0, 3) });
      
      // Haal beheerstijl data op voor de top 3 matches
      console.log("🔍 Fetching beheerstijl data for matches...");
      const enhancedMatches = await Promise.all(
        parsedMatches.slice(0, 3).map(async (match, index) => {
          try {
            console.log(`📝 Fetching beheerstijl for match ${index + 1}: ${match.naam_aanbieder || match.name || 'Unknown'} (ID: ${match.id})`);
            
            // Extract numeric ID from "dienst_82" format
            const numericId = match.id ? match.id.replace('dienst_', '') : null;
            console.log(`🔢 Using numeric ID: ${numericId}`);
            
            if (!numericId) {
              console.warn(`❌ No valid ID for ${match.naam_aanbieder || match.name}`);
              return match;
            }
            
            // Eerst proberen met dienst_id (numeric)
            let beheerstijlResponse = await fetch(`${API_URL}/tables/beheerstijl?filter_column=dienst_id&filter_value=${numericId}`);
            let beheerstijlData = await beheerstijlResponse.json();
            
            console.log(`📋 Beheerstijl response for ${match.naam_aanbieder || match.name || 'Unknown'}:`, beheerstijlData);
            
            // Extract from API response structure
            let actualData = beheerstijlData?.data || beheerstijlData;
            
            // Als geen resultaat, probeer dan met naam matching  
            if (!actualData || actualData.length === 0) {
              const matchName = match.naam_aanbieder || match.name;
              if (matchName) {
                console.log(`🔄 Trying name-based lookup for ${matchName}`);
                beheerstijlResponse = await fetch(`${API_URL}/tables/beheerstijl?search=${encodeURIComponent(matchName)}`);
                beheerstijlData = await beheerstijlResponse.json();
                actualData = beheerstijlData?.data || beheerstijlData;
                console.log(`📋 Name-based response:`, beheerstijlData);
              }
            }
            
            // Als nog steeds geen resultaat, debug alle beschikbare data
            if (!actualData || actualData.length === 0) {
              console.log(`🔄 Getting all beheerstijl data to debug...`);
              beheerstijlResponse = await fetch(`${API_URL}/tables/beheerstijl?select=dienst_id,investment_philosophy,beschrijving_lang`);
              const allData = await beheerstijlResponse.json();
              console.log(`📊 All beheerstijl data structure:`, allData);
            }
            
            const beschrijving = actualData?.[0]?.investment_philosophy || actualData?.[0]?.beschrijving_lang || actualData?.[0]?.beschrijving || null;
            console.log(`📄 Found investment_philosophy:`, beschrijving ? `"${beschrijving.substring(0, 100)}..."` : 'NULL');
            console.log(`📄 Description length: ${beschrijving ? beschrijving.length : 0} characters`);
            
            return {
              ...match,
              beschrijving_lang: beschrijving
            };
          } catch (error) {
            console.warn(`❌ Error fetching beheerstijl for ${match.naam_aanbieder || match.name || 'Unknown'}:`, error);
            return match;
          }
        })
      );
      
      console.log("📝 Enhanced matches with descriptions:", enhancedMatches);
      
      // Debug: First test data endpoint
      const debugResponse = await fetch(`${API_URL}/reports/debug-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_data: {
            bedrag: userPreferences.bedrag || 50000,
            type_dienst: userPreferences.type_dienst || 'Vermogensbeheer',
            kosten_belangrijkheid: userPreferences.kosten_belangrijkheid || 'belangrijk'
          },
          matches: parsedMatches.slice(0, 3),
          claude_analysis: claudeAnalysis
        }),
      });
      
      const debugData = await debugResponse.json();
      console.log("🔍 Debug response:", debugData);
      
      if (!debugResponse.ok) {
        throw new Error(`Debug failed: ${debugData.error}`);
      }
      
      const response = await fetch(`${API_URL}/reports/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_data: {
            bedrag: userPreferences.bedrag || 50000,
            type_dienst: userPreferences.type_dienst || 'Vermogensbeheer',
            kosten_belangrijkheid: userPreferences.kosten_belangrijkheid || 'belangrijk'
          },
          matches: enhancedMatches, // Gebruik enhanced data
          claude_analysis: claudeAnalysis
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Check content type
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/pdf')) {
        // Download PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `beleggingsrapport_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        console.log("✅ PDF rapport succesvol gegenereerd!");
      } else {
        // Open HTML in nieuwe tab
        const htmlContent = await response.text();
        const newWindow = window.open();
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        console.log("✅ HTML rapport geopend in nieuwe tab!");
      }
      
    } catch (error) {
      console.error("❌ Error generating report:", error);
      alert(`Er ging iets mis bij het genereren van het rapport: ${error.message}`);
    } finally {
      setIsGeneratingReport(false);
    }
  };
    
  const submitLeadInfo = async () => {
    if (!userEmail) {
      alert('Vul alstublieft een e-mailadres in');
      return;
    }
    
    const bank = matches.find(b => b.id === selectedBankId);
    const userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    
    try {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Resultaten laden...</h2>
          <p className="text-gray-600">
            We zoeken de beste beleggingspartners voor jou.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-600 mb-4">
            Jouw top 3 beleggingspartners
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gebaseerd op je antwoorden hebben we deze matches voor jou gevonden. Vergelijk de opties en kies de partner die het beste bij jou past.
          </p>
        </div>

        {/* AI Insights Box */}
        {aiInsights && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-orange-900 mb-4">
              🤖 AI-Analyse van je matches
            </h2>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium text-orange-800">💡 Belangrijkste bevinding:</span>
                <p className="text-orange-700">{aiInsights.key_insight}</p>
              </div>
              
              <div>
                <span className="font-medium text-orange-800">⚖️ Trade-offs in je matches:</span>
                <p className="text-orange-700">{aiInsights.trade_offs}</p>
              </div>
              
              <div>
                <span className="font-medium text-orange-800">🎯 Hoe je prioriteiten scoren:</span>
                <p className="text-orange-700">{aiInsights.priority_analysis}</p>
              </div>
            </div>

            <button
              onClick={() => setShowFullAiAnalysis(true)}
              className="mt-4 text-orange-600 hover:text-orange-800 font-medium underline"
            >
              Bekijk volledige AI-analyse
            </button>
          </div>
        )}

        {/* Iterative Questions Section */}
        <IterativeQuestionsSection 
          matches={matches}
          userPreferences={JSON.parse(localStorage.getItem('userPreferences')) || {}}
          onAnswerSubmit={handleIterativeAnswers}
          onTextRefinement={handleTextRefinement}
          onTextSubmit={handleTextSubmit}  // 👈 ADD THIS LINE
          showTextRefinement={true}
          isRecalculating={isRecalculating}
        />

        {/* Results comparison (if recalculated) */}
        {hasRecalculated && originalMatches.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-green-900 mb-4">
              📊 Voor en na vergelijking
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-green-800 mb-2">Originele volgorde:</h3>
                <ol className="space-y-1">
                  {originalMatches.slice(0, 3).map((match, index) => (
                    <li key={index} className="text-green-700">
                      {index + 1}. {match.name} ({match.matchScore}%)
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="font-medium text-green-800 mb-2">Bijgewerkte volgorde:</h3>
                <ol className="space-y-1">
                  {matches.slice(0, 3).map((match, index) => (
                    <li key={index} className="text-green-700">
                      {index + 1}. {match.name} ({match.matchScore}%)
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {matches && matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {matches.slice(0, 3).map((bank, index) => (
              <div key={bank.id || index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Matchscore</span>
                    <span className="text-2xl font-bold text-orange-600">{bank.matchScore}%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Rating</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < (bank.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">{bank.name}</h3>
                {bank.description && (
                  <p className="text-sm text-gray-600 text-center mb-4">{bank.description}</p>
                )}

                {/* Sterke punten */}
                {bank.strengths && bank.strengths.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Sterke punten</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {bank.strengths.slice(0, 3).map((strength, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Aandachtspunten */}
                {bank.weaknesses && bank.weaknesses.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Aandachtspunten</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {bank.weaknesses.slice(0, 2).map((weakness, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.938-.984 3.414-2.41" />
                          </svg>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleContactRequest(bank.id)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Ik neem contact op
                  </button>
                  <button
                    onClick={() => handleGuidanceRequest(bank.id)}
                    className="w-full border border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Ik wens begeleiding
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Geen resultaten gevonden</h3>
            <p className="text-gray-600">Probeer de wizard opnieuw met andere voorkeuren.</p>
          </div>
        )}

        {/* Bottom navigation */}
        <div className="text-center space-x-4">
          <Link
            to="/"
            className="inline-block py-3 px-6 bg-white hover:bg-gray-100 text-orange-600 border border-orange-600 rounded-lg font-medium transition-colors"
          >
            Terug naar homepage
          </Link>
          <Link
            to="/wizard"
            className="inline-block py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
          >
            Opnieuw beginnen
          </Link>
          <button
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
            className={`inline-block py-3 px-6 ${
              isGeneratingReport 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            } text-white rounded-lg font-medium transition-colors`}
          >
            {isGeneratingReport ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                Genereren...
              </>
            ) : (
              '📄 Download PDF Rapport'
            )}
          </button>
        </div>
      </div>
      
      {/* Email formulier popup */}
      {showEmailForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              {contactType === 'guidance' ? 'Vraag begeleiding aan' : 'Neem contact op'}
            </h3>
            <p className="mb-4 text-gray-600">
              Laat je e-mailadres achter en we nemen zo snel mogelijk contact met je op.
            </p>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Je e-mailadres"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEmailForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={submitLeadInfo}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                Versturen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full AI Analysis Modal */}
      {showFullAiAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">🤖 Volledige AI-Analyse</h3>
            
            {aiInsights && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">💡 Belangrijkste bevinding</h4>
                  <p className="text-gray-700">{aiInsights.key_insight}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">⚖️ Trade-offs tussen matches</h4>
                  <p className="text-gray-700">{aiInsights.trade_offs}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🎯 Analyse van je prioriteiten</h4>
                  <p className="text-gray-700">{aiInsights.priority_analysis}</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowFullAiAnalysis(false)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;