// frontend/src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="text-xl font-bold text-blue-800">
              BeleggingsMatch
            </Link>
            <p className="text-gray-600 mt-2 max-w-md">
              Vind de beleggingspartner die écht bij jou past, gebaseerd op jouw persoonlijke voorkeuren en doelstellingen.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-gray-800 font-semibold mb-3">Links</h3>
              <ul className="text-gray-600 space-y-2">
                <li>
                  <Link to="/" className="hover:text-blue-600 transition duration-300">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/wizard" className="hover:text-blue-600 transition duration-300">
                    Start vergelijking
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-blue-600 transition duration-300">
                    Over ons
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-gray-800 font-semibold mb-3">Juridisch</h3>
              <ul className="text-gray-600 space-y-2">
                <li>
                  <Link to="/about" className="hover:text-blue-600 transition duration-300">
                    Disclaimer
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-blue-600 transition duration-300">
                    Privacybeleid
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} BeleggingsMatch. Alle rechten voorbehouden.</p>
          <p className="mt-1">
            Dit is een prototype voor demonstratiedoeleinden. Geen financieel advies.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;