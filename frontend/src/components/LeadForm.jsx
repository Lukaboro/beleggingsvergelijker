// frontend/src/components/LeadForm.jsx

import React, { useState } from 'react';

const LeadForm = ({ bankId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    interest_in_guidance: false,
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'E-mailadres is verplicht';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Voer een geldig e-mailadres in';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        bank_id: bankId,
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Laat je gegevens achter</h3>
      <p className="text-gray-600 mb-6">
        Vul je gegevens in om een persoonlijk rapport te ontvangen en/of contact op te nemen met de geselecteerde beleggingspartner.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            E-mailadres <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="jouw@email.nl"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Naam (optioneel)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Voornaam Achternaam"
          />
        </div>
        
        <div className="mb-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="interest_in_guidance"
                name="interest_in_guidance"
                checked={formData.interest_in_guidance}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="interest_in_guidance" className="text-gray-700">
                Ik wil graag persoonlijke begeleiding bij het selecteren van een beleggingspartner
              </label>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p className="mb-2">
              <strong>Privacy:</strong> Je gegevens worden vertrouwelijk behandeld en niet gedeeld met derden.
            </p>
            <p>
              <strong>Geen spam:</strong> We sturen je alleen relevante informatie over de beleggingspartner en, indien gewenst, over persoonlijke begeleiding.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-lg transition duration-300"
          >
            Annuleren
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
          >
            Verstuur en ontvang rapport
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;