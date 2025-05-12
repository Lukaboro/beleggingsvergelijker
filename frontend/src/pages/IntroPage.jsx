// frontend/src/pages/IntroPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// Import je SVG of afbeelding
// import HeroImage from '../assets/images/hero.svg';

const IntroPage = () => {
  return (
    <div className="intro-page bg-orange-100 min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Vind de beleggingspartner<br />
              <span className="text-orange-600">die écht bij jou past</span>
            </h1>
            
            <p className="text-xl text-gray-700 mb-8">
              In slechts 5 minuten vergelijken we jouw voorkeuren met de kenmerken van drie unieke beleggingspartners.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/wizard" 
                className="btn-primary bg-orange-600 hover:bg-orange-700 text-white py-3 px-8 rounded-lg font-semibold text-lg shadow-md"
              >
                Start de vergelijking
              </Link>
              
              <Link 
                to="/about" 
                className="btn-secondary bg-white hover:bg-gray-100 text-gray-800 py-3 px-8 rounded-lg font-semibold text-lg shadow-sm border border-gray-200"
              >
                Meer informatie
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="hero-illustration max-w-md">
              {/* Voeg hier je afbeelding toe */}
              {/* <img src={HeroImage} alt="Beleggingsvergelijker illustratie" /> */}
              
              {/* OF als fallback een SVG icoon */}
              <svg 
                viewBox="0 0 200 200" 
                className="large-icon w-full h-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Vul hier je SVG-inhoud in */}
                {/* Dit is slechts een voorbeeld */}
                <circle cx="100" cy="100" r="80" fill="#ff9e5d" />
                <path d="M50,100 Q100,50 150,100 Q100,150 50,100" stroke="#fff" strokeWidth="8" fill="none" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="icon-container w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-orange-600">
                <path fill="currentColor" d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Persoonlijke match</h3>
            <p className="text-gray-600">Vind een beleggingspartner die aansluit bij jouw unieke voorkeuren en doelen.</p>
          </div>
          
          {/* Voeg meer feature blocks toe */}
        </div>
      </div>
    </div>
  );
};

/* Extra controle voor specifieke grote illustraties - voeg toe aan global.css */
svg[viewBox],
svg[width][height] {
  max-width: 100%;
  height: auto;
}

/* Voor containers die een SVG bevatten */
.svg-container svg {
  width: 100%;
  max-width: 300px;
  max-height: 300px;
  display: block;
  margin: 0 auto;
}
export default IntroPage;