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

function App() {
  // Deze stijl zou direct zichtbaar moeten zijn, ongeacht of Tailwind werkt
  const appStyle = {
    backgroundColor: '#ffd6a5',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <Router>
      <div style={appStyle}>
        <Navbar />
        <main style={{ flex: '1' }}>
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/wizard" element={<Wizard />} />
            <Route path="/results" element={<Results />} />
            <Route path="/report" element={<Report />} />
            <Route path="/about" element={<About />} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;