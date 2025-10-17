import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { token, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the route is admin-only and the user is not an admin
  if (adminOnly && user?.role !== 'admin') {
    // Logged in but not an admin, redirect to home or a "not authorized" page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;