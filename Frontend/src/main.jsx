import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import './App.css';

import Login from './pages/login/login.jsx';
import Salesdashboard from './pages/dashboard/salesdashboard.jsx';
import AdminDashboard from './pages/dashboard/admindashboard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Root route: renders AdminDashboard at "/" */}
        <Route path="/" element={<AdminDashboard />} />

        <Route path="/login" element={<Login />} />
        <Route path="/Salesdashboard" element={<Salesdashboard />} />
        <Route path="/Admindashboard" element={<AdminDashboard />} />

        {/* Catch-all: redirect unknown URLs back to "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
