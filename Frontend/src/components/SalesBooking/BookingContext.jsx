import { createContext, useState, useContext, useEffect } from 'react';

// Create a context for booking data
const BookingContext = createContext();

export function BookingProvider({ children }) {
  // Try to load existing bookings from localStorage
  const [bookings, setBookings] = useState(() => {
    try {
      const savedBookings = localStorage.getItem('bookings');
      return savedBookings ? JSON.parse(savedBookings) : [];
    } catch (error) {
      console.error("Error loading bookings from localStorage:", error);
      return [];
    }
  });

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('bookings', JSON.stringify(bookings));
    } catch (error) {
      console.error("Error saving bookings to localStorage:", error);
    }
  }, [bookings]);

  // Function to add a new booking
  const addBooking = (booking) => {
    if (!booking) {
      console.error("Cannot add empty booking");
      return null;
    }
    
    // Add the current date and time to the booking
    const bookingWithTimestamp = {
      ...booking,
      id: Date.now(), // Use timestamp as unique ID
      createdAt: new Date().toISOString()
    };
    
    setBookings(prevBookings => [...prevBookings, bookingWithTimestamp]);
    return bookingWithTimestamp.id; // Return the ID of the new booking
  };

  // Function to get a specific booking by ID
  const getBooking = (id) => {
    if (!id) return null;
    return bookings.find(booking => booking.id === Number(id) || booking.id === id);
  };

  // Function to delete a booking
  const deleteBooking = (id) => {
    if (!id) return;
    setBookings(prevBookings => prevBookings.filter(booking => booking.id !== Number(id) && booking.id !== id));
  };

  // Create the context value object
  const contextValue = {
    bookings,
    addBooking,
    getBooking,
    deleteBooking
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
}

// Custom hook to use the booking context
export function useBookings() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
}