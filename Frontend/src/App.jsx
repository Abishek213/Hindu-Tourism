// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/login.jsx';
import Unauthorized from './pages/unauthorized/unauthorized.jsx';
import Salesdashboard from './pages/dashboard/salesdashboard.jsx';
import AdminDashboard from './pages/dashboard/admindashboard.jsx';
import AddLead from './pages/leads/LeadAdd';
import BookingAdd from './pages/bookings/BookingAdd';
import SidebarLayout from './components/layout/SidebarLayout';

const App = () => {
  return (
    
      <Routes>
        {/* Redirect the root URL to salesdashboard */}
        <Route path="/" element={<Navigate to="/salesdashboard" replace />} />

        
  {/* Unauthorized Page */}
  <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />

        {/* All these routes share the SidebarLayout */}
        <Route element={<SidebarLayout />}>
          <Route path="/salesdashboard" element={<Salesdashboard />} />
          <Route path="/leads/add" element={<AddLead />} />
          <Route path="/bookings/new" element={<BookingAdd />} />
        </Route>

        {/* Fallback: any unknown URL goes to salesdashboard */}
        <Route path="*" element={<Navigate to="/salesdashboard" replace />} />
      </Routes>
  
  );
};

export default App;
