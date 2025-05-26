// frontend/src/App.jsx - Tijdelijke test versie

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntroPage from './pages/IntroPage';
import Wizard from './pages/Wizard';
import Results from './pages/Results';
import Report from './pages/Report';
import About from './pages/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './assets/styles/global.css';
import TestPage from './pages/TestPage';
import TailwindTest from './pages/TailwindTest';
import ApiTest from './components/ApiTest';

function App() {
  // Deze stijl zou direct zichtbaar moeten zijn, ongeacht of Tailwind werkt
  const appStyle = {
    backgroundColor: '#ffd6a5',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
  <div className="App">
    <ApiTest />
  </div>
  );
}

export default App;