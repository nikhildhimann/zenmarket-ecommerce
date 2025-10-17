import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box, Button, CircularProgress, TextField, Typography, Snackbar, Alert, Grid, Paper, Link as MuiLink,
    FormControlLabel, Checkbox
} from "@mui/material";
import { keyframes } from '@mui/system';
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../../redux/authSlice";
import { useNavigate, Link as RouterLink } from "react-router-dom";

// --- Import Icons ---
import StorefrontIcon from '@mui/icons-material/Storefront';

// Animated gradient background keyframes
const gradientAnimation = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token && user?.role !== 'admin') {
            navigate('/');
        }
    }, [token, user, navigate]);

    const [formData, setFormData] = useState({ email: "", password: "" });
    
    // --- Re-added state for Forgot Password ---
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotMsg, setForgotMsg] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const res = await axios.post("/api/auth/login", formData);
            const userData = res.data;
            if (userData.role === 'admin') {
                dispatch(loginFailure("Invalid credentials."));
                return;
            }
            dispatch(loginSuccess({ user: userData, token: userData.token }));
            navigate("/");
        } catch (err) {
            dispatch(loginFailure(err.response?.data?.message || "Login failed. Please try again."));
        }
    };

    // --- Re-added handler for Forgot Password ---
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setForgotMsg("");
        dispatch(loginStart()); // Reuse loading state
        try {
            await axios.post("/api/auth/requestPasswordReset", { email: forgotEmail });
            setForgotMsg("If an account with that email exists, a password reset link has been sent.");
            setForgotEmail("");
            setShowForgot(false); // Hide the form after submission
        } catch (err) {
            dispatch(loginFailure(err.response?.data?.message || "Failed to send reset link."));
        }
    };


    return (
        <Grid container component="main" sx={{ height: '83vh' }}>
            {/* Background Layer - Spans the full screen */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(45deg, #0057FF, #111111, #1C1C1E)`,
                    backgroundSize: '400% 400%',
                    animation: `${gradientAnimation} 15s ease infinite`,
                    zIndex: -1,
                }}
            />

            {/* Left Side: Branding */}
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    display: { xs: 'none', sm: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    p: 4,
                }}
            >
                <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
                    Welcome Back
                </Typography>
                <Typography variant="h6" sx={{ textAlign: 'center', maxWidth: 400, opacity: 0.8 }}>
                    Sign in to continue to your personalized shopping experience.
                </Typography>
            </Grid>

            {/* Right Side: Login Form */}
            <Grid item xs={12} sm={8} md={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <Paper
                    elevation={12}
                    sx={{
                        my: 8,
                        mx: { xs: 1, sm: 4 },
                        p: { xs: 3, md: 4 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: 450,
                        borderRadius: 4,
                        // --- Glassmorphism Effect ---
                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(28, 28, 30, 0.7)' : 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <StorefrontIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }}/>
                    <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Sign In
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Welcome back to ZenMarket
                    </Typography>

                    <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                             <MuiLink href="#" variant="body2" onClick={(e) => { e.preventDefault(); setShowForgot(true); }}>
                                Forgot password?
                            </MuiLink>
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem', fontWeight: 600 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                        </Button>
                        
                        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                        
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
                           Don't have an account?{' '}
                            <MuiLink component={RouterLink} to="/register" variant="body2" sx={{ fontWeight: 600 }}>
                                Sign up
                            </MuiLink>
                        </Typography>
                    </Box>

                    {/* --- Re-added Forgot Password Form --- */}
                    {showForgot && (
                        <Box component="form" onSubmit={handleForgotPassword} sx={{ mt: 2, width: '100%' }}>
                            <Typography variant="body1" sx={{ mb: 1, textAlign: 'center' }}>
                                Enter your email to receive a reset link.
                            </Typography>
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                required
                                sx={{ mb: 2 }}
                            />
                            <Button fullWidth variant="outlined" type="submit" disabled={loading}>
                                {loading ? <CircularProgress size={24}/> : "Send Reset Link"}
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Grid>

            {/* Snackbar for forgot password message */}
            <Snackbar open={!!forgotMsg} autoHideDuration={6000} onClose={() => setForgotMsg("")}>
                <Alert severity="info" sx={{ width: "100%" }} onClose={() => setForgotMsg("")}>
                    {forgotMsg}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default LoginPage;

