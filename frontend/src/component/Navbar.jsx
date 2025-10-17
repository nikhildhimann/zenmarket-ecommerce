import React, { useState } from 'react';
import {
    AppBar, Box, Toolbar, Typography, IconButton, Badge, Drawer,
    List, ListItem, ListItemButton, ListItemText, Divider, useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import { useThemeContext } from '../context/ThemeContext';

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const { toggleTheme } = useThemeContext();

    const { user } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart || {});

    const isHomePage = location.pathname === '/';
    const cartItemCount = items ? items.reduce((count, item) => count + item.quantity, 0) : 0;

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        handleDrawerToggle();
    };

    // Helper to create a navigation link, closing the drawer on click
    const navLink = (path, text) => (
        <ListItem disablePadding>
            <ListItemButton component={Link} to={path} onClick={handleDrawerToggle}>
                <ListItemText primary={text.toUpperCase()} />
            </ListItemButton>
        </ListItem>
    );

    const drawerContent = (
        <Box
            sx={{ width: 250, height: '100%', bgcolor: 'background.paper' }}
            role="presentation"
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Typography variant="h6">MENU</Typography>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />
            <List>
                {navLink('/', 'Home')}
                {navLink('/products', 'Products')}
                {user && navLink('/my-orders', 'My Orders')}
                {user && navLink('/wishlist', 'Wishlist')}
                {user && navLink('/profile', 'My Profile')}
                {!user && navLink('/login', 'Login')}
                {!user && navLink('/register', 'Register')}
                {user && (
                     <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout} sx={{ '& .MuiListItemText-primary': { color: 'error.main' } }}>
                            <ListItemText primary="LOGOUT" />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    // Conditional background color
                    backgroundColor: isHomePage ? 'transparent' : 'background.paper',
                    // Add blur effect only on the homepage
                    backdropFilter: isHomePage ? 'blur(5px)' : 'none',
                    transition: 'background-color 0.3s ease-in-out',
                    // Use theme's text color on other pages, white on homepage
                    color: isHomePage ? '#fff' : 'text.primary',
                    // Hover effect for homepage navbar
                    '&:hover': {
                        backgroundColor: isHomePage ? 'rgba(0,0,0,0.7)' : 'background.paper',
                    },
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {/* Left Icon: Menu */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Centered Logo */}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            cursor: 'pointer',
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)'
                        }}
                        onClick={() => navigate('/')}
                    >
                        ZenMarket
                    </Typography>

                    {/* Right Icons: Theme Toggle and Cart */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
                            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                        <IconButton color="inherit" onClick={() => navigate('/cart')}>
                            <Badge badgeContent={cartItemCount} color="error">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            
            {/* Slide-out Drawer Menu */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        bgcolor: 'background.default',
                        borderRight: 'none'
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Navbar;

