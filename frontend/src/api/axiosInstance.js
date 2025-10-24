    import axios from 'axios';
    import { logout } from '../redux/authSlice'; // Ensure this path is correct

    let store;

    // This function allows the interceptor to dispatch actions
    export const injectStore = (_store) => {
      store = _store;
    };

    // Use the VITE_API_BASE_URL from Vercel environment variables for production builds.
    // Fall back to '/api' for local development (which uses the Vite proxy).
    const axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    });

    // Request interceptor to add the auth token from localStorage
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

    // Response interceptor to handle 401 Unauthorized errors by logging out
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Only logout on 401 errors (invalid/expired token)
          if (store) {
            store.dispatch(logout());
          }
        }
        // Let other errors (like 404, 403, 500) be handled by the calling code
        return Promise.reject(error);
      }
    );

    export default axiosInstance;
    
