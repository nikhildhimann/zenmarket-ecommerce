import React from 'react';
import { Box, Container, Typography, Grid, Link, IconButton } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
    return (
        <Box sx={{ backgroundColor: 'background.paper', color: 'text.secondary', py: 6, mt: 8 , }}>
            <Container maxWidth="lg">
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            E-commerce WebSite
                        </Typography>
                        <Typography variant="body2">
                            Welcome to your fashion destination. Discover the latest trends and find perfect pieces for your wardrobe.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <IconButton href="#" color="inherit"><TwitterIcon /></IconButton>
                            <IconButton href="#" color="inherit"><InstagramIcon /></IconButton>
                            <IconButton href="#" color="inherit"><LinkedInIcon /></IconButton>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <Typography variant="subtitle1" color="text.primary" gutterBottom>Product</Typography>
                        <Link href="/" color="inherit" display="block">Home</Link>
                        <Link href="/products" color="inherit" display="block">Products</Link>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <Typography variant="subtitle1" color="text.primary" gutterBottom>Company</Typography>
                        <Link href="#" color="inherit" display="block">Contact</Link>
                        <Link href="#" color="inherit" display="block">Blog</Link>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <Typography variant="subtitle1" color="text.primary" gutterBottom>Legal</Typography>
                        <Link href="#" color="inherit" display="block">Privacy</Link>
                        <Link href="#" color="inherit" display="block">Terms</Link>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider', pt: 3 }}>
                    <Typography variant="body2">
                        © {new Date().getFullYear()} Your Company. All rights reserved.
                    </Typography>
                    {/* You can add payment icons here */}
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;