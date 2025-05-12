// frontend/src/pages/IntroPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// Import je SVG of afbeelding
// import HeroImage from '../assets/images/hero.svg';
// Voor de testimonial kan je een placeholder gebruiken of een echte foto importeren
// import UserPhoto from '../assets/images/testimonial-user.jpg';

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
            
            {/* Grote, opvallende CTA knop (de "banaan") */}
            <div className="mb-8">
              <Link 
                to="/wizard" 
                className="animate-pulse inline-block text-center bg-orange-600 hover:bg-orange-700 text-white py-4 px-10 rounded-xl font-bold text-xl shadow-lg transition transform hover:scale-105"
              >
                Start de vergelijking
                <span className="block text-sm font-normal mt-1">Slechts 5 minuten</span>
              </Link>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 text-orange-500 mr-2" style={{maxWidth: '20px', maxHeight: '20px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Gratis en vrijblijvend</span>
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
                style={{maxWidth: '300px', maxHeight: '300px'}}
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
        
        {/* Testimonial Section */}
        <div className="mt-20 mb-16 bg-white rounded-xl shadow-md p-8 border-l-4 border-orange-500">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Gebruikersfoto */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-orange-200 border-4 border-orange-100">
                {/* Gebruik een echte foto of een placeholder */}
                {/* <img src={UserPhoto} alt="Tevreden gebruiker" className="w-full h-full object-cover" /> */}
                
                {/* Fallback alternatief als je geen foto hebt */}
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-full h-full text-orange-400"
                  style={{maxWidth: '100%', maxHeight: '100%'}}
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </div>
            </div>
            
            <div className="flex-1">
              <blockquote className="text-lg text-gray-700 italic mb-4">
                "Met BeleggingsTinder vond ik in enkele minuten de perfecte match voor mijn beleggingsstijl. Zo gemakkelijk en nuttig! Ik ben veel tijd bespaard gebleven door niet zelf alle opties te moeten onderzoeken."
              </blockquote>
              <div className="font-semibold text-gray-900">Laura Janssen</div>
              <div className="text-sm text-gray-500">Beginnend belegger uit Amsterdam</div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="icon-container w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-orange-600" style={{maxWidth: '24px', maxHeight: '24px'}}>
                <path fill="currentColor" d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Persoonlijke match</h3>
            <p className="text-gray-600">Vind een beleggingspartner die aansluit bij jouw unieke voorkeuren en doelen.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="icon-container w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-orange-600" style={{maxWidth: '24px', maxHeight: '24px'}}>
                <path fill="currentColor" d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8.41l2.54 2.54a1 1 0 0 1-1.42 1.42L11.3 12.7A1 1 0 0 1 11 12V8a1 1 0 0 1 2 0v3.59z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Snel en eenvoudig</h3>
            <p className="text-gray-600">Binnen enkele minuten heb je een persoonlijk overzicht van de beste opties.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="icon-container w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-orange-600" style={{maxWidth: '24px', maxHeight: '24px'}}>
                <path fill="currentColor" d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2zm14 8V5H5v6h14zm0 2H5v6h14v-6zM8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Transparant advies</h3>
            <p className="text-gray-600">Duidelijke vergelijking zonder verborgen kosten of verplichtingen.</p>
          </div>
        </div>
        
        {/* Extra CTA aan het einde */}
        <div className="mt-16 text-center">
          <Link 
            to="/wizard" 
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white py-3 px-8 rounded-lg font-semibold text-lg shadow-md transition"
          >
            Begin nu met vergelijken
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;