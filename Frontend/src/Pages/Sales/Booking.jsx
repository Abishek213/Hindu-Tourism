// Booking.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BookingForm from '../../Components/SalesBooking/BookingForm';
import BookingList from './BookingList'; // Adjust if the path is different
import { BookingProvider } from '../../context/BookingContext'; // Make sure this path is correct

const Booking = ({ defaultTab = 'all' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const location = useLocation();

  // Update the active tab based on the URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/bookings/add')) {
      setActiveTab('add');
    } else if (path.includes('/bookings/all') || path.includes('/bookings')) {
      setActiveTab('all');
    }
  }, [location.pathname]);

  const handleTabChange = (e) => {
    setActiveTab(e.target.value);
  };

  return (
    <BookingProvider>
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <label htmlFor="bookingTab" className="sr-only">Booking Tabs</label>
          <select
            id="bookingTab"
            className="border rounded p-2"
            value={activeTab}
            onChange={handleTabChange}
          >
            <option value="all">All Bookings</option>
            <option value="add">Add Booking</option>
          </select>
        </div>

        {activeTab === 'all' ? <BookingList /> : <BookingForm />}
      </div>
    </BookingProvider>
  );
};

export default Booking;