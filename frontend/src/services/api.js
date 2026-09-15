import axios from 'axios';
import {
  runDeterministicAppraisal,
  runMultiBusinessComparison,
  generateLocalChatReply,
  BUSINESS_DATA,
} from './engine';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

const isHttpsClient = typeof window !== 'undefined' && window.location.protocol === 'https:';
const isLocalBackend = API_BASE.includes('localhost') || API_BASE.includes('127.0.0.1');

export const analyzeBusinessFull = async (data) => {
  // If we are on HTTPS and backend is insecure HTTP localhost, browser will block mixed content
  if (!isHttpsClient || !isLocalBackend) {
    try {
      const res = await api.post('/api/analyze', data);
      if (res.data && res.data.success) {
        return res;
      }
    } catch (e) {
      console.warn('Backend API request bypassed, activating client appraisal engine:', e.message);
    }
  }

  // Resilient deterministic client-side engine (100% reliable for live web & mobile)
  const result = runDeterministicAppraisal(data);
  return { data: result };
};

export const calculateFinancial = async (data) => {
  if (!isHttpsClient || !isLocalBackend) {
    try {
      const res = await api.post('/api/financial/calculate', data);
      if (res.data && res.data.success) return res;
    } catch (e) {
      // Fallback
    }
  }
  const app = runDeterministicAppraisal({ capital: data.capital, business: 'dairy' });
  return { data: { success: true, ...app.financial, data: app.financial } };
};

export const analyzeBusiness = async (data) => {
  if (!isHttpsClient || !isLocalBackend) {
    try {
      const res = await api.post('/api/business/analyze', data);
      if (res.data && res.data.success) return res;
    } catch (e) {
      // Fallback
    }
  }
  const app = runDeterministicAppraisal({ business: data.business, capital: 100000 });
  return { data: { success: true, data: app.business_analysis } };
};

export const compareBusiness = async (data) => {
  if (!isHttpsClient || !isLocalBackend) {
    try {
      const res = await api.post('/api/comparison', data);
      if (res.data && res.data.success) return res;
    } catch (e) {
      console.warn('Backend comparison bypassed, using client comparison engine:', e.message);
    }
  }
  const result = runMultiBusinessComparison(data);
  return { data: result };
};

export const chatWithAssistant = async (data) => {
  if (!isHttpsClient || !isLocalBackend) {
    try {
      const res = await api.post('/api/chat', data);
      if (res.data && res.data.success) return res;
    } catch (e) {
      // Fallback to local advisory logic
    }
  }
  const reply = generateLocalChatReply(data.message, data.context, data.language);
  return { data: { success: true, reply } };
};

export const getReport = (id) => `${API_BASE}/api/report/${id}`;

export const getLocations = async () => {
  if (!isHttpsClient || !isLocalBackend) {
    try {
      const res = await api.get('/api/locations');
      if (res.data && res.data.states) return res;
    } catch (e) {
      // Use fallback
    }
  }
  return {
    data: {
      success: true,
      states: [
        {
          name: 'Maharashtra',
          name_hi: 'महाराष्ट्र',
          districts: [
            {
              name: 'Dhule',
              name_hi: 'धुळे',
              blocks: [
                {
                  name: 'Shirpur',
                  name_hi: 'शिरपूर',
                  villages: [
                    { name: 'Demo Village', name_hi: 'डेमो गांव' },
                    { name: 'Shirpur Rural', name_hi: 'शिरपूर ग्रामीण' },
                    { name: 'Holnanthe', name_hi: 'होलनांथे' },
                    { name: 'Thalner', name_hi: 'थालनेर' },
                    { name: 'Vikhran', name_hi: 'विखरन' },
                  ],
                },
              ],
            },
            {
              name: 'Nashik',
              name_hi: 'नाशिक',
              blocks: [
                {
                  name: 'Dindori',
                  name_hi: 'दिंडोरी',
                  villages: [
                    { name: 'Dindori Rural', name_hi: 'दिंडोरी ग्रामीण' },
                    { name: 'Janori', name_hi: 'जानोरी' },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'Uttar Pradesh',
          name_hi: 'उत्तर प्रदेश',
          districts: [
            {
              name: 'Varanasi',
              name_hi: 'वाराणसी',
              blocks: [
                {
                  name: 'Kashi Rural',
                  name_hi: 'काशी ग्रामीण',
                  villages: [
                    { name: 'Shivpur Gram', name_hi: 'शिवपुर ग्राम' },
                    { name: 'Lohta Gram', name_hi: 'लोहता ग्राम' },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'Madhya Pradesh',
          name_hi: 'मध्य प्रदेश',
          districts: [
            {
              name: 'Indore',
              name_hi: 'इंदौर',
              blocks: [
                {
                  name: 'Sanwer',
                  name_hi: 'सांवेर',
                  villages: [{ name: 'Sanwer Gram', name_hi: 'सांवेर ग्राम' }],
                },
              ],
            },
          ],
        },
      ],
    },
  };
};

export const getCategories = async () => {
  return {
    data: {
      success: true,
      categories: BUSINESS_DATA,
    },
  };
};

export const healthCheck = () => api.get('/api/health');
export const submitSurvey = (data) => api.post('/api/vendor-survey', data);
export const getSurveys = () => api.get('/api/vendor-surveys');

export default api;
