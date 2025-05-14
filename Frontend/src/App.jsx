import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/login.jsx';
import Salesdashboard from './pages/dashboard/salesdashboard.jsx';
import AdminDashboard from './pages/dashboard/admindashboard.jsx';
import AddLead from './pages/leads/LeadAdd';
import BookingAdd from './pages/bookings/BookingAdd';
import SidebarLayout from './components/layout/SidebarLayout';
import ProtectedRoute from './components/protectedroute/protectedroute.jsx';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Admin Dashboard (Protected for Admin role) */}
      <Route
        path="/admindashboard"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Sales Agent Routes (Protected for Sales Agent role) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['Sales Agent']}>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/salesdashboard" element={<Salesdashboard />} />
        <Route path="/leads/add" element={<AddLead />} />
        <Route path="/bookings/new" element={<BookingAdd />} />
      </Route>

      {/* Default Routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
