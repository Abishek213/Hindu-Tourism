import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import './App.css';

// Import your components
import Login from './pages/login/login.jsx';
import Salesdashboard from './pages/dashboard/salesdashboard.jsx';
import AdminDashboard from './pages/dashboard/admindashboard.jsx';
import AddLead from './pages/leads/LeadAdd';
import Sidebar from '@components/layout/Sidebar';
import BookingAdd from '@pages/bookings/BookingAdd';

const App = () => {
  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
       <div className="flex-1 p-6 ml-64 overflow-auto">  {/* ml-64 creates space for the sidebar */}
        <Routes>
          <Route path="/" element={<Navigate to="/salesdashboard" />} />  {/* Default redirect to Salesdashboard */}
          <Route path="/login" element={<Login />} />
          <Route path="/salesdashboard" element={<Salesdashboard />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/leads/add" element={<AddLead />} />
          <Route path="/bookings/new" element={<BookingAdd />} />
          <Route path="*" element={<Navigate to="/salesdashboard" replace />} />  {/* Catch-all */}
        </Routes>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
