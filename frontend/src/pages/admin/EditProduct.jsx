import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Button, TextField, Typography, CircularProgress,
    FormControl, InputLabel, Select, MenuItem, Paper, Snackbar, Alert, Grid, Avatar, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EditProduct = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        brand: '',
    });
    const [currentImages, setCurrentImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchProductAndDependencies = async () => {
            try {
                setLoading(true);
                const [productRes, catRes, brandRes] = await Promise.all([
                    axios.get(`/api/v1/product/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/v1/categories', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/v1/brands', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                const productData = productRes.data.product;
                setFormData({
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    stock: productData.stock,
                    category: productData.category._id,
                    brand: productData.brand._id,
                });
                setCurrentImages(productData.images);
                setCategories(catRes.data);
                setBrands(brandRes.data);
            } catch (err) {
                setError('Failed to load product data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (id && token) {
            fetchProductAndDependencies();
        }
    }, [id, token]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleNewImageChange = (e) => setNewImages([...e.target.files]);

    const handleMarkForDeletion = (public_id) => {
        setCurrentImages(currentImages.filter(img => img.public_id !== public_id));
        setImagesToDelete([...imagesToDelete, public_id]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setError('');

        const updateData = new FormData();
        Object.entries(formData).forEach(([key, value]) => updateData.append(key, value));
        
        for (const image of newImages) {
            updateData.append('images', image);
        }

        for (const publicId of imagesToDelete) {
            updateData.append('imagesToDelete', publicId);
        }

        try {
            const config = {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` 
                }
            };
            await axios.put(`/api/v1/product/${id}`, updateData, config);
            
            setUpdateLoading(false);
            setSnackbar({ open: true, message: 'Product updated successfully!' });
            setTimeout(() => navigate('/admin/products'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update product.');
            setUpdateLoading(false);
        }
    };

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 3 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>Edit Product</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="Product Name" name="name" value={formData.name} onChange={handleChange} required sx={{ mb: 2 }} />
                    <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} required multiline rows={4} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Price" name="price" type="number" value={formData.price} onChange={handleChange} required sx={{ mb: 2 }} inputProps={{ min: 0 }} />
                    <TextField fullWidth label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required sx={{ mb: 2 }} inputProps={{ min: 0 }} />

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

                    <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Manage Images:</Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {currentImages.map(img => (
                            <Grid item key={img.public_id} sx={{ position: 'relative' }}>
                                <Avatar src={img.url} variant="rounded" sx={{ width: 80, height: 80 }} />
                                <IconButton
                                    size="small"
                                    onClick={() => handleMarkForDeletion(img.public_id)}
                                    sx={{ position: 'absolute', top: -5, right: -5, background: 'rgba(255,255,255,0.8)' }}
                                >
                                    <DeleteIcon fontSize="small" color="error" />
                                </IconButton>
                            </Grid>
                        ))}
                    </Grid>

                    <Button variant="outlined" component="label" sx={{ mb: 2, width: '100%' }}>
                        Upload New Images
                        <input type="file" hidden multiple accept="image/*" onChange={handleNewImageChange} />
                    </Button>
                    {newImages.length > 0 && <Typography variant="body2">{newImages.length} new file(s) selected</Typography>}

                    {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

                    <Button fullWidth variant="contained" type="submit" disabled={updateLoading} size="large" sx={{ height: 56, mt: 2 }}>
                        {updateLoading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
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

export default EditProduct;