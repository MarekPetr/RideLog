import axios from 'axios';

const USE_PROXY = process.env.NEXT_PUBLIC_USE_PROXY === 'true';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// If using proxy, point to Next.js API route, otherwise use direct backend URL
const BASE_URL = USE_PROXY ? '/api/proxy' : API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
