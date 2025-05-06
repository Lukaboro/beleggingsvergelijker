// frontend/src/data/apiConfig.js

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://beleggingsvergelijker.onrender.com/api' 
  : 'http://localhost:8000/api';

export default API_URL;