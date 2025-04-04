import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// API service endpoints
export default {
  // Authentication
  login: (credentials) => api.post('/login', credentials),
  
  // Dashboard data
  getDashboardData: () => api.get('/dashboard'),
  
  // Utility data
  submitUtilityData: (data) => api.post('/submit-data', data),
  
  // Map and client data
  getMapData: () => api.get('/map-data'),
  getClient: (id) => api.get(`/clients/${id}`),
  
  // Raw API instance for custom calls
  api,
}; 