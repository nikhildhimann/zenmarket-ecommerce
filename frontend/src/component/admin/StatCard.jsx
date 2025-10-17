import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

// A reusable component for displaying key stats in the admin dashboard
const StatCard = ({ title, value, icon, color }) => (
    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 4, height: '100%' }}>
        <Box>
            <Typography variant="h6" color="text.secondary">{title}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}</Typography>
        </Box>
        <Box sx={{ backgroundColor: `${color}.light`, p: 1.5, borderRadius: '50%' }}>
            {React.cloneElement(icon, { sx: { fontSize: 32, color: `${color}.dark` } })}
        </Box>
    </Paper>
);

export default StatCard;
