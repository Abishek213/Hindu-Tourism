
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/login.jsx';
import Salesdashboard from './pages/dashboard/salesdashboard.jsx';
import AdminDashboard from './pages/dashboard/admindashboard.jsx';
import AddLead from './pages/leads/LeadAdd';
import BookingAdd from './pages/bookings/BookingAdd';
import SidebarLayout from './components/layout/SidebarLayout';
import ProtectedRoute from './components/protectedroute/protectedroute.jsx';
import PublicRoute from './components/publicroute/publicroute.jsx'; // ✅ import this

const App = () => {
  return (
    <Routes>
      {/* ✅ Public Route with redirection if already logged in */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* ✅ Admin Dashboard (Protected for Admin role) */}
      <Route
        path="/admindashboard"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ Sales Agent Routes (Protected for Sales Agent role) */}
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

      {/* ✅ Default route — redirect to login or dashboard based on token */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Navigate to="/login" />
          </PublicRoute>
        }
      />

      {/* ✅ Catch-all unknown routes */}
      <Route
        path="*"
        element={
          <PublicRoute>
            <Navigate to="/login" />
          </PublicRoute>
        }
      />
    </Routes>
  );
};

export default App;
