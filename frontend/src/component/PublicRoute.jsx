import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (token) {
    // If user is logged in, redirect them
    if (user?.role === 'admin') {
      return <Navigate to="/admin/products" replace />;
    } else {
      return <Navigate to="/profile" replace />;
    }
  }

  // If not logged in, show the page (e.g., Login, Register)
  return children;
};

export default PublicRoute;