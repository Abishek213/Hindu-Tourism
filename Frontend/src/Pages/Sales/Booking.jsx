import React, { useState,  } from 'react';
import BookingFormOverlay from '../../Components/SalesBooking/BookingForm';
import BookingList from './BookingList';

const Booking = () => {
  const [showForm, setShowForm] = useState(false);

  const handleAddBooking = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleBookingSubmitted = () => {
    setShowForm(false);
  };

  return (
    <div className=" bg-white rounded-lg shadow-md">
      {/* Always show the booking list */}
      <BookingList onAddBooking={handleAddBooking} />
      
      {/* Show overlay form when needed */}
      <BookingFormOverlay 
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmitted={handleBookingSubmitted}
      />
    </div>
  );
};

export default Booking;