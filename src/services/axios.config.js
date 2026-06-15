// src/services/axios.config.js
import axios from 'axios';
import { API_BASE_URL } from '@utils/constants';

// ✅ Auth axios instance — token attach hoto (protected routes sathi)
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — token asel tar attach kar
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ra_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — FIXED: sirf token asel ani 401 aala tar redirect kar
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('ra_token');
      // ✅ Token hota pan expire zala → logout + redirect
      if (token) {
        localStorage.removeItem('ra_token');
        localStorage.removeItem('ra_user');
        window.location.href = '/';
      }
      // ✅ Token navhta (guest) → redirect nako, faqt error return kar
    }
    return Promise.reject(error);
  }
);

// ✅ Public axios instance — no auth header (guest public routes sathi)
export const publicAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;