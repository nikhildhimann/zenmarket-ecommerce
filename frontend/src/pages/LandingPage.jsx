import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, TextField, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { keyframes } from '@mui/system';
import { Link } from 'react-router-dom';



//style
import FeaturedCategories from "./style/FeaturedCategories";


// --- Parallax Scrolling Gallery Component ---
const ParallaxScrollingGallery = ({ navigate }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Adjust the multiplier (e.g., 0.2) to change the scroll speed
  const parallaxOffset = scrollPosition * 0.2;

  return (
    <>
      <Container maxWidth="md" sx={{ color: 'white', boxShadow: '0px -5px 10px rgba(0, 0, 0, 0.2)' }} align="center"> <Typography variant="overline" sx={{ letterSpacing: 2 }}> WELCOME TO </Typography> <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 4 }}> ZenMarket </Typography> <Button variant="contained" color="primary" size="large" onClick={() => navigate('/products')} > Shop Now </Button> </Container>
      <Box sx={{ overflowX: 'hidden', py: 10, bgcolor: 'background.default' }}>
        <Box sx={{
          display: 'flex',
          // The images will move horizontally based on the vertical scroll position
          transform: `translateX(-${parallaxOffset}px)`,
          willChange: 'transform', // Performance optimization
          width: 'max-content', // Ensure the container is wide enough for all images
        }}>
          {/* Ensure you have these images in your f/public/ folder */}
          <img src="/gallery-1.avif" alt="Fashion 1" style={{ width: '24vw', height: '450px', padding: '0 15px', borderRadius: '20px' }} />
          <img src="/gallery-2.avif" alt="Fashion 2" style={{ width: '24vw', height: '450px', padding: '0 15px', borderRadius: '20px' }} />
          <img src="/gallery-3.avif" alt="Fashion 3" style={{ width: '24vw', height: '450px', padding: '0 15px', borderRadius: '20px' }} />
          <img src="/gallery-4.avif" alt="Fashion 4" style={{ width: '24vw', height: '450px', padding: '0 15px', borderRadius: '20px' }} />
          <img src="/gallery-1.avif" alt="Fashion 1" style={{ width: '24vw', height: '450px', padding: '0 15px', borderRadius: '20px' }} />
        </Box>
      </Box>
    </>
  );
};

// --- Other Sections (as separate components for cleanliness) ---

// --- THIS IS THE NEW "DISCOVER STYLE" SECTION ---
const scrollAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const CallToAction = ({ navigate }) => (
  <Box sx={{ py: 16, position: 'relative', overflow: 'hidden', backgroundColor: '#111' }}>
    <Box sx={{
      position: 'absolute', top: 0, left: 0, width: '200%', height: '100%',
      backgroundImage: 'url(/move.png)', // Make sure you have this image in /public
      backgroundRepeat: 'repeat-x',
      backgroundSize: 'auto 100%',
      animation: `${scrollAnimation} 60s linear infinite`,
      zIndex: 1,
      opacity: 0.08
    }} />
    <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
      <Typography variant="h3" sx={{ fontWeight: 700 }}>DISCOVER STYLE</Typography>
      <Typography variant="h3" sx={{ fontWeight: 700 }}>JUST A BUTTON</Typography>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 5 }}>PRESS AWAY!</Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate('/products')}
        sx={{ px: 6, py: 1.5, fontSize: '1rem' }}
      >
        Explore All Products
      </Button>

      <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 3, maxWidth: '450px', mx: 'auto' }}>
        Instantly access the latest fashion trends and exclusive deals on our site. Discover your perfect style in a few clicks.
      </Typography>
    </Container>
  </Box>
);


// --- Main Landing Page Component ---
const LandingPage = () => {
  const navigate = useNavigate();
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await axios.get('/api/v1/product', { params: { limit: 8 } });
        setTrendingProducts(data.products);
      } catch (error) {
        console.error("Error fetching trending products:", error);
      }
    };
    fetchTrending();
  }, []);

  return (
    <Box>
      {/* The Full-Screen Video Hero with Blur and New Text */}
      <Box sx={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <video autoPlay loop muted style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, objectFit: 'cover', zIndex: -0.4 }}>
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)', zIndex: -1 }} />

      </Box>

      {/* Render the other sections */}
      <ParallaxScrollingGallery navigate={navigate} />
      <FeaturedCategories />
      <CallToAction navigate={navigate} />
    </Box>
  );
};

export default LandingPage;