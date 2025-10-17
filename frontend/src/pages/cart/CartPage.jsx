import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, Typography, Button, CircularProgress, Alert,
    Paper, Grid, Avatar, IconButton, TextField
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchCart, updateCartItemQuantity, removeItemFromCart } from '../../redux/cartSlice';

const CartPage = () => {
    const dispatch = useDispatch();
    // --- THIS IS THE FIX ---
    // Safely access the cart state and provide a fallback to prevent crashes
    const { items = [], loading, error } = useSelector((state) => state.cart || {});
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            dispatch(fetchCart());
        }
    }, [dispatch, user]);

    const handleQuantityChange = (itemId, quantity) => {
        if (quantity >= 1) {
            dispatch(updateCartItemQuantity({ itemId, quantity }));
        }
    };

    const handleRemoveItem = (itemId) => {
        dispatch(removeItemFromCart(itemId));
    };

    // This line is now safe because 'items' will always be an array
    const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" gutterBottom>Your Shopping Cart</Typography>
            {items.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6">Your cart is empty.</Typography>
                    <Button component={Link} to="/products" variant="contained" sx={{ mt: 2 }}>
                        Continue Shopping
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        {items.map((item) => (
                            <Paper key={item._id} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
                                <Avatar src={item.product.images[0]?.url} variant="rounded" sx={{ width: 80, height: 80, mr: 2 }} />
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6">{item.product.name}</Typography>
                                    <Typography>Price: ₹{item.product.price.toLocaleString()}</Typography>
                                </Box>
                                <TextField
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                                    inputProps={{ min: 1 }}
                                    sx={{ width: '80px', mx: 2 }}
                                />
                                <IconButton color="error" onClick={() => handleRemoveItem(item._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Paper>
                        ))}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h5" gutterBottom>Order Summary</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography>Subtotal ({items.length} items)</Typography>
                                <Typography>₹{subtotal.toLocaleString()}</Typography>
                            </Box>
                            <Button
                                component={Link}
                                to="/checkout"
                                variant="contained"
                                fullWidth
                                size="large"
                            >
                                Proceed to Checkout
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default CartPage;