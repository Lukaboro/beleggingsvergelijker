// frontend/src/pages/IntroPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Beantwoord enkele vragen',
    text: 'Deel je beleggingsdoelen en voorkeuren via een korte vragenlijst.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    )
  },
  {
    title: 'Ontvang persoonlijke matches',
    text: 'Krijg direct je top 3 geschikte beleggingspartners te zien.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
      />
    )
  },
  {
    title: 'Maak een weloverwogen keuze',
    text: 'Download een rapport met alle details om een beslissing te nemen.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    )
  }
];

const IntroPage = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 leading-tight mb-6">
          Vind de beleggingspartner<br />die écht bij jou past
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          In slechts 5 minuten vergelijken we jouw voorkeuren met de kenmerken van drie unieke beleggingspartners.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto mb-16">
        {features.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {item.icon}
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          to="/wizard"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold py-4 px-10 rounded-full shadow-lg transition duration-300"
        >
          Start vergelijking
        </Link>
        <p className="mt-3 text-sm text-gray-500">Tijdsinvestering: ongeveer 5 minuten, geen verplichtingen</p>
      </div>
    </div>
  );
};

export default IntroPage;