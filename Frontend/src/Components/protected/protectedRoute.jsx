// ProtectedRoute.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const roleToDashboard = {
  admin: '/admindashboard',
  'sales agent': '/salesdashboard',
  'operation team': '/ops',
  accountant: '/account',
};

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const userRoleRaw = localStorage.getItem('userRole') || '';
  const userRole = userRoleRaw.toLowerCase();

  React.useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const allowedDashboard = roleToDashboard[userRole];
    if (!allowedDashboard) {
      // If role is invalid or missing, logout user and redirect to login
      localStorage.clear();
      navigate('/login', { replace: true });
      return;
    }

    // If user tries to access a route outside their dashboard, redirect
    if (!location.pathname.startsWith(allowedDashboard)) {
      navigate(allowedDashboard, { replace: true });
    }
  }, [token, userRole, location.pathname, navigate]);

  return token ? children : null;
};

export default ProtectedRoute;
