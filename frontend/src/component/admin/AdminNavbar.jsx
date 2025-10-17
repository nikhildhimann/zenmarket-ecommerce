import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Admin Panel
        </Typography>
        <Box>
          {/* ✨ FIX: Re-added the Dashboard button */}
          <Button color="inherit" onClick={() => navigate('/admin/dashboard')}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate('/admin/products')}>
            Products
          </Button>
          <Button color="inherit" onClick={() => navigate('/admin/orders')}>Orders</Button>
          <Button color="inherit" onClick={() => navigate('/admin/coupons')}>Coupons</Button>
          <Button color="inherit" onClick={() => navigate('/')}>
            View Site
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;

