import React, { useState } from 'react';
import { X } from 'lucide-react';

const LeadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Lead added successfully!');
    setFormData({ name: '', email: '', phone: '', source: '', message: '' });
  };

  return (
    <div className="relative bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full max-w-lg mx-auto">
      {/* Close Icon */}
      <button
        type="button"
        className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
      >
        <X size={20} />
      </button>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Lead</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="9876543210"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lead Source</label>
          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Source</option>
            <option value="Email">Email</option>
            <option value="Phone Call">Phone Call</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Social Media">Social Media</option>
            <option value="SMS">SMS</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes / Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Add any relevant message here"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            rows={3}
          ></textarea>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-2 px-4 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition"
        >
          Submit Lead
        </button>
      </div>
    </div>
  );
};

export default LeadForm;