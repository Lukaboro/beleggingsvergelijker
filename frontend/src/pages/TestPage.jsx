// frontend/src/pages/TestPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TestPage = () => {
  return (
    <div style={{
      backgroundColor: 'red',
      color: 'white',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Tailwind Test Pagina</h1>
      <p>
        Als je deze tekst in wit op een rode achtergrond ziet, dan werkt basale inline CSS styling.
      </p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/" style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '4px',
          textDecoration: 'none',
          display: 'inline-block',
          fontWeight: 'bold'
        }}>
          Terug naar home
        </Link>
      </div>
    </div>
  );
};

export default TestPage;