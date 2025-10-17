import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, Typography, Button, Paper, Grid, TextField, CircularProgress,
    Radio, FormControlLabel, IconButton, Dialog, DialogActions, Chip,
    DialogContent, DialogContentText, DialogTitle, Snackbar, Alert, styled, Divider, Container
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import axios from 'axios';
import { fetchCart, applyCoupon, removeCoupon } from '../../redux/cartSlice';

const StyledPhoneInput = styled(Box)(({ theme, error }) => ({
    '& .react-international-phone-input-container': {
        '& .react-international-phone-input': {
            width: '100%',
            boxSizing: 'border-box',
            padding: '16.5px 14px',
            fontSize: '1rem',
            fontFamily: theme.typography.fontFamily,
            color: theme.palette.text.primary,
            backgroundColor: 'transparent',
            border: `1px solid ${error ? theme.palette.error.main : theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius,
            transition: 'border-color 0.3s ease',
            '&:hover': {
                borderColor: !error ? theme.palette.text.primary : theme.palette.error.main,
            },
            '&:focus': {
                outline: 'none',
                borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
            },
        },
    },
}));

const CheckoutPage = () => {
    const { items: cartItems = [], coupon = null, loading: cartLoading, error: cartError } = useSelector((state) => state.cart || {});
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', postalCode: '', country: '', phoneNo: '' });
    const [formErrors, setFormErrors] = useState({});
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [couponCode, setCouponCode] = useState('');

    useEffect(() => {
        if (token) {
            dispatch(fetchCart());
        }
    }, [dispatch, token]);

    useEffect(() => {
        if (cartError) {
            setSnackbar({ open: true, message: cartError, severity: 'error' });
        }
    }, [cartError]);

    useEffect(() => {
        const fetchAddresses = async () => {
            if (!token) return;
            try {
                const { data } = await axios.get('/api/v1/address', { headers: { Authorization: `Bearer ${token}` } });
                setAddresses(data.addresses);
                if (data.addresses.length > 0) {
                    setSelectedAddress(data.addresses[0]._id);
                } else {
                    setShowNewAddressForm(true);
                }
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to load addresses.', severity: 'error' });
            } finally {
                setLoadingAddresses(false);
            }
        };
        fetchAddresses();
    }, [token]);

    const { subtotal, discount, grandTotal } = useMemo(() => {
        const sub = cartItems.reduce((acc, item) => item && item.product ? acc + (item.product.price * item.quantity) : acc, 0);
        let disc = 0;
        if (coupon && sub > 0) {
            disc = coupon.discountType === 'percentage' ? (sub * coupon.discountAmount) / 100 : coupon.discountAmount;
        }
        const total = Math.max(0, sub - disc);
        return { subtotal: sub, discount: disc, grandTotal: total };
    }, [cartItems, coupon]);

    // --- Enhanced Address Validation ---
    const validateAddress = () => {
        const errors = {};
        const textOnlyRegex = /^[a-zA-Z\s-]*$/;
        const postalCodeRegex = /^\d{5,6}$/;
        const phoneRegex = /^\+?\d{10,15}$/;

        if (!newAddress.street.trim()) errors.street = "Street address is required";
        if (!newAddress.city.trim()) errors.city = "City is required";
        else if (!textOnlyRegex.test(newAddress.city)) errors.city = "City can only contain letters, spaces, and hyphens.";
        if (!newAddress.state.trim()) errors.state = "State is required";
        else if (!textOnlyRegex.test(newAddress.state)) errors.state = "State can only contain letters, spaces, and hyphens.";
        if (!newAddress.postalCode.trim()) errors.postalCode = "Postal code is required";
        else if (!postalCodeRegex.test(newAddress.postalCode)) errors.postalCode = "Please enter a valid 5 or 6 digit postal code.";
        if (!newAddress.country.trim()) errors.country = "Country is required";
        else if (!textOnlyRegex.test(newAddress.country)) errors.country = "Country can only contain letters, spaces, and hyphens.";
        if (!newAddress.phoneNo) errors.phoneNo = "Phone number is required";
        else if (!phoneRegex.test(newAddress.phoneNo)) errors.phoneNo = "Please enter a valid phone number (e.g., +911234567890).";
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    const handleAddressChange = (e) => setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    const handlePhoneChange = (value) => setNewAddress({ ...newAddress, phoneNo: value });

    const handleAddNewAddress = async (e) => {
        e.preventDefault();
        if (!validateAddress()) return;
        try {
            const { data } = await axios.post('/api/v1/address', newAddress, { headers: { Authorization: `Bearer ${token}` } });
            setAddresses([...addresses, data.address]);
            setSelectedAddress(data.address._id);
            setShowNewAddressForm(false);
            setNewAddress({ street: '', city: '', state: '', postalCode: '', country: '', phoneNo: '' });
            setFormErrors({});
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to add address.', severity: 'error' });
        }
    };
    
    const handleProceedToPayment = async () => {
        setIsProcessingPayment(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post('/api/v1/payment/payu', { shippingAddressId: selectedAddress }, config);
            const { paymentData } = data;
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://test.payu.in/_payment';
            for (const key in paymentData) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = paymentData[key];
                form.appendChild(input);
            }
            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to initiate payment.', severity: 'error' });
            setIsProcessingPayment(false);
        }
    };

    const handleDeleteClick = (id) => setDeleteConfirm({ open: true, id });
    const handleDeleteClose = () => setDeleteConfirm({ open: false, id: null });

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`/api/v1/address/${deleteConfirm.id}`, { headers: { Authorization: `Bearer ${token}` } });
            const updatedAddresses = addresses.filter(addr => addr._id !== deleteConfirm.id);
            setAddresses(updatedAddresses);
            setSnackbar({ open: true, message: 'Address deleted successfully!', severity: 'success' });
            if (selectedAddress === deleteConfirm.id) {
                setSelectedAddress(updatedAddresses.length > 0 ? updatedAddresses[0]._id : '');
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to delete address.', severity: 'error' });
        } finally {
            handleDeleteClose();
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        const resultAction = await dispatch(applyCoupon(couponCode));
        if (applyCoupon.fulfilled.match(resultAction)) {
            setSnackbar({ open: true, message: 'Coupon applied successfully!', severity: 'success' });
        } else {
            setSnackbar({ open: true, message: resultAction.payload || 'Invalid coupon.', severity: 'error' });
        }
    };

    const handleRemoveCoupon = async () => {
        const resultAction = await dispatch(removeCoupon());
        if(removeCoupon.fulfilled.match(resultAction)) {
            setSnackbar({ open: true, message: 'Coupon removed.', severity: 'info' });
        } else {
            setSnackbar({ open: true, message: 'Failed to remove coupon.', severity: 'error' });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                Checkout
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Shipping Address</Typography>
                    {loadingAddresses ? <CircularProgress /> : (
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                            {addresses.map(address => (
                                <Box key={address._id} sx={{ display: 'flex', alignItems: 'center', mb: 2, borderBottom: '1px solid', borderColor: 'divider', pb: 2, '&:last-child': { mb: 0, pb: 0, borderBottom: 0 } }}>
                                    <FormControlLabel
                                        value={address._id}
                                        control={<Radio checked={selectedAddress === address._id} onChange={(e) => setSelectedAddress(e.target.value)} />}
                                        label={
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{`${address.street}, ${address.city}`}</Typography>
                                                <Typography variant="body2" color="text.secondary">{`${address.state}, ${address.postalCode}, ${address.country}`}</Typography>
                                                <Typography variant="body2" color="text.secondary">{`Phone: ${address.phoneNo}`}</Typography>
                                            </Box>
                                        }
                                        sx={{ flexGrow: 1 }}
                                    />
                                    <IconButton color="error" size="small" onClick={() => handleDeleteClick(address._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button onClick={() => setShowNewAddressForm(!showNewAddressForm)} sx={{ mt: 2 }}>
                                {showNewAddressForm ? 'Cancel' : '+ Add New Address'}
                            </Button>
                            {showNewAddressForm && (
                                <Box component="form" onSubmit={handleAddNewAddress} sx={{ mt: 3 }}>
                                    <Typography variant="h6" gutterBottom>New Address Details</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}><TextField name="street" fullWidth label="Street Address" value={newAddress.street} onChange={handleAddressChange} required error={!!formErrors.street} helperText={formErrors.street} /></Grid>
                                        <Grid item xs={12} sm={6}><TextField name="city" fullWidth label="City" value={newAddress.city} onChange={handleAddressChange} required error={!!formErrors.city} helperText={formErrors.city} /></Grid>
                                        <Grid item xs={12} sm={6}><TextField name="state" fullWidth label="State" value={newAddress.state} onChange={handleAddressChange} required error={!!formErrors.state} helperText={formErrors.state} /></Grid>
                                        <Grid item xs={12} sm={6}><TextField name="postalCode" fullWidth label="Postal Code" value={newAddress.postalCode} onChange={handleAddressChange} required error={!!formErrors.postalCode} helperText={formErrors.postalCode} /></Grid>
                                        <Grid item xs={12} sm={6}><TextField name="country" fullWidth label="Country" value={newAddress.country} onChange={handleAddressChange} required error={!!formErrors.country} helperText={formErrors.country} /></Grid>
                                        <Grid item xs={12}>
                                            <StyledPhoneInput error={!!formErrors.phoneNo}>
                                                <PhoneInput defaultCountry="in" value={newAddress.phoneNo} onChange={handlePhoneChange} />
                                            </StyledPhoneInput>
                                            {formErrors.phoneNo && (<Typography color="error" variant="caption" sx={{ ml: '14px', mt: '3px' }}>{formErrors.phoneNo}</Typography>)}
                                        </Grid>
                                    </Grid>
                                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Address</Button>
                                </Box>
                            )}
                        </Paper>
                    )}
                </Grid>

                <Grid item xs={12} md={5}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Order Summary</Typography>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                        {cartItems && cartItems.map(item => (
                             item && item.product && (
                                <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                                    <Typography noWrap title={item.product.name} sx={{ flex: 1, mr: 1 }}>{item.product.name} (x{item.quantity})</Typography>
                                    <Typography>₹{((item.product.price || 0) * (item.quantity || 0)).toLocaleString()}</Typography>
                                </Box>
                             )
                        ))}
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Typography color="text.secondary">Subtotal</Typography>
                            <Typography color="text.secondary">₹{(subtotal || 0).toLocaleString()}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, color: 'success.main' }}>
                            <Typography>Discount</Typography>
                            <Typography>- ₹{(discount || 0).toLocaleString()}</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} light />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>Grand Total</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>₹{(grandTotal || 0).toLocaleString()}</Typography>
                        </Box>

                        {!coupon ? (
                            <Box sx={{ display: 'flex', mt: 3, gap: 1 }}>
                                <TextField label="Coupon Code" variant="outlined" size="small" fullWidth value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />
                                <Button variant="contained" onClick={handleApplyCoupon} disabled={cartLoading}>Apply</Button>
                            </Box>
                        ) : (
                             <Alert severity="success" sx={{ mt: 3 }} action={
                                <IconButton color="inherit" size="small" onClick={handleRemoveCoupon}>
                                    <DeleteIcon fontSize="inherit" />
                                </IconButton>
                            }>
                                Coupon Applied: <strong>{coupon.code}</strong>
                            </Alert>
                        )}

                        <Button 
                            variant="contained" 
                            fullWidth 
                            size="large" 
                            sx={{ mt: 3, py: 1.5, fontSize: '1rem' }} 
                            disabled={!selectedAddress || !cartItems || cartItems.length === 0 || isProcessingPayment}
                            onClick={handleProceedToPayment}
                        >
                            {isProcessingPayment ? <CircularProgress size={24} color="inherit" /> : `Pay ₹${(grandTotal || 0).toLocaleString()}`}
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
            
            <Dialog open={deleteConfirm.open} onClose={handleDeleteClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent><DialogContentText>Are you sure you want to delete this address?</DialogContentText></DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CheckoutPage;

