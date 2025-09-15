import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth(); // Get auth status

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  return <Outlet />; // Render the protected content
};

export default ProtectedRoute;