import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    Box, Typography, TextField, Paper, Button, 
    CircularProgress, Pagination, Avatar, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, Snackbar, Alert, IconButton, InputAdornment
} from '@mui/material';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

const ProductDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const { token } = useSelector((state) => state.auth);

    const fetchProducts = useCallback(async (currentPage, keyword) => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/v1/product', {
                params: { page: currentPage, keyword, limit: 5 },
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(data.products.map(p => ({ ...p, id: p._id })));
            setTotalPages(data.pagination.totalPages);
        } catch (err) { // Fixed bare catch
            setError('Failed to fetch products. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    const debouncedFetch = React.useMemo(() => debounce((p, k) => fetchProducts(p, k), 300), [fetchProducts]);

    useEffect(() => {
        debouncedFetch(1, searchTerm);
        setPage(1);
    }, [searchTerm, debouncedFetch]);

    useEffect(() => {
        // This effect might be redundant if debouncedFetch covers all cases.
        // Keeping it for now for direct page changes.
        if (!searchTerm) {
            fetchProducts(page, searchTerm);
        }
    }, [page, searchTerm, fetchProducts]);

    const handlePageChange = (event, value) => setPage(value);
    const handleSearchChange = (event) => setSearchTerm(event.target.value);
    const handleDeleteClick = (id) => setDeleteConfirm({ open: true, id });
    const handleDeleteClose = () => setDeleteConfirm({ open: false, id: null });

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`/api/v1/product/${deleteConfirm.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSnackbar({ open: true, message: 'Product deleted successfully!', severity: 'success' });
            fetchProducts(page, searchTerm);
        } catch (err) { // Fixed bare catch
            setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to delete product.', severity: 'error' });
        } finally {
            handleDeleteClose();
        }
    };

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
    
    const columns = [
        { field: 'images', headerName: 'Image', width: 80, sortable: false, renderCell: (params) => <Avatar src={params.row.images[0]?.url} variant="rounded" /> },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'brand', headerName: 'Brand', width: 150, valueGetter: (params) => params.row?.brand?.name || 'N/A' },
        { field: 'price', headerName: 'Price', width: 120, type: 'number', renderCell: (params) => `₹${params.value.toLocaleString()}` },
        { field: 'stock', headerName: 'Stock', width: 100, type: 'number', align: 'right' },
        {
            field: 'actions', headerName: 'Actions', width: 120, sortable: false, align: 'center',
            renderCell: (params) => (
                <Box>
                    <IconButton component={Link} to={`/admin/product/edit/${params.id}`} size="small"><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDeleteClick(params.id)} size="small" color="error"><DeleteIcon /></IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">Admin Product Dashboard</Typography>
                <Button variant="contained" component={Link} to="/admin/product/new">Add New Product</Button>
            </Box>
            <TextField
                fullWidth
                placeholder="Search by product name..."
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ mb: 3 }}
                InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
            />

            {error ? <Alert severity="error">{error}</Alert> : (
                <Paper sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={products}
                        columns={columns}
                        loading={loading}
                        rowCount={totalPages * 5} //rowCount expects total number of rows
                        pageSizeOptions={[5]}
                        paginationModel={{ page: page - 1, pageSize: 5 }}
                        paginationMode="server"
                        onPaginationModelChange={(model) => setPage(model.page + 1)}
                        disableSelectionOnClick
                    />
                </Paper>
            )}

            <Dialog open={deleteConfirm.open} onClose={handleDeleteClose}><DialogTitle>Confirm Deletion</DialogTitle><DialogContent><DialogContentText>Are you sure you want to delete this product? This action cannot be undone.</DialogContentText></DialogContent><DialogActions><Button onClick={handleDeleteClose}>Cancel</Button><Button onClick={handleDeleteConfirm} color="error">Delete</Button></DialogActions></Dialog>
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose}><Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert></Snackbar>
        </Box>
    );
};

export default ProductDashboard;