// frontend/src/pages/About.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        Over dit project
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Onze missie</h2>
        <p className="text-gray-600 mb-6">
          Het vinden van een geschikte beleggingspartner kan overweldigend zijn. Er zijn talloze opties, 
          verschillende kostenstructuren en diverse benaderingen van vermogensbeheer. Ons doel is om dit 
          proces te vereenvoudigen en transparanter te maken.
        </p>
        <p className="text-gray-600 mb-6">
          We helpen je bij het maken van een weloverwogen keuze door je voorkeuren te matchen met de 
          sterke punten van verschillende beleggingspartners. Zo kun je een keuze maken die écht bij je past.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">Onafhankelijkheid</h2>
        <p className="text-gray-600 mb-6">
          Deze vergelijkingssite is volledig onafhankelijk. We ontvangen geen commissies of vergoedingen 
          van de beleggingspartners die we vergelijken. Ons enige doel is om jou te helpen bij het vinden 
          van de beste match voor jouw situatie.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">Over het matching proces</h2>
        <p className="text-gray-600 mb-6">
          Ons matching algoritme is gebaseerd op een zorgvuldige analyse van de kenmerken, diensten en 
          kostenstructuren van verschillende beleggingspartners. We vergelijken deze gegevens met jouw 
          voorkeuren en doelstellingen om de meest geschikte matches te vinden.
        </p>
        <p className="text-gray-600 mb-6">
          De resultaten zijn bedoeld als startpunt voor je eigen onderzoek en besluitvorming, niet als 
          definitief advies.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Disclaimer</h2>
        <div className="text-gray-600 space-y-4">
          <p>
            <strong>Geen beleggingsadvies:</strong> De informatie op deze website is uitsluitend bedoeld voor informatieve doeleinden en vormt geen 
            beleggingsadvies. De resultaten van onze vergelijkingstool zijn algemeen van aard en houden geen 
            rekening met jouw persoonlijke financiële situatie.
          </p>
          <p>
            <strong>Verantwoordelijkheid:</strong> Beleggen brengt risico's met zich mee. Je bent zelf verantwoordelijk voor je beleggingsbeslissingen. 
            Raadpleeg altijd een gekwalificeerde financieel adviseur voordat je belangrijke financiële beslissingen neemt.
          </p>
          <p>
            <strong>Actuele informatie:</strong> Hoewel we streven naar actuele en accurate informatie, kunnen er onnauwkeurigheden voorkomen. 
            Controleer altijd de meest recente informatie bij de beleggingspartners zelf.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Privacybeleid</h2>
        <div className="text-gray-600 space-y-4">
          <p>
            <strong>Gegevensverzameling:</strong> We verzamelen alleen de gegevens die je vrijwillig verstrekt via het contactformulier. 
            Je antwoorden op de vragenlijst worden tijdelijk opgeslagen tijdens je sessie, maar niet permanent bewaard.
          </p>
          <p>
            <strong>Gebruik van gegevens:</strong> Je e-mailadres en naam worden alleen gebruikt om contact met je op te nemen over 
            de door jou geselecteerde beleggingspartner en, indien gewenst, over persoonlijke begeleiding.
          </p>
          <p>
          <strong>Delen van gegevens:</strong> We delen je gegevens niet met derden, tenzij je daar expliciet toestemming voor geeft of wanneer dit wettelijk verplicht is.
          </p>
        </div>
      </div>
      
      <div className="text-center mt-10 mb-8">
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
        >
          Terug naar startpagina
        </Link>
      </div>
    </div>
  );
};

export default About;