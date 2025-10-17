import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
// ✨ FIX: Add MenuItem to the import list
import { Box, Typography, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress, IconButton, Snackbar, Alert, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';

const CouponDashboard = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [formState, setFormState] = useState({ code: '', discountType: 'percentage', discountAmount: '', expiryDate: '', minPurchase: 0 });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const { token } = useSelector((state) => state.auth);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('/api/v1/coupon', config);
            setCoupons(data.coupons.map(c => ({ ...c, id: c._id })));
        } catch (error) {
            console.error("Failed to fetch coupons:", error);
            setSnackbar({ open: true, message: 'Failed to fetch coupons.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCoupons();
        }
    }, [token]);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('/api/v1/coupon', formState, config);
            setSnackbar({ open: true, message: 'Coupon created successfully!', severity: 'success' });
            fetchCoupons();
        } catch (error) {
            setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to create coupon.', severity: 'error' });
        } finally {
            handleClose();
        }
    };

    const handleDelete = async (id) => {
        // Using a more modern confirm dialog would be better, but window.confirm is simple
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`/api/v1/coupon/${id}`, config);
                setSnackbar({ open: true, message: 'Coupon deleted.', severity: 'success' });
                fetchCoupons();
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to delete coupon.', severity: 'error' });
            }
        }
    };

    const columns = [
        { field: 'code', headerName: 'Code', width: 150 },
        { field: 'discountType', headerName: 'Type', width: 120 },
        { field: 'discountAmount', headerName: 'Amount', width: 120, renderCell: (params) => params.row.discountType === 'percentage' ? `${params.value}%` : `₹${params.value}` },
        { field: 'expiryDate', headerName: 'Expires On', width: 150, renderCell: (params) => new Date(params.value).toLocaleDateString() },
        { field: 'minPurchase', headerName: 'Min. Purchase', width: 130, renderCell: (params) => `₹${params.value}` },
        { field: 'actions', headerName: 'Actions', width: 100, renderCell: (params) => <IconButton color="error" onClick={() => handleDelete(params.row.id)}><DeleteIcon /></IconButton> },
    ];

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Manage Coupons</Typography>
                <Button variant="contained" startIcon={<AddCircleIcon />} onClick={handleClickOpen}>Create Coupon</Button>
            </Box>
            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid rows={coupons} columns={columns} loading={loading} />
            </Paper>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Coupon</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" name="code" label="Coupon Code" type="text" fullWidth variant="standard" onChange={handleChange} />
                    <TextField margin="dense" name="discountType" select label="Discount Type" fullWidth variant="standard" value={formState.discountType} onChange={handleChange}>
                        <MenuItem value="percentage">Percentage</MenuItem>
                        <MenuItem value="fixed">Fixed Amount</MenuItem>
                    </TextField>
                    <TextField margin="dense" name="discountAmount" label="Discount Amount" type="number" fullWidth variant="standard" onChange={handleChange} />
                    <TextField margin="dense" name="expiryDate" label="Expiry Date" type="date" fullWidth variant="standard" InputLabelProps={{ shrink: true }} onChange={handleChange} />
                    <TextField margin="dense" name="minPurchase" label="Minimum Purchase" type="number" fullWidth variant="standard" onChange={handleChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Create</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default CouponDashboard;

