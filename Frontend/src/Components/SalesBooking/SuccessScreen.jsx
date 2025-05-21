import React from 'react';
import { CheckCircle } from 'lucide-react';

/**
 * SuccessScreen component to display a success message after a booking is completed
 * 
 * @param {Object} props
 * @param {string} props.message - The success message to display
 * @param {string} props.title - The title of the success message
 * @param {Function} props.onNewBooking - Function to handle creating a new booking
 * @param {boolean} props.showButton - Whether to show the new booking button
 * @param {string} props.buttonText - Text for the new booking button
 */
const SuccessScreen = ({ 
  message = "Your booking has been successfully submitted.",
  title = "Booking Completed!",
  onNewBooking = () => {},
  showButton = true,
  buttonText = "Create New Booking"
}) => {
  return (
    <div className="max-w-xl mx-auto p-8 text-center bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center justify-center gap-4">
        <CheckCircle size={64} className="text-green-500" />
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600">{message}</p>
        {showButton && (
          <button 
            onClick={onNewBooking} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessScreen;