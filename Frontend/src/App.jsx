import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MainLayout from './Components/layout/Mainlayout';
import Login from './Pages/Login';
import { BookingProvider } from './context/BookingContext';

import {
  salesDashboardConfig,
  adminDashboardConfig,
  operationDashboardConfig,
  accountDashboardConfig,
} from './Components/Dashboard/DashboardConfig';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  React.useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  return token ? children : null;
};

// Helper to render routes including nested children if any
const renderDashboardRoutes = (config) => {
  return Object.entries(config.tabs).map(([key, tab]) => {
    if (tab.children) {
      // If tab has children, render nested routes under that tab
      return (
        <Route key={key} path={key}>
          {/* Redirect from parent tab to its default child */}
          <Route
            index
            element={<Navigate to={`${key}/${Object.keys(tab.children)[0]}`} replace />}
          />
          {Object.entries(tab.children).map(([childKey, childTab]) => (
            <Route
              key={childKey}
              path={childKey}
              element={<childTab.component />}
            />
          ))}
        </Route>
      );
    }
    // No children: normal route
    return <Route key={key} path={key} element={<tab.component />} />;
  });
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Sales Dashboard */}
        
        <Route
          path="/salesdashboard/*"
          element={
            <ProtectedRoute>
             <BookingProvider>
        <MainLayout />
      </BookingProvider>
    </ProtectedRoute>
          }
        >
          {/* Redirect base salesdashboard to defaultTab */}
          <Route
            index
            element={<Navigate to={salesDashboardConfig.defaultTab} replace />}
          />
          {renderDashboardRoutes(salesDashboardConfig)}
        </Route>

        {/* Admin Dashboard */}
        <Route
          path="/admindashboard/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to={adminDashboardConfig.defaultTab} replace />}
          />
          {renderDashboardRoutes(adminDashboardConfig)}
        </Route>

        {/* Operation Dashboard */}
        <Route
          path="/ops/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to={operationDashboardConfig.defaultTab} replace />}
          />
          {renderDashboardRoutes(operationDashboardConfig)}
        </Route>

        {/* Accounts Dashboard */}
        <Route
          path="/account/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to={accountDashboardConfig.defaultTab} replace />}
          />
          {renderDashboardRoutes(accountDashboardConfig)}
        </Route>

        {/* Redirect any unknown routes to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;