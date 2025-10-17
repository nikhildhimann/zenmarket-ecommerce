import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { initializeAuth } from './redux/authSlice';
import { Box } from '@mui/material';
import { CustomThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';

// --- Import All Your Components ---
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import ProtectedRoute from './component/ProtectedRoute';
import PublicRoute from './component/PublicRoute';
import AdminLayout from "./component/admin/AdminLayout";
import LandingPage from './pages/LandingPage';
import ProductList from './pages/product/ProductList';
import ProductDetails from './pages/product/ProductDetails';
import CartPage from "./pages/cart/CartPage";
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrderSuccessPage from './pages/order/OrderSuccessPage';
import WishlistPage from './pages/wishlist/WishlistPage';
import MyOrdersPage from './pages/order/MyOrdersPage';
import OrderDetailsPage from './pages/order/OrderDetailsPage';
import PaymentSuccessPage from './pages/payment/PaymentSuccessPage';
import PaymentFailurePage from './pages/payment/PaymentFailurePage';
import LoginPage from './pages/authPage/LoginPage';
import Register from './pages/authPage/Register';
import ResetPassword from './pages/authPage/ResetPassword';
import ProfilePage from './pages/authPage/ProfilePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import ProductDashboard from './pages/admin/ProductDashboard';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import AdminOrdersDashboard from './pages/admin/AdminOrdersDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import CouponDashboard from './pages/admin/CouponDashboard';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Router>
      <CustomThemeProvider>
        <SocketProvider>
          <Routes>
            {/* Main Site Layout using Outlet for nested routes */}
            <Route element={<MainSiteLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/resetpassword" element={<ResetPassword />} />

              <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
              <Route path="/order/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
              <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
              <Route path="/payment-failure" element={<ProtectedRoute><PaymentFailurePage /></ProtectedRoute>} />
            </Route>

            {/* Admin Site Layout */}
            <Route path="/admin">
              <Route path="login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
              <Route element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<ProductDashboard />} />
                <Route path="orders" element={<AdminOrdersDashboard />} />
                <Route path="coupons" element={<CouponDashboard />} />
                <Route path="product/new" element={<AddProduct />} />
                <Route path="product/edit/:id" element={<EditProduct />} />
              </Route>
            </Route>
          </Routes>
        </SocketProvider>
      </CustomThemeProvider>
    </Router>
  );
}

// Corrected layout for a "sticky footer"
const MainSiteLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, pt: isHomePage ? 0 : '64px' }}>
        <Outlet /> {/* Nested child routes will render here */}
      </Box>
      <Footer />
    </Box>
  );
};

export default App;

