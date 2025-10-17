import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { Link } from 'react-router-dom';

const PaymentFailurePage = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h4" gutterBottom>Payment Failed</Typography>
                <Typography color="text.secondary">
                    Unfortunately, we were unable to process your payment. Please try again.
                </Typography>
                <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
                    Go To Home Page
                </Button>
            </Paper>
        </Box>
    );
};
export default PaymentFailurePage;