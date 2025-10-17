import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
    Box, Typography, CircularProgress, Button, TextField, Snackbar,
    Alert, Grid, Paper, Divider, IconButton, Rating, List, ListItem, 
    ListItemAvatar, Avatar, ListItemText
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { addItemToCart } from '../../redux/cartSlice';
import { toggleWishlistItem } from '../../redux/wishlistSlice';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    
    // State for submitting a new review
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);

    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);
    const { products: wishlistProducts } = useSelector((state) => state.wishlist || { products: [] });

    const isWishlisted = user ? wishlistProducts.some(p => p._id === id) : false;

    // Use useCallback to memoize the fetch function
    const fetchProductAndReviews = useCallback(async () => {
        try {
            setLoading(true);
            const [{ data: productData }, { data: reviewsData }] = await Promise.all([
                axios.get(`/api/v1/product/${id}`),
                axios.get(`/api/v1/review/${id}`) // This endpoint needs to exist on your backend
            ]);
            setProduct(productData.product);
            setReviews(reviewsData.reviews);
        } catch (error) {
            console.error("Error fetching data:", error);
            setSnackbar({ open: true, message: "Failed to load product details.", severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (id) {
            fetchProductAndReviews();
        }
    }, [id, fetchProductAndReviews]);

    const handleAddToCart = async () => {
        if (!user) {
            setSnackbar({ open: true, message: 'Please log in to add items to your cart', severity: 'warning' });
            return;
        }
        try {
            await dispatch(addItemToCart({ productId: id, quantity })).unwrap();
            setSnackbar({ open: true, message: 'Item added to cart!', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: error || 'Failed to add item.', severity: 'error' });
        }
    };

    const handleToggleWishlist = () => {
        if (!user) {
            setSnackbar({ open: true, message: 'Please log in to use the wishlist', severity: 'warning' });
            return;
        }
        dispatch(toggleWishlistItem(id));
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setSnackbar({ open: true, message: 'Please select a rating.', severity: 'warning' });
            return;
        }
        setReviewLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('/api/v1/review', { productId: id, rating, comment }, config);
            setSnackbar({ open: true, message: 'Review submitted successfully!', severity: 'success' });
            setRating(0);
            setComment('');
            // Refresh reviews after submitting
            fetchProductAndReviews();
        } catch (error) {
            setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to submit review.', severity: 'error' });
        } finally {
            setReviewLoading(false);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };
    
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    if (!product) return <Typography variant="h5" align="center" sx={{ mt: 5, p: 3 }}>Product Not Found</Typography>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
                <Grid container spacing={4}>
                    {/* Product Image */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={product.images[0]?.url} alt={product.name} style={{ width: '100%', maxWidth: '500px', height: 'auto', borderRadius: '8px' }} />
                        </Box>
                    </Grid>
                    {/* Product Details */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>{product.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Rating value={product.ratings || 0} readOnly precision={0.5} />
                            <Typography sx={{ ml: 1.5, color: 'text.secondary' }}>({product.numOfReviews || 0} Reviews)</Typography>
                        </Box>
                        <Typography variant="h5" color="primary.main" sx={{ my: 2, fontWeight: 'bold' }}>
                            ₹{product.price.toLocaleString()}
                        </Typography>
                        <Typography variant="body1" paragraph color="text.secondary">{product.description}</Typography>
                         <Typography variant="body1" sx={{ color: product.stock > 0 ? 'success.main' : 'error.main', fontWeight: 500 }}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, gap: 2 }}>
                            <TextField
                                type="number"
                                label="Qty"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                inputProps={{ min: 1, max: product.stock }}
                                sx={{ width: '100px' }}
                                disabled={product.stock === 0}
                            />
                            <Button 
                                variant="contained" 
                                size="large" 
                                onClick={handleAddToCart} 
                                disabled={product.stock === 0}
                                sx={{ flexGrow: 1, height: '56px' }}
                            >
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <IconButton onClick={handleToggleWishlist} size="large" sx={{ border: '1px solid', borderColor: 'divider' }}>
                                {isWishlisted ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* --- REVIEWS SECTION --- */}
            <Box sx={{ mt: 6 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>Customer Reviews</Typography>
                <Grid container spacing={4}>
                    {/* Review Submission Form */}
                    <Grid item xs={12} md={5}>
                        <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>Write a Review</Typography>
                            {user ? (
                                <Box component="form" onSubmit={handleReviewSubmit}>
                                    <Rating
                                        value={rating}
                                        onChange={(e, newValue) => setRating(newValue)}
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        label="Your Review"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        required
                                    />
                                    <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={reviewLoading}>
                                        {reviewLoading ? <CircularProgress size={24} /> : 'Submit Review'}
                                    </Button>
                                </Box>
                            ) : (
                                <Alert severity="info">Please <RouterLink to="/login">log in</RouterLink> to write a review.</Alert>
                            )}
                        </Paper>
                    </Grid>
                    {/* Display Reviews */}
                    <Grid item xs={12} md={7}>
                        {reviews.length > 0 ? (
                            <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                                {reviews.map((review, index) => (
                                    <React.Fragment key={review._id}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar>{review.name.charAt(0)}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={<Rating value={review.rating} readOnly size="small" />}
                                                secondary={
                                                    <>
                                                        <Typography component="span" variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                                                            {review.name}
                                                        </Typography>
                                                        {" — "}{review.comment}
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        {index < reviews.length - 1 && <Divider variant="inset" component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                             <Paper elevation={0} variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                                <Typography>No reviews yet. Be the first to share your thoughts!</Typography>
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </Box>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProductDetails;

