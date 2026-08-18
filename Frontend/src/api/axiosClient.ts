import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Get base URL from environment or fallback
const API_BASE_URL = 'http://10.0.2.2:5286';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Get token from Zustand store
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Flag to prevent multiple logout calls
let isLoggingOut = false;

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!isLoggingOut) {
        isLoggingOut = true;
        // Automatically log out if unauthorized
        useAuthStore.getState().logout().finally(() => {
          isLoggingOut = false;
        });
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
