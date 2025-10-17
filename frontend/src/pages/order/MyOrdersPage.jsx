import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchMyOrders = async () => {
            if (!token) return;
            try {
                const { data } = await axios.get('/api/v1/order/myorders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(data.orders);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, [token]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" gutterBottom>My Orders</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Est. Delivery</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* ✨ FIX: Ensure no invalid nodes are rendered by filtering out potential nulls */}
                        {orders && orders.filter(Boolean).map((order) => {
                            const deliveryDate = new Date(order.createdAt);
                            deliveryDate.setDate(deliveryDate.getDate() + 14);

                            return (
                                <TableRow key={order._id} hover>
                                    <TableCell>{order._id}</TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>₹{order.totalPrice.toLocaleString()}</TableCell>
                                    <TableCell>{order.orderStatus}</TableCell>
                                    <TableCell>
                                        {['Delivered', 'Cancelled', 'Payment Failed'].includes(order.orderStatus)
                                            ? '—'
                                            : deliveryDate.toLocaleDateString()
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Button component={Link} to={`/order/${order._id}`} size="small">
                                            Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default MyOrdersPage;
