import React, { useState } from 'react';
import { X } from 'lucide-react'; // Make sure you have lucide-react installed

const BookingForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    destination: '',
    travelDate: '',
    packageType: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
    console.log('Booking submitted:', formData);
    setFormData({
      customerName: '',
      phone: '',
      email: '',
      destination: '',
      travelDate: '',
      packageType: '',
      notes: ''
    });
  };

  return (
    <div className="relative bg-white p-6 rounded-xl shadow-md border border-gray-100 w-full max-w-lg mx-auto">
      {/* Close Icon */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          <X size={20} />
        </button>
      )}

      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Booking</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Destination</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">Travel Date</label>
            <input
              type="date"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">Package Type</label>
            <select
              name="packageType"
              value={formData.packageType}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            rows="3"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700"
        >
          Submit Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
