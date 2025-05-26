import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// API service functions
export const apiService = {
  // Alle tabellen opvragen
  getAvailableTables: async () => {
    const response = await api.get('/api/tables/');
    return response.data;
  },

  // Specifieke tabel data
  getTableData: async (tableName, params = {}) => {
    const response = await api.get(`/api/tables/${tableName}`, { params });
    return response.data;
  },

  // Aanbieders (oude endpoint)
  getAanbieders: async () => {
    const response = await api.get('/api/banks/');
    return response.data;
  },

  // Specifieke aanbieder
  getAanbieder: async (id) => {
    const response = await api.get(`/api/banks/${id}`);
    return response.data;
  }
};

export default apiService;