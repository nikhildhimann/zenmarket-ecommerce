import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App.jsx';
import { ThemeProvider, CssBaseline } from '@mui/material'; // 1. Import
import theme from './theme'; // 2. Import your new theme
import './index.css';
import { injectStore } from './api/axiosInstance';
import { CustomThemeProvider } from './context/ThemeContext';
import { SpeedInsights } from "@vercel/speed-insights/react"
import axios from 'axios';
import { logout } from './redux/authSlice';


injectStore(store);

// Ensure any direct `axios` imports use the deployed backend in production.
// Set this once at app entry so pages that import `axios` (not axiosInstance)
// will still call the correct backend URL.
const resolvedApiBase = import.meta.env.VITE_API_BASE_URL || '/api';
axios.defaults.baseURL = resolvedApiBase;
// helpful debug when inspecting deployed app console
console.info('[App] axios baseURL =', resolvedApiBase);

// Attach token from localStorage for any requests using global axios
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor to handle 401 and force logout when needed
axios.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}> {/* 3. Wrap App in ThemeProvider */}
        <CssBaseline /> {/* 4. Add CssBaseline for consistency */}
         <CustomThemeProvider>
        <App />
      </CustomThemeProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);