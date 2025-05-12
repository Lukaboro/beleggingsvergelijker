// frontend/src/App.jsx - VERNIEUWDE VERSIE

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

function App() {
  return (
    <Router>
      {/* Test met een direct zichtbare achtergrondkleur */}
      <div className="flex flex-col min-h-screen" style={{backgroundColor: '#ffd6a5'}}>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/wizard" element={<Wizard />} />
            <Route path="/results" element={<Results />} />
            <Route path="/report" element={<Report />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;