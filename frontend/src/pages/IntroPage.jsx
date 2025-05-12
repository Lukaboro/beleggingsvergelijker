// frontend/src/pages/IntroPage.jsx - Minimaal bestand met directe styling

import React from 'react';
import { Link } from 'react-router-dom';

const IntroPage = () => {
  return (
    <div style={{
      backgroundColor: '#ffd6a5', 
      minHeight: '100vh', 
      width: '100%', 
      padding: '40px 20px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        maxWidth: '1000px', 
        margin: '0 auto', 
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#333'
        }}>
          Vind de beleggingspartner<br />
          <span style={{color: '#e85d04'}}>die écht bij jou past</span>
        </h1>
        
        <p style={{
          fontSize: '18px',
          maxWidth: '600px',
          margin: '0 auto 30px',
          color: '#555'
        }}>
          In slechts 5 minuten vergelijken we jouw voorkeuren met de kenmerken van drie unieke beleggingspartners.
        </p>
        
        {/* Opvallende CTA knop met inline styling */}
        <div style={{marginBottom: '40px', display: 'flex', justifyContent: 'center'}}>
          <Link to="/wizard" style={{
            backgroundColor: '#e85d04',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '20px',
            textDecoration: 'none',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'inline-block',
            textAlign: 'center'
          }}>
            Start de vergelijking
            <span style={{display: 'block', fontSize: '14px', fontWeight: 'normal', marginTop: '5px'}}>
              Slechts 5 minuten
            </span>
          </Link>
        </div>
        
        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '10px'}}>Persoonlijke match</h3>
            <p style={{color: '#666'}}>Vind een beleggingspartner die aansluit bij jouw unieke voorkeuren en doelen.</p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '10px'}}>Snel en eenvoudig</h3>
            <p style={{color: '#666'}}>Binnen enkele minuten heb je een persoonlijk overzicht van de beste opties.</p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '10px'}}>Transparant advies</h3>
            <p style={{color: '#666'}}>Duidelijke vergelijking zonder verborgen kosten of verplichtingen.</p>
          </div>
        </div>
        
        {/* Testimonial met inline styling */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          maxWidth: '700px',
          margin: '0 auto 40px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          borderLeft: '4px solid #e85d04',
          textAlign: 'left'
        }}>
          <blockquote style={{
            fontSize: '16px',
            fontStyle: 'italic',
            marginBottom: '15px',
            color: '#555'
          }}>
            "Met BeleggingsTinder vond ik in enkele minuten de perfecte match voor mijn beleggingsstijl. Zo gemakkelijk en nuttig! Ik ben veel tijd bespaard gebleven door niet zelf alle opties te moeten onderzoeken."
          </blockquote>
          <div style={{fontWeight: 'bold'}}>Laura Janssen</div>
          <div style={{fontSize: '14px', color: '#777'}}>Beginnend belegger uit Amsterdam</div>
        </div>
        
        {/* Extra CTA knop */}
        <Link to="/wizard" style={{
          backgroundColor: '#e85d04',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: 'bold',
          textDecoration: 'none',
          display: 'inline-block'
        }}>
          Begin nu met vergelijken
        </Link>
      </div>
    </div>
  );
};

export default IntroPage;