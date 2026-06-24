// src/services/axios.config.js
import axios from 'axios';
import { API_BASE_URL } from '@utils/constants';

// ✅ Auth axios instance — 
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor —
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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('ra_token');

      if (token) {
  localStorage.removeItem('ra_token');
  localStorage.removeItem('ra_user');
  localStorage.removeItem('ra_last_activity'); 
  window.location.href = '/';
}
   
    }
    return Promise.reject(error);
  }
);


export const publicAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;