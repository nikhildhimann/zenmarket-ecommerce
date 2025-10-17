import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, Grid, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import axios from 'axios';
import StatCard from '../../component/admin/StatCard';
// ✨ FIX: Corrected the import path for the icon
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useSelector((state) => state.auth);

    // ✨ FIX: This function now fetches all data from the single '/stats' endpoint.
    const fetchDashboardData = useCallback(async (userId) => {
        setLoading(true);
        setError('');
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                params: {}
            };
            if (userId) {
                config.params.userId = userId;
            }
            
            const { data } = await axios.get('/api/v1/analytics/stats', config);
            setStats(data.stats);
            if (!userId) {
                setAllUsers(data.stats.allUsers || []);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchDashboardData(selectedUser);
        }
    }, [selectedUser, fetchDashboardData, token]);

    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" component="h1">
                    {selectedUser ? `${allUsers.find(u => u._id === selectedUser)?.username}'s Dashboard` : 'Overall Dashboard'}
                </Typography>
                <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                    <InputLabel>Filter by User</InputLabel>
                    <Select value={selectedUser} label="Filter by User" onChange={handleUserChange}>
                        <MenuItem value=""><em>All Users</em></MenuItem>
                        {allUsers.map(user => (
                            <MenuItem key={user._id} value={user._id}>{user.username}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Stat Cards Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Total Revenue" 
                        value={`₹${stats?.totalRevenue.toLocaleString() || 0}`}
                        icon={<MonetizationOnIcon color="primary" sx={{ fontSize: 40 }} />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Successful Orders" 
                        value={stats?.successfulOrdersCount.toLocaleString() || 0}
                        icon={<CheckCircleIcon color="success" sx={{ fontSize: 40 }} />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Failed/Cancelled" 
                        value={stats?.failedOrdersCount.toLocaleString() || 0}
                        icon={<CancelIcon color="error" sx={{ fontSize: 40 }} />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Products Sold" 
                        value={stats?.totalProductsSold.toLocaleString() || 0}
                        icon={<ShoppingCartIcon color="warning" sx={{ fontSize: 40 }} />}
                    />
                </Grid>
            </Grid>

            {/* Sales Chart */}
            <Paper sx={{ p: 3, height: 400 }}>
                 <Typography variant="h6" gutterBottom>Monthly Sales Revenue</Typography>
                <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={stats?.monthlySales} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#0057FF" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        </Box>
    );
};

export default AdminDashboard;

