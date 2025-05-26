import React, { useState } from 'react';
import { format } from 'date-fns';

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    leadName: '',
    package: '',
    travelers: 1,
    travelDate: '',
    guide: '',
    transportTeam: '',
    kycDocs: [],
    optionalServices: {
      helicopter: false,
      hotelUpgrade: false,
      nurseSupport: false,
    },
  });

  const handleFileUpload = (e) => {
    setFormData({
      ...formData,
      kycDocs: Array.from(e.target.files),
    });
  };

  const handleCheckboxChange = (field) => {
    setFormData((prev) => ({
      ...prev,
      optionalServices: {
        ...prev.optionalServices,
        [field]: !prev.optionalServices[field],
      },
    }));
  };

  const handleSubmit = () => {
    const newBooking = {
      id: `BK${bookings.length + 1}`.padStart(5, '0'),
      ...formData,
    };
    setBookings([...bookings, newBooking]);
    setFormData({
      leadName: '',
      package: '',
      travelers: 1,
      travelDate: '',
      guide: '',
      transportTeam: '',
      kycDocs: [],
      optionalServices: {
        helicopter: false,
        hotelUpgrade: false,
        nurseSupport: false,
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">✍️ New Booking</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Lead Name', value: formData.leadName, name: 'leadName', type: 'text' },
            { label: 'Package', value: formData.package, name: 'package', type: 'select', options: ['', 'Pashupatinath', 'Muktinath', 'Both'] },
            { label: 'Number of Travelers', value: formData.travelers, name: 'travelers', type: 'number', min: 1 },
            { label: 'Travel Date', value: formData.travelDate, name: 'travelDate', type: 'date' },
            { label: 'Assign Guide', value: formData.guide, name: 'guide', type: 'text' },
            { label: 'Transport Team', value: formData.transportTeam, name: 'transportTeam', type: 'text' },
          ].map(({ label, value, name, type, options, min }) => (
            <div key={name} className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
              {type === 'select' ? (
                <select
                  value={value}
                  onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Package</option>
                  {options.slice(1).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  min={min}
                  value={value}
                  onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}

          <div className="md:col-span-2 flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Upload KYC Documents</label>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.png"
              onChange={handleFileUpload}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Optional Services</label>
            <div className="flex flex-wrap gap-4">
              {[
                { label: 'Helicopter Ride', field: 'helicopter' },
                { label: 'Hotel Upgrade', field: 'hotelUpgrade' },
                { label: 'Nurse Support', field: 'nurseSupport' },
              ].map(({ label, field }) => (
                <label key={field} className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.optionalServices[field]}
                    onChange={() => handleCheckboxChange(field)}
                    className="accent-blue-600"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            ✅ Create Booking
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 All Bookings</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-700 font-semibold">
              <tr>
                {['ID', 'Lead', 'Package', 'Travelers', 'Date', 'Guide', 'Transport', 'Services'].map((header) => (
                  <th key={header} className="px-4 py-2 border border-gray-200 text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((b, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{b.id}</td>
                    <td className="px-4 py-2 border">{b.leadName}</td>
                    <td className="px-4 py-2 border">{b.package}</td>
                    <td className="px-4 py-2 border">{b.travelers}</td>
                    <td className="px-4 py-2 border">
                      {b.travelDate ? format(new Date(b.travelDate), 'dd MMM yyyy') : '-'}
                    </td>
                    <td className="px-4 py-2 border">{b.guide}</td>
                    <td className="px-4 py-2 border">{b.transportTeam}</td>
                    <td className="px-4 py-2 border">
                      {Object.entries(b.optionalServices)
                        .filter(([_, value]) => value)
                        .map(([key]) =>
                          key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())
                        )
                        .join(', ') || 'None'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-6">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBooking;
