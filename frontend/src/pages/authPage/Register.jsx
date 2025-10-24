import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box, Button, CircularProgress, TextField, Typography, Snackbar, Alert, Grid, Paper, Link as MuiLink,
    FormControlLabel, Checkbox, InputAdornment, IconButton
} from "@mui/material";
import { keyframes, styled } from '@mui/system';
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { PhoneInput } from "react-international-phone"; // Make sure this is installed
import "react-international-phone/style.css";

// --- Import Icons ---
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import BadgeIcon from '@mui/icons-material/Badge';
import StorefrontIcon from '@mui/icons-material/Storefront';

// Animated gradient background keyframes
const gradientAnimation = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

// ✨ Refined Styled component for PhoneInput
const StyledPhoneInput = styled(Box)(({ theme, error }) => ({
    width: '100%',
    '& .react-international-phone-input-container': {
        position: 'relative', // Needed for absolute positioning of potential error icons/text if added later
        '& .react-international-phone-input': {
            // Core input styles matching TextField variant="outlined"
            width: '100%',
            height: '56px', // Standard MUI TextField height
            boxSizing: 'border-box',
            padding: '16.5px 14px',
            fontSize: '1rem',
            fontFamily: theme.typography.fontFamily,
            color: theme.palette.text.primary,
            backgroundColor: 'transparent',
            borderRadius: theme.shape.borderRadius, // Use theme's border radius
            border: `1px solid ${error ? theme.palette.error.main : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'}`, // Match TextField border
            transition: theme.transitions.create(['border-color', 'box-shadow']),
            '&:hover': {
                borderColor: !error ? theme.palette.text.primary : theme.palette.error.main,
            },
            '&:focus, &:focus-within': { // Apply focus styles more broadly
                outline: 'none',
                borderWidth: '1px', // Keep border width consistent
                borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
                 // Mimic TextField focus ring
                // boxShadow: `0 0 0 1px ${error ? theme.palette.error.main : theme.palette.primary.main}`,
            },
        },
        // Style the country selector dropdown button
        '& .react-international-phone-country-selector': {
             borderRight: `1px solid ${theme.palette.divider}`, // Separator line
             marginRight: '8px', // Space between flag and input
        },
        '& .react-international-phone-country-selector-button': {
             padding: '0 8px', // Adjust padding
             backgroundColor: 'transparent !important',
             '&:hover': {
                 backgroundColor: theme.palette.action.hover + ' !important',
             },
        },
        // Style the flag emoji/icon if needed (optional)
        '& .react-international-phone-country-selector-flag-emoji': {
             fontSize: '1.5em', // Adjust flag size if necessary
             marginRight: '4px'
        }
    },
}));


const Register = () => {
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token) navigate("/");
    }, [token, navigate]);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", severity: "" });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
        if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
        else if (!/^\+?\d{10,}$/.test(formData.phoneNumber.replace(/\s/g, ''))) newErrors.phoneNumber = "Invalid phone number format";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (value) => {
        setFormData({ ...formData, phoneNumber: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            try {
                const { confirmPassword, ...submissionData } = formData;
                await axios.post("/api/auth/signup", submissionData);
                setMessage({ text: "Registration successful! Redirecting to login...", severity: "success" });
                setTimeout(() => navigate("/login"), 2000);
            } catch (err) {
                setMessage({ text: err.response?.data?.message || "Registration failed.", severity: "error" });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                background: `linear-gradient(45deg, #0057FF, #111111, #1C1C1E)`,
                backgroundSize: '400% 400%',
                animation: `${gradientAnimation} 15s ease infinite`,
            }}
        >
            <Paper
                elevation={12}
                sx={{
                    p: { xs: 3, md: 5 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: 600,
                    borderRadius: 4,
                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(28, 28, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)', // Slightly increased opacity
                    backdropFilter: 'blur(15px)', // Increased blur
                    border: '1px solid rgba(255, 255, 255, 0.15)', // Slightly more visible border
                }}
            >
                <StorefrontIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }}/>
                <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Create Your Account
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}> {/* Increased bottom margin */}
                    Join thousands of happy customers and start shopping today
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <Grid container spacing={2.5}> {/* Adjusted spacing */}
                        <Grid item xs={12} sm={6}>
                            <TextField name="firstName" required fullWidth label="First Name" onChange={handleChange} error={!!errors.firstName} helperText={errors.firstName} InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon /></InputAdornment>), }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="lastName" required fullWidth label="Last Name" onChange={handleChange} error={!!errors.lastName} helperText={errors.lastName} InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon /></InputAdornment>), }} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField name="username" required fullWidth label="Username" onChange={handleChange} error={!!errors.username} helperText={errors.username} InputProps={{ startAdornment: (<InputAdornment position="start"><BadgeIcon /></InputAdornment>), }} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField name="email" required fullWidth label="Email" type="email" onChange={handleChange} error={!!errors.email} helperText={errors.email} InputProps={{ startAdornment: (<InputAdornment position="start"><MailOutlineIcon /></InputAdornment>), }} />
                        </Grid>
                        <Grid item xs={12}>
                            <StyledPhoneInput error={!!errors.phoneNumber}>
                                <PhoneInput
                                    defaultCountry="in"
                                    value={formData.phoneNumber}
                                    onChange={handlePhoneChange}
                                />
                            </StyledPhoneInput>
                            {errors.phoneNumber && <Typography color="error" variant="caption" sx={{ pl: '14px', mt: '3px' }}>{errors.phoneNumber}</Typography>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="password" required fullWidth label="Password" type={showPassword ? "text" : "password"} onChange={handleChange} error={!!errors.password} helperText={errors.password} InputProps={{ startAdornment: (<InputAdornment position="start"><LockOutlinedIcon /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
                        </Grid>
                         <Grid item xs={12} sm={6}>
                            <TextField name="confirmPassword" required fullWidth label="Confirm Password" type="password" onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} InputProps={{ startAdornment: (<InputAdornment position="start"><LockOutlinedIcon /></InputAdornment>), }} />
                        </Grid>
                    </Grid>
                    <FormControlLabel control={<Checkbox color="primary" required />} label={<Typography variant="body2">I agree to the <MuiLink href="#">Terms of Service</MuiLink> and <MuiLink href="#">Privacy Policy</MuiLink></Typography>} sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'center' }} />
                    <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 2, mb: 2, py: 1.5, fontSize: '1rem', fontWeight: 600 }}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
                    </Button>
                    <Typography variant="body2" color="text.secondary" align="center">
                       Already have an account?{' '}
                        <MuiLink component={RouterLink} to="/login" variant="body2" sx={{ fontWeight: 600 }}>
                            Sign in
                        </MuiLink>
                    </Typography>
                </Box>
            </Paper>

            <Snackbar open={!!message.text} autoHideDuration={6000} onClose={() => setMessage({ text: "", severity: "" })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setMessage({ text: "", severity: "" })} severity={message.severity} sx={{ width: '100%' }}>{message.text}</Alert>
            </Snackbar>
        </Box>
    );
};

export default Register;

