// frontend/src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-800">
            BeleggingsMatch
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition duration-300">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 transition duration-300">
              Over ons
            </Link>
          </div>
          
          <div className="flex items-center">
            <Link
              to="/wizard"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-sm transition duration-300 text-sm font-medium"
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