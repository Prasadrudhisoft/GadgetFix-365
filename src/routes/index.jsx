import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AdminPage from '../pages/AdminPage';
import { useAuth } from '../hooks/useAuth';

const AppRoutes = () => {
  const { user, isLoggedIn, isLoading } = useAuth(); 

  if (isLoading) {
    return null; 
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/admin"
        element={
          isLoggedIn && user?.role === 'admin'
            ? <AdminPage />
            : <Navigate to="/" replace />
        }
      />
    </Routes>
  );
};

export default AppRoutes;