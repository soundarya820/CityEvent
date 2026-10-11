import axios from 'axios';

// API Base Configuration with safe environment variable check for both Vite and Node environments
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) 
  ? import.meta.env.VITE_API_BASE_URL 
  : 'http://localhost:5000/api';

// Create Axios Instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor to attach JWT token from localStorage automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cityevent_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to catch 401/403 and handle token expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('cityevent_token');
      localStorage.removeItem('cityevent_user');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Toggle flag to switch between mock implementation and live backend API
export const USE_MOCK_DATA = true;
