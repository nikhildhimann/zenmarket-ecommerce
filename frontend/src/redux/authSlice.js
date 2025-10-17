import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      // Save token to localStorage on successful login
      localStorage.setItem('userToken', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      // Clear token from localStorage on logout
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
    },
    // New reducer to initialize state from localStorage on app load
    initializeAuth: (state) => {
      const storedToken = localStorage.getItem('userToken');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        state.user = JSON.parse(storedUser);
        state.token = storedToken;
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;