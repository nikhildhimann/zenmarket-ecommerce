import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box, Typography, Paper, CircularProgress, Alert, Grid, Avatar, List, ListItem,
    ListItemButton, ListItemIcon, ListItemText, Divider, Button, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, Snackbar
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

// --- Import Icons ---
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';

// A small component for displaying each detail item, making the code cleaner
const ProfileDetailItem = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>{icon}</ListItemIcon>
        <Box>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{value}</Typography>
        </Box>
    </Box>
);

const ProfilePage = () => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- State for Edit Dialog ---
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({ firstName: '', lastName: '', phoneNumber: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        const fetchProfile = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('/api/auth/user/dashboard', config);
                setProfileData(data.user);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch profile data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token, navigate]);

    // --- Handlers for Edit Dialog ---
    const handleEditOpen = () => {
        if (profileData) {
            setEditData({
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                phoneNumber: profileData.phoneNumber,
            });
            setEditOpen(true);
        }
    };

    const handleEditClose = () => setEditOpen(false);
    const handleEditChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

    const handleUpdateProfile = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.put('/api/auth/user/dashboard', editData, config);
            setProfileData(data.user); // Update the main profile data
            setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.message || 'Update failed.', severity: 'error' });
        } finally {
            handleEditClose();
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Box sx={{ p: 4 }}><Alert severity="error">{error}</Alert></Box>;
    }

    return (
        <Box sx={{ 
            p: { xs: 2, md: 4 }, 
            minHeight: 'calc(100vh - 64px)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}>
            <Grid container spacing={4}>
                {/* Left Column: Navigation & Avatar */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Avatar sx={{ width: 120, height: 120, margin: '0 auto 16px', bgcolor: 'primary.main', fontSize: '3rem' }}>
                            {profileData?.firstName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="h5" gutterBottom>
                            {profileData?.firstName} {profileData?.lastName}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                            {profileData?.username}
                        </Typography>
                        <Button variant="outlined" startIcon={<EditIcon />} sx={{ mt: 2, borderRadius: '20px' }} onClick={handleEditOpen}>
                            Edit Profile
                        </Button>
                    </Paper>
                    <Paper sx={{ mt: 3 }}>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton component={RouterLink} to="/my-orders">
                                    <ListItemIcon><ShoppingBagIcon /></ListItemIcon>
                                    <ListItemText primary="My Orders" />
                                </ListItemButton>
                            </ListItem>
                             <ListItem disablePadding>
                                <ListItemButton component={RouterLink} to="/wishlist">
                                    <ListItemIcon><FavoriteIcon /></ListItemIcon>
                                    <ListItemText primary="Wishlist" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon><HomeIcon /></ListItemIcon>
                                    <ListItemText primary="Manage Addresses" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>

                {/* Right Column: User Details */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h6" gutterBottom>Personal Information</Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <ProfileDetailItem icon={<PersonIcon />} label="First Name" value={profileData?.firstName} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <ProfileDetailItem icon={<PersonIcon />} label="Last Name" value={profileData?.lastName} />
                            </Grid>
                        </Grid>
                    </Paper>

                     <Paper sx={{ p: 4, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>Contact Details</Typography>
                        <Divider sx={{ mb: 3 }} />
                         <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <ProfileDetailItem icon={<EmailIcon />} label="Email Address" value={profileData?.email} />
                            </Grid>
                             <Grid item xs={12} sm={6}>
                                <ProfileDetailItem icon={<PhoneIcon />} label="Phone Number" value={profileData?.phoneNumber} />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Edit Profile Dialog */}
            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle>Edit Your Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="firstName"
                        label="First Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editData.firstName}
                        onChange={handleEditChange}
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        margin="dense"
                        name="lastName"
                        label="Last Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editData.lastName}
                        onChange={handleEditChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="phoneNumber"
                        label="Phone Number"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editData.phoneNumber}
                        onChange={handleEditChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={profileData?.email || ''}
                        disabled // Email is not editable
                        helperText="Email address cannot be changed."
                    />
                </DialogContent>
                <DialogActions sx={{ p: '0 24px 16px' }}>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdateProfile}>Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProfilePage;

