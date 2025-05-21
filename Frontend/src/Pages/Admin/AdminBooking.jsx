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
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">✍️ New Booking</h2>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Create Booking from Lead</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Lead Name"
            value={formData.leadName}
            onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={formData.package}
            onChange={(e) => setFormData({ ...formData, package: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Package</option>
            <option value="Pashupatinath">Pashupatinath</option>
            <option value="Muktinath">Muktinath</option>
            <option value="Both">Both</option>
          </select>

          <input
            type="number"
            min="1"
            placeholder="Number of Travelers"
            value={formData.travelers}
            onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            value={formData.travelDate}
            onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Assign Guide"
            value={formData.guide}
            onChange={(e) => setFormData({ ...formData, guide: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Transport Team"
            value={formData.transportTeam}
            onChange={(e) => setFormData({ ...formData, transportTeam: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="col-span-1 md:col-span-2">
            <label className="block mb-1 font-medium">Upload KYC Docs</label>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.png"
              onChange={handleFileUpload}
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div className="col-span-1 md:col-span-2 space-y-2">
            <p className="font-medium">Optional Services:</p>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.optionalServices.helicopter}
                  onChange={() => handleCheckboxChange('helicopter')}
                  className="cursor-pointer"
                />
                Helicopter Ride
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.optionalServices.hotelUpgrade}
                  onChange={() => handleCheckboxChange('hotelUpgrade')}
                  className="cursor-pointer"
                />
                Hotel Upgrade
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.optionalServices.nurseSupport}
                  onChange={() => handleCheckboxChange('nurseSupport')}
                  className="cursor-pointer"
                />
                Nurse Support
              </label>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            >
              ✅ Create Booking
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-10">📋 All Bookings</h2>
      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full border-collapse border border-gray-300 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Lead</th>
              <th className="border border-gray-300 px-4 py-2">Package</th>
              <th className="border border-gray-300 px-4 py-2">Travelers</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Guide</th>
              <th className="border border-gray-300 px-4 py-2">Transport</th>
              <th className="border border-gray-300 px-4 py-2">Services</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{b.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{b.leadName}</td>
                  <td className="border border-gray-300 px-4 py-2">{b.package}</td>
                  <td className="border border-gray-300 px-4 py-2">{b.travelers}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {b.travelDate ? format(new Date(b.travelDate), 'dd MMM yyyy') : '-'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{b.guide}</td>
                  <td className="border border-gray-300 px-4 py-2">{b.transportTeam}</td>
                  <td className="border border-gray-300 px-4 py-2">
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
  );
};

export default AdminBooking;
