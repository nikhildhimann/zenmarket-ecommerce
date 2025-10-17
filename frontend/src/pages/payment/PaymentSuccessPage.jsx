import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';

const PaymentSuccessPage = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h4" gutterBottom>Payment Successful!</Typography>
                <Typography color="text.secondary">
                    Thank you for your purchase. Your order has been placed.
                </Typography>
                <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
                    Go To Home Page
                </Button>
            </Paper>
        </Box>
    );
};

export default PaymentSuccessPage;