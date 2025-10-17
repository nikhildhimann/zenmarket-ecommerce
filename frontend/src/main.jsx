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


injectStore(store);

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