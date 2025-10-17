import axios from 'axios';
import { logout } from '../redux/authSlice';

let store;

export const injectStore = (_store) => {
  store = _store;
};

// ✨ FIX: This is the crucial change for deployment.
// It tells your frontend to use the live API URL you set in Vercel.
// If that variable doesn't exist (like in local development), it defaults to the proxy path.
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

// Interceptor to add the token to every outgoing request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to catch 401 errors on responses and logout the user
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (store) {
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;