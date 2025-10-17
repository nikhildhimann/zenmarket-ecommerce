import { Box, Container, Typography,  Paper, Stack } from '@mui/material';


const FeaturedCategories = ({ navigate }) => {
  const categories = [
    { name: 'Jeans', image: '/category-jeans.jpg', path: '/products?category=jeans' },
    { name: 'T-Shirts', image: '/category-tshirts.jpg', path: '/products?category=t-shirts' },
    { name: 'Shirts', image: '/category-shirts.jpg', path: '/products?category=shirts' },
    { name: 'Sneakers', image: '/category-sneakers.jpg', path: '/products?category=sneakers' },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', py: 10 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                Elevating Your Style Game
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
                Discover the perfect blend of comfort and trend with our exclusive collection.
            </Typography>
            <Stack
                direction="row"
                spacing={4}
                justifyContent="center"
                sx={{ flexWrap: 'wrap', gap: 4 }} // Use gap for better spacing on wrap
            >
                {categories.map((cat) => (
                    <Paper
                        key={cat.name}
                        onClick={() => navigate(cat.path)}
                        sx={{
                            width: 250,
                            height: 350,
                            borderRadius: 4,
                            overflow: 'hidden',
                            position: 'relative',
                            backgroundImage: `url(${cat.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            alignItems: 'flex-end',
                            p: 3,
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: (theme) => `0 10px 30px ${theme.palette.primary.main}33`,
                            },
                            // Adding a gradient overlay for text readability
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                height: '60%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                            }
                        }}
                    >
                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 600, zIndex: 1 }}>
                            {cat.name}
                        </Typography>
                    </Paper>
                ))}
            </Stack>
        </Container>
    </Box>
  );
};


export default FeaturedCategories;
