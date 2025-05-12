import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import './App.css';

import Login from './pages/login/login.jsx';
import Salesdashboard from './pages/dashboard/salesdashboard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Salesdashboard" element={<Salesdashboard />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);
