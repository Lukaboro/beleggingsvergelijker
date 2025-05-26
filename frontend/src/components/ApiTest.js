import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const ApiTest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test 1: Beschikbare tabellen
      console.log('Testing available tables...');
      const tables = await apiService.getAvailableTables();
      console.log('Tables:', tables);
      
      // Test 2: Aanbieders data
      console.log('Testing aanbieders...');
      const aanbieders = await apiService.getTableData('aanbieders', { limit: 5 });
      console.log('Aanbieders:', aanbieders);
      
      setData({
        tables: tables,
        aanbieders: aanbieders
      });
      
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {data && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Available Tables</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(data.tables, null, 2)}
            </pre>
          </div>
          
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Aanbieders (First 5)</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(data.aanbieders, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      <button 
        onClick={testConnection}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        Test Again
      </button>
    </div>
  );
};

export default ApiTest;