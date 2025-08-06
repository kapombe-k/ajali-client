import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Assuming you have a custom hook for auth

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth(); // Get auth status

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  return <Outlet />; // Render the protected content
};

export default ProtectedRoute;