import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // If an admin is already logged in, redirect to the dashboard
    if (token && user?.role === 'admin') {
      navigate('/admin/products');
    }
  }, [token, user, navigate]);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      // Use the new admin login endpoint
      const res = await axios.post("/api/admin/auth/login", formData);
      const userData = res.data;
      dispatch(loginSuccess({ user: userData, token: userData.token }));
      navigate("/admin/products"); // Go straight to dashboard
    } catch (err) {
      dispatch(
        loginFailure(err.response?.data?.message || "Admin login failed.")
      );
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Admin Portal
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField fullWidth label="Admin Email" type="email" name="email" value={formData.email} onChange={handleChange} required sx={{ mb: 2 }} />
        <TextField fullWidth label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required sx={{ mb: 2 }} />
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ height: 48 }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login as Admin"}
        </Button>
      </form>
    </Box>
  );
};

export default AdminLoginPage;