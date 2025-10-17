import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, CircularProgress, FormControl, InputLabel, Select, MenuItem, useTheme, useMediaQuery, Alert } from '@mui/material';

// A modern, reusable Product Card component with enhanced styling
const ProductCard = ({ product }) => (
    <Paper
        elevation={0}
        variant="outlined"
        component={Link}
        to={`/product/${product._id}`}
        sx={{
            textDecoration: 'none',
            display: 'block',
            overflow: 'hidden',
            position: 'relative',
            height: '100%',
            borderRadius: 2, // Softer corners
            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => `0 4px 20px ${theme.palette.action.hover}`,
            },
            '&:hover .product-image': {
                transform: 'scale(1.05)',
            },
        }}
    >
        <Box
            className="product-image"
            sx={{
                width: '100%',
                paddingTop: '125%', // Aspect ratio for a taller, modern look
                backgroundImage: `url(${product.images[0]?.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.4s ease',
            }}
        />
        <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" noWrap>{product.brand?.name || 'Brand'}</Typography>
            <Typography variant="subtitle1" component="h3" noWrap className="product-title" sx={{ fontWeight: 600 }}>
                {product.name}
            </Typography>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700, mt: 1 }}>
                ₹{product.price.toLocaleString()}
            </Typography>
        </Box>
    </Paper>
);

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Parse filters from URL query parameters for shareable links
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const [filters, setFilters] = useState({
        category: queryParams.get('category') || '',
        brand: queryParams.get('brand') || '',
        sort: queryParams.get('sort') || 'name-asc',
    });

    // Fetch categories and brands for the filter dropdowns just once
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const [catRes, brandRes] = await Promise.all([
                    axios.get('/api/v1/categories'),
                    axios.get('/api/v1/brands'),
                ]);
                setCategories(catRes.data);
                setBrands(brandRes.data);
            } catch (err) {
                setError('Failed to load filter options.');
            }
        };
        fetchFilterOptions();
    }, []);

    // Fetch products whenever filters change
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get('/api/v1/product', {
                    params: {
                        category: filters.category,
                        brand: filters.brand,
                        sort: filters.sort,
                        limit: 100, // Fetch a larger number of products to group them effectively
                    },
                });
                setProducts(data.products);
            } catch (err) {
                setError("Failed to fetch products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();

        // Update the URL with the current filters without reloading the page
        const newSearch = new URLSearchParams();
        if(filters.category) newSearch.set('category', filters.category);
        if(filters.brand) newSearch.set('brand', filters.brand);
        if(filters.sort) newSearch.set('sort', filters.sort);
        navigate(`${location.pathname}?${newSearch.toString()}`, { replace: true });

    }, [filters, navigate, location.pathname]);

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    // Group products by their category name for organized display
    const groupedProducts = useMemo(() => {
        if (filters.category) {
            // If filtering by a specific category, don't group further
            const categoryName = categories.find(c => c._id === filters.category)?.name || 'Filtered Results';
            return { [categoryName]: products };
        }
        // Otherwise, group all products by their category
        return products.reduce((acc, product) => {
            const categoryName = product.category?.name || 'Other';
            if (!acc[categoryName]) {
                acc[categoryName] = [];
            }
            acc[categoryName].push(product);
            return acc;
        }, {});
    }, [products, filters.category, categories]);

    return (
        <>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
                {/* Header and Filters Section */}
                <Paper elevation={0} sx={{ mb: 4, p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                        Products
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        {/* ✨ FIX: Updated grid properties for better responsiveness across all screen sizes */}
                        <Grid item xs={12} sm={12} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Category</InputLabel>
                                <Select name="category" value={filters.category} label="Category" onChange={handleFilterChange}>
                                    {/* <MenuItem value="category">All Categories</MenuItem> */}

                                    {categories.map(cat => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                             <FormControl fullWidth variant="outlined">
                                <InputLabel>Sort By</InputLabel>
                                <Select name="sort" value={filters.sort} label="Sort By" onChange={handleFilterChange}>
                                    <MenuItem value="name-asc">Name (A-Z)</MenuItem>
                                    <MenuItem value="name-desc">Name (Z-A)</MenuItem>
                                    <MenuItem value="price-asc">Price (Low to High)</MenuItem>
                                    <MenuItem value="price-desc">Price (High to Low)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Product Display Section */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress size={60} /></Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : products.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6">No Products Found</Typography>
                        <Typography>Try adjusting your filters to find what you're looking for.</Typography>
                    </Paper>
                ) : (
                    Object.keys(groupedProducts).map(categoryName => (
                        <Box key={categoryName} sx={{ mb: 5 }}>
                            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, borderBottom: '2px solid', borderColor: 'divider', pb: 1, mb: 3 }}>
                                {categoryName}
                            </Typography>
                            <Grid container spacing={isMobile ? 2 : 3}>
                                {groupedProducts[categoryName].map((product) => (
                                    <Grid item key={product._id} xs={6} sm={6} md={4} lg={3}>
                                        <ProductCard product={product} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ))
                )}
            </Box>
        </>
    );
};

export default ProductList;

