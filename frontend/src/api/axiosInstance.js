import axios from 'axios';
import { logout } from '../redux/authSlice';

let store;

// This function is still needed for the response interceptor to dispatch logout
export const injectStore = (_store) => {
  store = _store;
};

const axiosInstance = axios.create({
  baseURL: '/api', // Your API base URL from vite.config.js
});

// This request interceptor is correct and reads the token from localStorage.
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

// ✨ FIX: Updated Response Interceptor
// This interceptor is now more specific. It only logs the user out on a 401 error,
// which indicates an invalid or expired token. Other errors (like 403) will be
// handled by the component that made the API call.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is specifically a 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      // Dispatch the logout action to clear the user's session
      // This is the correct action for an invalid token.
      if (store) {
        store.dispatch(logout());
      }
    }
    // For all other errors (including 403), let the promise reject
    // so the calling function can handle it with a .catch() block.
    return Promise.reject(error);
  }
);

export default axiosInstance;

