import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWishlist, toggleWishlistItem } from '../../redux/wishlistSlice';
import { Box, Typography, CircularProgress, Alert, Grid, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.wishlist);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            dispatch(fetchWishlist());
        }
    }, [dispatch, user]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" gutterBottom>My Wishlist</Typography>
            {products.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6">Your wishlist is empty.</Typography>
                    <Button component={Link} to="/products" variant="contained" sx={{ mt: 2 }}>
                        Discover Products
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                            <Paper>
                                <Link to={`/product/${product._id}`}>
                                    <img src={product.images[0]?.url} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                </Link>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="h6" noWrap>{product.name}</Typography>
                                    <Typography variant="subtitle1" color="primary">₹{product.price.toLocaleString()}</Typography>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="error"
                                        sx={{ mt: 1 }}
                                        onClick={() => dispatch(toggleWishlistItem(product._id))}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default WishlistPage;