// frontend/src/pages/About.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-gradient-to-b from-orange-100 to-orange-50 min-h-screen">
      {/* Decoratieve header met golvende achtergrond */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-orange-400 to-amber-500 transform -skew-y-3 origin-top-right -translate-y-10"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-white text-orange-600 font-medium text-sm mb-6 shadow-md animate-pulse">
            Ontdek meer
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 drop-shadow-lg">
            Over dit project
          </h1>
          
          <div className="max-w-2xl">
            <p className="text-xl text-white drop-shadow mb-8">
              We revolutioneren de manier waarop je een beleggingspartner vindt met ons innovatieve matchingplatform.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-white rounded-full text-orange-600 font-bold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Startpagina
              </Link>
              
              <Link
                to="/wizard"
                className="inline-flex items-center px-6 py-3 bg-orange-600 rounded-full text-white font-bold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-orange-700"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Begin de vergelijking
              </Link>
              
              <Link
                to="/results"
                className="inline-flex items-center px-6 py-3 bg-white bg-opacity-30 backdrop-blur-sm rounded-full text-white font-bold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-opacity-40"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Ga naar resultaten
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Snelle navigatie */}
      <div className="sticky top-0 z-50 bg-white shadow-md py-4 px-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
            <a href="#missie" className="inline-flex items-center px-5 py-2 bg-orange-100 rounded-full text-orange-600 font-medium whitespace-nowrap transition-all hover:bg-orange-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Missie
            </a>
            <a href="#onafhankelijkheid" className="inline-flex items-center px-5 py-2 bg-orange-100 rounded-full text-orange-600 font-medium whitespace-nowrap transition-all hover:bg-orange-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              Onafhankelijkheid
            </a>
            <a href="#matching" className="inline-flex items-center px-5 py-2 bg-orange-100 rounded-full text-orange-600 font-medium whitespace-nowrap transition-all hover:bg-orange-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Matching proces
            </a>
            <a href="#disclaimer" className="inline-flex items-center px-5 py-2 bg-orange-100 rounded-full text-orange-600 font-medium whitespace-nowrap transition-all hover:bg-orange-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              Disclaimer
            </a>
            <a href="#privacy" className="inline-flex items-center px-5 py-2 bg-orange-100 rounded-full text-orange-600 font-medium whitespace-nowrap transition-all hover:bg-orange-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Privacy
            </a>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Mission Section */}
          <div id="missie" className="bg-white rounded-3xl shadow-xl p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border-t-8 border-orange-500">
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 rounded-full p-4 mr-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-800">Onze missie</h2>
            </div>
            
            <div className="space-y-6 text-gray-600">
              <p className="leading-relaxed text-lg">
                Het vinden van een geschikte beleggingspartner kan overweldigend zijn. Er zijn talloze opties, 
                verschillende kostenstructuren en diverse benaderingen van vermogensbeheer. Ons doel is om dit 
                proces te vereenvoudigen en transparanter te maken.
              </p>
              <p className="leading-relaxed text-lg">
                We helpen je bij het maken van een weloverwogen keuze door je voorkeuren te matchen met de 
                sterke punten van verschillende beleggingspartners. Zo kun je een keuze maken die écht bij je past.
              </p>
            </div>
          </div>
          
          {/* Independence Section */}
          <div id="onafhankelijkheid" className="bg-white rounded-3xl shadow-xl p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border-t-8 border-amber-500">
            <div className="flex items-center mb-6">
              <div className="bg-amber-100 rounded-full p-4 mr-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-800">Onafhankelijkheid</h2>
            </div>
            
            <div className="text-gray-600 leading-relaxed text-lg">
              <p>
                Deze vergelijkingssite is volledig onafhankelijk. We ontvangen geen commissies of vergoedingen 
                van de beleggingspartners die we vergelijken. Ons enige doel is om jou te helpen bij het vinden 
                van de beste match voor jouw situatie.
              </p>
              
              <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="font-medium text-amber-900">Wist je dat?</span>
                </div>
                <p className="mt-2 text-amber-800">
                  Veel vergelijkingssites ontvangen commissies voor aanbevelingen, wat kan leiden tot vooroordelen. Wij niet.
                </p>
              </div>
            </div>
          </div>
          
          {/* Matching Process Section - Full width */}
          <div id="matching" className="bg-white rounded-3xl shadow-xl p-8 md:col-span-2 transform transition-all duration-500 hover:shadow-2xl border-t-8 border-orange-500">
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 rounded-full p-4 mr-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-800">Over het matching proces</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-orange-600">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Jouw voorkeuren</h3>
                <p className="text-gray-600">
                  We verzamelen je beleggingsdoelen, risicobereidheid, budget en andere belangrijke voorkeuren.
                </p>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-orange-600">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Slimme analyse</h3>
                <p className="text-gray-600">
                  Ons algoritme analyseert alle beschikbare beleggingspartners op basis van jouw criteria.
                </p>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-orange-600">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Persoonlijke matches</h3>
                <p className="text-gray-600">
                  We presenteren de beste matches voor jou, met transparante vergelijking van voor- en nadelen.
                </p>
              </div>
            </div>
            
            <p className="mt-8 text-lg text-gray-600">
              De resultaten zijn bedoeld als startpunt voor je eigen onderzoek en besluitvorming, niet als 
              definitief advies. We moedigen je aan om de aanbevelingen kritisch te bekijken.
            </p>
          </div>
        </div>
        
        {/* Disclaimer and Privacy - Accordions */}
        <div className="mt-16 mb-8">
          <div id="disclaimer" className="bg-white rounded-3xl shadow-lg mb-6 overflow-hidden">
            <div className="border-b border-gray-200">
              <button className="flex items-center justify-between w-full px-8 py-6 text-left focus:outline-none">
                <div className="flex items-center">
                  <div className="bg-red-100 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Disclaimer</h2>
                </div>
              </button>
            </div>
            
            <div className="px-8 py-6">
              <div className="space-y-6 text-gray-600">
                <div className="flex items-start p-5 bg-red-50 rounded-xl border border-red-100">
                  <svg className="w-6 h-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Geen beleggingsadvies</h3>
                    <p className="leading-relaxed">
                      De informatie op deze website is uitsluitend bedoeld voor informatieve doeleinden en vormt geen 
                      beleggingsadvies. De resultaten van onze vergelijkingstool zijn algemeen van aard en houden geen 
                      rekening met jouw persoonlijke financiële situatie.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-5 bg-red-50 rounded-xl border border-red-100">
                  <svg className="w-6 h-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Verantwoordelijkheid</h3>
                    <p className="leading-relaxed">
                      Beleggen brengt risico's met zich mee. Je bent zelf verantwoordelijk voor je beleggingsbeslissingen. 
                      Raadpleeg altijd een gekwalificeerde financieel adviseur voordat je belangrijke financiële beslissingen neemt.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-5 bg-red-50 rounded-xl border border-red-100">
                  <svg className="w-6 h-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Actuele informatie</h3>
                    <p className="leading-relaxed">
                      Hoewel we streven naar actuele en accurate informatie, kunnen er onnauwkeurigheden voorkomen. 
                      Controleer altijd de meest recente informatie bij de beleggingspartners zelf.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div id="privacy" className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <button className="flex items-center justify-between w-full px-8 py-6 text-left focus:outline-none">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Privacybeleid</h2>
                </div>
              </button>
            </div>
            
            <div className="px-8 py-6">
              <div className="space-y-6 text-gray-600">
                <div className="flex items-start p-5 bg-purple-50 rounded-xl border border-purple-100">
                  <svg className="w-6 h-6 text-purple-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Gegevensverzameling</h3>
                    <p className="leading-relaxed">
                      We verzamelen alleen de gegevens die je vrijwillig verstrekt via het contactformulier. 
                      Je antwoorden op de vragenlijst worden tijdelijk opgeslagen tijdens je sessie, maar niet permanent bewaard.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-5 bg-purple-50 rounded-xl border border-purple-100">
                  <svg className="w-6 h-6 text-purple-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Gebruik van gegevens</h3>
                    <p className="leading-relaxed">
                      Je e-mailadres en naam worden alleen gebruikt om contact met je op te nemen over 
                      de door jou geselecteerde beleggingspartner en, indien gewenst, over persoonlijke begeleiding.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-5 bg-purple-50 rounded-xl border border-purple-100">
                  <svg className="w-6 h-6 text-purple-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Delen van gegevens</h3>
                    <p className="leading-relaxed">
                      We delen je gegevens niet met derden, tenzij je daar expliciet toestemming voor geeft of wanneer dit wettelijk verplicht is.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Big CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-6">Klaar om jouw ideale beleggingspartner te vinden?</h2>
          <p className="text-xl text-white text-opacity-90 mb-10 max-w-3xl mx-auto">
            Begin vandaag nog met het vergelijken van beleggingspartners en ontdek welke het beste aansluit bij jouw financiële doelen.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center px-8 py-4 bg-white rounded-full text-orange-600 font-bold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Terug naar startpagina
            </Link>
            
            <Link
              to="/wizard"
              className="inline-flex items-center px-8 py-4 bg-orange-800 rounded-full text-white font-bold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Start de vergelijking nu
            </Link>
          </div>
        </div>
      </div>
      
      {/* Custom Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-orange-400">Beleggingsvergelijker</h3>
              <p className="text-gray-400 mb-4">
                De slimme manier om de perfecte beleggingspartner te vinden die aansluit bij jouw financiële doelen.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.873 16.476a.888.888 0 01-1.227.328c-3.36-2.05-7.59-2.512-12.56-1.38a.887.887 0 01-.485-1.705c5.44-1.264 10.11-.726 13.943 1.533a.887.887 0 01.329 1.224zm1.565-3.485a1.11 1.11 0 01-1.534.41c-3.842-2.36-9.698-3.044-14.24-1.666a1.11 1.11 0 01-.582-2.147c5.19-1.573 11.654-.812 16.038 1.872a1.11 1.11 0 01.318 1.531zm.135-3.625c-4.612-2.741-12.23-2.997-16.64-1.658a1.333 1.333 0 11-.775-2.543c5.055-1.528 13.453-1.23 18.766 1.906a1.333 1.333 0 01-1.35 2.295z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Snelle links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/wizard" className="text-gray-400 hover:text-white transition-colors">Vergelijk nu</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Over ons</Link></li>
                <li><a href="#disclaimer" className="text-gray-400 hover:text-white transition-colors">Disclaimer</a></li>
                <li><a href="#privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Beleggingspartners</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Banken</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Brokers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Vermogensbeheerders</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Robo-adviseurs</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Contact</h3>
              <p className="text-gray-400 mb-4">
                Heb je vragen of opmerkingen? Neem gerust contact met ons op.
              </p>
              <a href="mailto:info@beleggingsvergelijker.nl" className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                info@beleggingsvergelijker.nl
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Beleggingsvergelijker. Alle rechten voorbehouden.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Gebruiksvoorwaarden</a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Cookiebeleid</a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Back to top button */}
      <a 
        href="#" 
        className="fixed bottom-6 right-6 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-colors z-50"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      </a>
      
      {/* Add this CSS to your global stylesheet */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default About;             