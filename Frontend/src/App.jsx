import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './Components/layout/Mainlayout';
import Login from './Pages/Login';
import Settings from './Pages/Settings';
import { BookingProvider } from './context/BookingContext';
import ProtectedRoute from './Components/protected/protectedRoute';

import {
  salesDashboardConfig,
  adminDashboardConfig,
  operationDashboardConfig,
  accountDashboardConfig,
} from './Components/Dashboard/DashboardConfig';

const renderDashboardRoutes = (config) => {
  return Object.entries(config.tabs).map(([key, tab]) => {
    if (tab.children) {
      return (
        <Route key={key} path={key}>
          <Route
            index
            element={<Navigate to={`${key}/${Object.keys(tab.children)[0]}`} replace />}
          />
          {Object.entries(tab.children).map(([childKey, childTab]) => (
            <Route key={childKey} path={childKey} element={<childTab.component />} />
          ))}
          {/* Catch-all route for invalid child paths */}
          <Route path="*" element={<Navigate to={`../${key}/${Object.keys(tab.children)[0]}`} replace />} />
        </Route>
      );
    }
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
          <Route index element={<Navigate to={salesDashboardConfig.defaultTab} replace />} />
          {renderDashboardRoutes(salesDashboardConfig)}
          <Route path="settings" element={<Settings />} />
          {/* Catch-all for invalid salesdashboard routes */}
          <Route path="*" element={<Navigate to={salesDashboardConfig.defaultTab} replace />} />
        </Route>

        {/* Admin Dashboard */}
        <Route
          path="/admindashboard/*"
          element={
            <ProtectedRoute>
              <BookingProvider>
                <MainLayout />
              </BookingProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={adminDashboardConfig.defaultTab} replace />} />
          {renderDashboardRoutes(adminDashboardConfig)}
          <Route path="settings" element={<Settings />} />
          {/* Catch-all for invalid admindashboard routes */}
          <Route path="*" element={<Navigate to={adminDashboardConfig.defaultTab} replace />} />
        </Route>

        {/* Operation Dashboard */}
        <Route
          path="/ops/*"
          element={
            <ProtectedRoute>
              <BookingProvider>
                <MainLayout />
              </BookingProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={operationDashboardConfig.defaultTab} replace />} />
          {renderDashboardRoutes(operationDashboardConfig)}
          <Route path="settings" element={<Settings />} />
          {/* Catch-all for invalid ops routes */}
          <Route path="*" element={<Navigate to={operationDashboardConfig.defaultTab} replace />} />
        </Route>

        {/* Accounts Dashboard */}
        <Route
          path="/account/*"
          element={
            <ProtectedRoute>
              <BookingProvider>
                <MainLayout />
              </BookingProvider>
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to={accountDashboardConfig.defaultTab} replace />}
          />
          {renderDashboardRoutes(accountDashboardConfig)}
          <Route path="settings" element={<Settings />} />
          {/* Catch-all for invalid account routes */}
          <Route path="*" element={<Navigate to={accountDashboardConfig.defaultTab} replace />} />
        </Route>

        {/* Redirect unknown routes to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;