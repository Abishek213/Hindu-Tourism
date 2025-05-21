
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const BookingContext = createContext();

// Custom hook to use the booking context
export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

// Provider component
export const BookingProvider = ({ children }) => {
  // State for all bookings
  const [bookings, setBookings] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(false);
  // State for error handling
  const [error, setError] = useState(null);
  // State for the booking being edited (if any)
  const [editingBooking, setEditingBooking] = useState(null);

  // Load bookings from localStorage on component mount
  useEffect(() => {
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      try {
        setBookings(JSON.parse(storedBookings));
      } catch (err) {
        setError('Failed to load bookings from storage');
        console.error('Error parsing bookings from localStorage:', err);
      }
    }
  }, []);

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Add a new booking
  const addBooking = (booking) => {
    setLoading(true);
    try {
      const newBooking = {
        ...booking,
        id: Date.now().toString(), // Simple unique ID generation
        createdAt: new Date().toISOString(),
      };
      setBookings([...bookings, newBooking]);
      setLoading(false);
      return newBooking;
    } catch (err) {
      setError('Failed to add booking');
      setLoading(false);
      throw err;
    }
  };

  // Update an existing booking
  const updateBooking = (id, updates) => {
    setLoading(true);
    try {
      const updatedBookings = bookings.map((booking) => 
        booking.id === id ? { ...booking, ...updates, updatedAt: new Date().toISOString() } : booking
      );
      setBookings(updatedBookings);
      setLoading(false);
      return updatedBookings.find(booking => booking.id === id);
    } catch (err) {
      setError('Failed to update booking');
      setLoading(false);
      throw err;
    }
  };

  // Delete a booking
  const deleteBooking = (id) => {
    setLoading(true);
    try {
      const filteredBookings = bookings.filter((booking) => booking.id !== id);
      setBookings(filteredBookings);
      setLoading(false);
      return true;
    } catch (err) {
      setError('Failed to delete booking');
      setLoading(false);
      throw err;
    }
  };

  // Get a single booking by ID
  const getBookingById = (id) => {
    return bookings.find((booking) => booking.id === id) || null;
  };

  // Start editing a booking
  const startEditing = (id) => {
    const bookingToEdit = getBookingById(id);
    setEditingBooking(bookingToEdit);
    return bookingToEdit;
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingBooking(null);
  };

  // Clear any errors
  const clearError = () => {
    setError(null);
  };

  // Value to be provided by the context
  const value = {
    bookings,
    loading,
    error,
    editingBooking,
    addBooking,
    updateBooking,
    deleteBooking,
    getBookingById,
    startEditing,
    cancelEditing,
    clearError,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;