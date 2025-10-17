import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const AdminOrdersDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useSelector((state) => state.auth);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/v1/order/admin/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // ✨ FIX: Filter out any null/undefined orders and ensure each has an ID.
            const validOrders = data.orders
                .filter(Boolean) // Removes any null or undefined entries in the array
                .map(o => ({ ...o, id: o._id }));
            setOrders(validOrders);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const handleStatusChange = async (id, status) => {
        try {
            await axios.put(`/api/v1/order/admin/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchOrders();
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const columns = [
        { field: 'id', headerName: 'Order ID', width: 220 },
        { 
            field: 'user', 
            headerName: 'User', 
            width: 200, 
            // ✨ FIX: Safely access nested properties.
            valueGetter: (params) => params.row?.user?.email || 'User Not Found' 
        },
        { 
            field: 'totalPrice', 
            headerName: 'Amount', 
            width: 130, 
            renderCell: (params) => `₹${params.value?.toLocaleString() || 0}` 
        },
        {
            field: 'orderStatus',
            headerName: 'Status',
            width: 180,
            renderCell: (params) => (
                <Select
                    value={params.value || 'Processing'}
                    onChange={(e) => handleStatusChange(params.id, e.target.value)}
                    size="small"
                    sx={{ width: '100%' }}
                >
                    <MenuItem value="Pending Payment">Pending Payment</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                    <MenuItem value="Payment Failed">Payment Failed</MenuItem>
                </Select>
            )
        },
        { 
            field: 'createdAt', 
            headerName: 'Ordered On', 
            width: 150, 
            renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString() : 'N/A' 
        },
    ];

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>All Orders</Typography>
            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={orders}
                    columns={columns}
                    loading={loading}
                    pageSizeOptions={[10, 25, 50]}
                />
            </Paper>
        </Box>
    );
};

export default AdminOrdersDashboard;