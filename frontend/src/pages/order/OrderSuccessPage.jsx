import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';

const OrderSuccessPage = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h4" gutterBottom>Thank You for Your Order!</Typography>
                <Typography color="text.secondary">
                    Your order has been placed successfully. You will receive an email confirmation shortly.
                </Typography>
                <Button component={Link} to="/products" variant="contained" sx={{ mt: 3 }}>
                    Continue Shopping
                </Button>
            </Paper>
        </Box>
    );
};

export default OrderSuccessPage;