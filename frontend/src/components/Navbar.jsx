// frontend/src/components/Navbar.jsx (bijgewerkte versie)

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-orange-600">
            BeleggingsTinder
          </Link>
          
          <div className="hidden md:flex nav-links space-x-8">
            <Link to="/" className="text-gray-600 hover:text-orange-600 transition duration-300 py-2">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-orange-600 transition duration-300 py-2">
              Over ons
            </Link>
          </div>
          
          <div className="flex items-center">
            <Link
              to="/wizard"
              className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-6 rounded-lg shadow-sm transition duration-300 text-sm font-medium"
            >
              Start vergelijking
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;