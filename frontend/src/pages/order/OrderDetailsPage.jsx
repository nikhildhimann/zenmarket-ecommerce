import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert, Grid, Divider } from '@mui/material';
import axios from 'axios';

const OrderDetailsPage = () => {
    const { id: orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const { data } = await axios.get(`/api/v1/order/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrder(data.order);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, token]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!order) return <Typography>Order not found.</Typography>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" gutterBottom>Order Details</Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6">Order #{order._id}</Typography>
                <Typography color="text.secondary">Placed on: {new Date(order.createdAt).toLocaleString()}</Typography>
                <Typography color="text.secondary">Status: {order.orderStatus}</Typography>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h5" gutterBottom>Order Items</Typography>
                    {order.orderItems.map(item => (
                        <Paper key={item.product} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
                            <img src={item.image} alt={item.name} style={{ width: 80, height: 80, marginRight: 16, borderRadius: 4 }} />
                            <Box flexGrow={1}>
                                <Typography variant="body1">{item.name}</Typography>
                                <Typography color="text.secondary">{item.quantity} x ₹{item.price.toLocaleString()}</Typography>
                            </Box>
                            <Typography variant="body1">₹{(item.quantity * item.price).toLocaleString()}</Typography>
                        </Paper>
                    ))}
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h5" gutterBottom>Shipping & Summary</Typography>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">Shipping Address</Typography>
                        <Typography>{order.shippingAddress.street}, {order.shippingAddress.city}</Typography>
                        <Typography>{order.shippingAddress.state}, {order.shippingAddress.postalCode}</Typography>
                        <Typography>{order.shippingAddress.country}</Typography>
                        <Typography>Phone: {order.shippingAddress.phoneNo}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h6">₹{order.totalPrice.toLocaleString()}</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default OrderDetailsPage;