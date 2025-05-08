// frontend/src/pages/About.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen py-16 px-4">
      {/* Header met subtle decorative pattern */}
      <div className="relative mb-16 max-w-4xl mx-auto text-center">
        <div className="absolute inset-0 -z-10 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 font-medium text-sm mb-6 transform hover:scale-105 transition duration-300">
          Meer over ons
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 mb-6">
          Over dit project
        </h1>
        
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          We helpen je navigeren door het complexe landschap van beleggingspartners om de perfecte match voor jouw financiële toekomst te vinden.
        </p>
      </div>
      
      {/* Main content */}
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Our Mission Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Onze missie</h2>
          </div>
          
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              Het vinden van een geschikte beleggingspartner kan overweldigend zijn. Er zijn talloze opties, 
              verschillende kostenstructuren en diverse benaderingen van vermogensbeheer. Ons doel is om dit 
              proces te vereenvoudigen en transparanter te maken.
            </p>
            <p className="leading-relaxed">
              We helpen je bij het maken van een weloverwogen keuze door je voorkeuren te matchen met de 
              sterke punten van verschillende beleggingspartners. Zo kun je een keuze maken die écht bij je past.
            </p>
          </div>
        </div>
        
        {/* Independence Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Onafhankelijkheid</h2>
          </div>
          
          <div className="text-gray-600 leading-relaxed">
            <p>
              Deze vergelijkingssite is volledig onafhankelijk. We ontvangen geen commissies of vergoedingen 
              van de beleggingspartners die we vergelijken. Ons enige doel is om jou te helpen bij het vinden 
              van de beste match voor jouw situatie.
            </p>
          </div>
        </div>
        
        {/* Matching Process Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Over het matching proces</h2>
          </div>
          
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              Ons matching algoritme is gebaseerd op een zorgvuldige analyse van de kenmerken, diensten en 
              kostenstructuren van verschillende beleggingspartners. We vergelijken deze gegevens met jouw 
              voorkeuren en doelstellingen om de meest geschikte matches te vinden.
            </p>
            <p className="leading-relaxed">
              De resultaten zijn bedoeld als startpunt voor je eigen onderzoek en besluitvorming, niet als 
              definitief advies.
            </p>
          </div>
        </div>
        
        {/* Disclaimer Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center mb-6">
            <div className="bg-yellow-100 rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Disclaimer</h2>
          </div>
          
          <div className="space-y-5 text-gray-600">
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-2">Geen beleggingsadvies</h3>
              <p className="leading-relaxed">
                De informatie op deze website is uitsluitend bedoeld voor informatieve doeleinden en vormt geen 
                beleggingsadvies. De resultaten van onze vergelijkingstool zijn algemeen van aard en houden geen 
                rekening met jouw persoonlijke financiële situatie.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-2">Verantwoordelijkheid</h3>
              <p className="leading-relaxed">
                Beleggen brengt risico's met zich mee. Je bent zelf verantwoordelijk voor je beleggingsbeslissingen. 
                Raadpleeg altijd een gekwalificeerde financieel adviseur voordat je belangrijke financiële beslissingen neemt.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-2">Actuele informatie</h3>
              <p className="leading-relaxed">
                Hoewel we streven naar actuele en accurate informatie, kunnen er onnauwkeurigheden voorkomen. 
                Controleer altijd de meest recente informatie bij de beleggingspartners zelf.
              </p>
            </div>
          </div>
        </div>
        
        {/* Privacy Policy Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center mb-6">
            <div className="bg-red-100 rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Privacybeleid</h2>
          </div>
          
          <div className="space-y-5 text-gray-600">
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-2">Gegevensverzameling</h3>
              <p className="leading-relaxed">
                We verzamelen alleen de gegevens die je vrijwillig verstrekt via het contactformulier. 
                Je antwoorden op de vragenlijst worden tijdelijk opgeslagen tijdens je sessie, maar niet permanent bewaard.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-2">Gebruik van gegevens</h3>
              <p className="leading-relaxed">
                Je e-mailadres en naam worden alleen gebruikt om contact met je op te nemen over 
                de door jou geselecteerde beleggingspartner en, indien gewenst, over persoonlijke begeleiding.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-2">Delen van gegevens</h3>
              <p className="leading-relaxed">
                We delen je gegevens niet met derden, tenzij je daar expliciet toestemming voor geeft of wanneer dit wettelijk verplicht is.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="max-w-4xl mx-auto mt-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl shadow-xl p-10 text-white">
          <h2 className="text-2xl font-bold mb-4">Klaar om jouw ideale beleggingspartner te vinden?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Begin vandaag nog met het vergelijken van beleggingspartners en vind de beste match voor jouw financiële doelen.
          </p>
          <div className="space-x-4">
            <Link
              to="/"
              className="inline-block bg-white text-blue-600 font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              Terug naar startpagina
            </Link>
            <Link
              to="/wizard"
              className="inline-block bg-blue-800 bg-opacity-30 hover:bg-opacity-40 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              Begin de vergelijking
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-16 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Beleggingsvergelijker. Alle rechten voorbehouden.</p>
      </div>
    </div>
  );
};

export default About;