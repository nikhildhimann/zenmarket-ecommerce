import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Button, TextField, Typography, CircularProgress,
    FormControl, InputLabel, Select, MenuItem, Paper, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        brand: '',
    });
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [catRes, brandRes] = await Promise.all([
                    axios.get('/api/v1/categories', config),
                    axios.get('/api/v1/brands', config)
                ]);
                setCategories(catRes.data);
                setBrands(brandRes.data);
            } catch (err) {
                setError('Failed to load categories or brands.');
            }
        };
        fetchDropdownData();
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files.length > 5) {
            setError("You can only upload a maximum of 5 images.");
            return;
        }
        setImages([...e.target.files]);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.description || !formData.price || !formData.stock || !formData.category || !formData.brand) {
            setError("Please fill out all required fields.");
            return;
        }
        if (images.length === 0) {
            setError("Please upload at least one image.");
            return;
        }
        
        setLoading(true);
        setError('');

        const productData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            productData.append(key, value);
        });
        for (const image of images) {
            productData.append('images', image);
        }

        try {
            // --- THIS IS THE FIX ---
            const config = {
                headers: {
                    // Let the browser set the 'Content-Type' with the boundary
                    'Authorization': `Bearer ${token}`
                }
            };
            await axios.post('/api/v1/product/new', productData, config);
            
            setSnackbar({ open: true, message: 'Product created successfully!' });
            setTimeout(() => navigate('/admin/products'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create product.');
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 3 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>Create New Product</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="Product Name" name="name" value={formData.name} onChange={handleChange} required sx={{ mb: 2 }} />
                    <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} required multiline rows={4} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Price" name="price" type="number" value={formData.price} onChange={handleChange} required sx={{ mb: 2 }} inputProps={{ min: 0 }} />
                    <TextField fullWidth label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required sx={{ mb: 2 }} inputProps={{ min: 0 }}/>
                    
                    <FormControl fullWidth required sx={{ mb: 2 }}>
                        <InputLabel>Category</InputLabel>
                        <Select name="category" value={formData.category} label="Category" onChange={handleChange}>
                            {categories.map(cat => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    
                    <FormControl fullWidth required sx={{ mb: 2 }}>
                        <InputLabel>Brand</InputLabel>
                        <Select name="brand" value={formData.brand} label="Brand" onChange={handleChange}>
                            {brands.map(br => <MenuItem key={br._id} value={br._id}>{br.name}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <Button variant="outlined" component="label" sx={{ mb: 2, width: '100%' }}>
                        Upload Images (up to 5)
                        <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
                    </Button>
                    {images.length > 0 && <Typography variant="body2" sx={{ mb: 2 }}>{images.length} file(s) selected</Typography>}

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Button fullWidth variant="contained" type="submit" disabled={loading} size="large" sx={{ height: 56 }}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Product'}
                    </Button>
                </form>
            </Paper>
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddProduct;