// frontend/src/pages/TestPage.jsx
import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-red-500 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white mb-4">Tailwind Test Pagina</h1>
      <p className="text-white">Als deze pagina een rode achtergrond heeft en gecentreerde witte tekst, dan werkt Tailwind!</p>
      
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded">Blauwe box</div>
        <div className="bg-green-500 text-white p-4 rounded">Groene box</div>
      </div>
    </div>
  );
};

export default TestPage;