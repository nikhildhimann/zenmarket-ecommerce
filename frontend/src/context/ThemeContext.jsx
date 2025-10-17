import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Function to create a theme based on the mode
const getTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'dark' ? {
      // --- DARK MODE PALETTE ---
      primary: { main: '#0057FF' },
      background: { default: '#111111', paper: '#1C1C1E' },
      text: { primary: '#FFFFFF', secondary: '#EBEBF599' },
    } : {
      // --- LIGHT MODE PALETTE ---
      primary: { main: '#0057FF' },
      background: { default: '#F4F6F8', paper: '#FFFFFF' },
      text: { primary: '#212B36', secondary: '#637381' }, // Correct dark text for light bg
    }),
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: { fontWeight: 700 }, h2: { fontWeight: 700 }, h3: { fontWeight: 600 },
    h4: { fontWeight: 600 }, h5: { fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
      },
    },
    MuiPaper: { styleOverrides: { root: { borderRadius: 12, boxShadow: 'none' } } },
    MuiAppBar: {
      styleOverrides: {
        // Use a callback to access the dynamic theme object
        root: ({ theme }) => ({
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
          // ✨ FIX: Explicitly set the text color of the AppBar's content.
          // This ensures that when the background is light, the text becomes dark, and vice versa.
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiTableHead: {
        styleOverrides: {
            root: {
                backgroundColor: 'action.hover', // Subtle background for table headers
            }
        }
    }
  },
});

const ThemeContext = createContext({
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'dark');

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const colorMode = useMemo(() => ({
    toggleTheme: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    },
  }), []);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

