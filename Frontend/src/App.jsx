// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/login.jsx';
import Salesdashboard from './pages/dashboard/salesdashboard.jsx';
import AdminDashboard from './pages/dashboard/admindashboard.jsx';
import AddLead from './pages/leads/LeadAdd';
import BookingAdd from './pages/bookings/BookingAdd';
import SidebarLayout from './components/layout/SidebarLayout'; // You'll create this

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/salesdashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admindashboard" element={<AdminDashboard />} />

      {/* Routes that should have a sidebar */}
      <Route element={<SidebarLayout />}>
        <Route path="/salesdashboard" element={<Salesdashboard />} />
        <Route path="/leads/add" element={<AddLead />} />
        <Route path="/bookings/new" element={<BookingAdd />} />
      </Route>

      <Route path="*" element={<Navigate to="/salesdashboard" replace />} />
    </Routes>
  );
};

export default App;
