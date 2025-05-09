import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-gradient-to-b from-orange-100 to-orange-50 min-h-screen font-sans text-gray-800">
      {/* Decoratieve header met verbeterde typografie */}
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

      {/* De rest van de originele pagina blijft behouden */}
    </div>
  );
};

export default About;
