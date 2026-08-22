import axios from 'axios';
import { storage } from '../utils/storage';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors and token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 401 Unauthorized globally
      if (error.response.status === 401) {
        storage.clearToken();
        toast.error('Session expired. Please log in again.');
        // Redirecting directly via window to avoid React Router context issues in pure JS files
        window.location.href = '/auth/login';
      } else if (error.response.status === 500) {
        toast.error('Server error. Please try again later.');
      }
    } else {
      toast.error('Network Error. Please check your internet connection.');
    }
    return Promise.reject(error);
  }
);
