import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

export const analyzeBusinessFull = (data) => api.post('/api/analyze', data);
export const calculateFinancial = (data) => api.post('/api/financial/calculate', data);
export const analyzeBusiness = (data) => api.post('/api/business/analyze', data);
export const compareBusiness = (data) => api.post('/api/comparison', data);
export const chatWithAssistant = (data) => api.post('/api/chat', data);
export const getReport = (id) => `${API_BASE}/api/report/${id}`;
export const getLocations = () => api.get('/api/locations');
export const getCategories = () => api.get('/api/categories');
export const healthCheck = () => api.get('/api/health');

export default api;
