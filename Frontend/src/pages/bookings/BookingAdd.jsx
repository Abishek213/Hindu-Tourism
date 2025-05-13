import React, { useState } from 'react';
import BookingForm from '@components/Bookings/BookingForm';

const BookingAdd = () => {
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = (data) => {
    console.log('Booking data submitted:', data);
    // post to API here if needed
  };

  return (
    <div className="p-6">
      {showForm ? (
        <BookingForm onSubmit={handleSubmit} onClose={() => setShowForm(false)} />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="text-orange-600 underline"
        >
          Open Booking Form
        </button>
      )}
    </div>
  );
};

export default BookingAdd;
