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
        {/* Root route: check for authentication or role */}
        <Route path="/" element={<Navigate to="/Salesdashboard" />} />  {/* Redirect to Salesdashboard for default */}

        <Route path="/login" element={<Login />} />
        <Route path="/salesdashboard" element={<Salesdashboard />} /> {/* Fixed the path case */}
        <Route path="/admindashboard" element={<AdminDashboard />} />  {/* Fixed the path case */}

        {/* Catch-all: redirect unknown URLs back to /salesdashboard */}
        <Route path="*" element={<Navigate to="/salesdashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
