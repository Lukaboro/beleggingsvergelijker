// frontend/src/pages/TailwindTest.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TailwindTest = () => {
  return (
    <div>
      {/* Deze div gebruikt inline styling als fallback */}
      <div style={{
        backgroundColor: 'blue',
        color: 'white',
        padding: '20px',
        margin: '20px 0',
        textAlign: 'center'
      }}>
        <h2>Dit is inline styling</h2>
        <p>Deze sectie gebruikt inline styling en zou blauw moeten zijn.</p>
      </div>
      
      {/* Deze div gebruikt Tailwind classes */}
      <div className="bg-green-500 text-white p-5 m-5 text-center rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Dit is Tailwind CSS</h2>
        <p>Deze sectie gebruikt Tailwind classes en zou groen moeten zijn.</p>
      </div>
      
      <div className="text-center mt-5">
        <Link to="/" className="bg-purple-600 text-white px-4 py-2 rounded-lg inline-block">
          Terug naar home met Tailwind
        </Link>
        
        <Link to="/" style={{
          backgroundColor: 'orange',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          display: 'inline-block',
          marginLeft: '10px'
        }}>
          Terug naar home met inline
        </Link>
      </div>
    </div>
  );
};

export default TailwindTest;