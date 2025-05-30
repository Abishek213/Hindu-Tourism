import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../../api/auth';
import { toast } from 'react-toastify';

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [leads, setLeads] = useState([]);
  const [packages, setPackages] = useState([]);
  const [guides, setGuides] = useState([]);
  const [transports, setTransports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    lead_id: '',
    package_id: '',
    num_travelers: 1,
    travel_start_date: '',
    travel_end_date: '',
    guide_id: '',
    transport_id: '',
    special_requirements: '',
    services: {
      helicopter: false,
      hotel_upgrade: false,
      nurse_support: false,
    },
  });

  // Fetch all necessary data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch converted leads (potential customers)
        const leadsResponse = await api.get('/lead?status=converted');
        setLeads(leadsResponse.data);

        // Fetch active packages
        const packagesResponse = await api.get('/package?is_active=true');
        setPackages(packagesResponse.data);

        // Fetch active guides
        const guidesResponse = await api.get('/guide?is_active=true');
        setGuides(guidesResponse.data);

        // Fetch active transports
        const transportsResponse = await api.get('/transport?is_active=true');
        setTransports(transportsResponse.data);

        // Fetch all bookings
        const bookingsResponse = await api.get('/booking');
        setBookings(bookingsResponse.data);
      } catch (error) {
        toast.error('Failed to fetch data');
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleServiceChange = (service) => {
    setFormData({
      ...formData,
      services: {
        ...formData.services,
        [service]: !formData.services[service],
      },
    });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // If package is selected and start date changes, calculate end date
    if (name === 'travel_start_date' && formData.package_id) {
      const selectedPackage = packages.find(pkg => pkg._id === formData.package_id);
      if (selectedPackage) {
        const startDate = new Date(value);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + selectedPackage.duration_days);
        
        setFormData(prev => ({
          ...prev,
          travel_end_date: endDate.toISOString().split('T')[0],
        }));
      }
    }

    // If package changes, calculate end date based on start date
    if (name === 'package_id' && formData.travel_start_date) {
      const selectedPackage = packages.find(pkg => pkg._id === value);
      if (selectedPackage) {
        const startDate = new Date(formData.travel_start_date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + selectedPackage.duration_days);
        
        setFormData(prev => ({
          ...prev,
          travel_end_date: endDate.toISOString().split('T')[0],
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare services array for backend
      const selectedServices = Object.entries(formData.services)
        .filter(([_, value]) => value)
        .map(([key]) => ({
          service_id: key,
          price: 0 // You might want to set actual prices here
        }));

      // Create booking payload
      const bookingData = {
        ...formData,
        services: selectedServices,
        customer_id: leads.find(lead => lead._id === formData.lead_id)?.customer_id?._id
      };

      // Send to backend
      const response = await api.post('/booking', bookingData);
      
      // Update local state
      setBookings([...bookings, response.data.booking]);
      
      // Reset form
      setFormData({
        lead_id: '',
        package_id: '',
        num_travelers: 1,
        travel_start_date: '',
        travel_end_date: '',
        guide_id: '',
        transport_id: '',
        special_requirements: '',
        services: {
          helicopter: false,
          hotel_upgrade: false,
          nurse_support: false,
        },
      });

      toast.success('Booking created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create booking');
      console.error('Booking creation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/booking/${bookingId}/status`, { status: newStatus });
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));
      toast.success('Booking status updated');
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const handleAssignGuide = async (bookingId, guideId) => {
    try {
      await api.put(`/booking/${bookingId}/assignguide`, { guide_id: guideId });
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, guide_id: guideId } : booking
      ));
      toast.success('Guide assigned successfully');
    } catch (error) {
      toast.error('Failed to assign guide');
    }
  };

  const handleAssignTransport = async (bookingId, transportId) => {
    try {
      await api.put(`/booking/${bookingId}/assigntransport`, { transport_id: transportId });
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, transport_id: transportId } : booking
      ));
      toast.success('Transport assigned successfully');
    } catch (error) {
      toast.error('Failed to assign transport');
    }
  };

  const generateBookingPDF = async (bookingId) => {
    try {
      const response = await api.get(`/booking/${bookingId}/generatepdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `booking_${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">✍️ Booking Management</h2>

      {/* Create Booking Form */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Create New Booking</h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Lead Selection */}
          <div>
            <label className="block mb-1 font-medium">Select Converted Lead</label>
            <select
              name="lead_id"
              value={formData.lead_id}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Lead</option>
              {leads.map(lead => (
                <option key={lead._id} value={lead._id}>
                  {lead.name} ({lead.email})
                </option>
              ))}
            </select>
          </div>

          {/* Package Selection */}
          <div>
            <label className="block mb-1 font-medium">Select Package</label>
            <select
              name="package_id"
              value={formData.package_id}
              onChange={handleDateChange}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Package</option>
              {packages.map(pkg => (
                <option key={pkg._id} value={pkg._id}>
                  {pkg.title} ({pkg.duration_days} days)
                </option>
              ))}
            </select>
          </div>

          {/* Travel Dates */}
          <div>
            <label className="block mb-1 font-medium">Start Date</label>
            <input
              type="date"
              name="travel_start_date"
              value={formData.travel_start_date}
              onChange={handleDateChange}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">End Date</label>
            <input
              type="date"
              name="travel_end_date"
              value={formData.travel_end_date}
              onChange={handleDateChange}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              readOnly
            />
          </div>

          {/* Number of Travelers */}
          <div>
            <label className="block mb-1 font-medium">Number of Travelers</label>
            <input
              type="number"
              name="num_travelers"
              min="1"
              value={formData.num_travelers}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Guide Selection */}
          <div>
            <label className="block mb-1 font-medium">Assign Guide (Optional)</label>
            <select
              name="guide_id"
              value={formData.guide_id}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Guide</option>
              {guides.map(guide => (
                <option key={guide._id} value={guide._id}>
                  {guide.name} ({guide.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Transport Selection */}
          <div>
            <label className="block mb-1 font-medium">Assign Transport (Optional)</label>
            <select
              name="transport_id"
              value={formData.transport_id}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Transport</option>
              {transports.map(transport => (
                <option key={transport._id} value={transport._id}>
                  {transport.name} ({transport.type})
                </option>
              ))}
            </select>
          </div>

          {/* Special Requirements */}
          <div className="col-span-full">
            <label className="block mb-1 font-medium">Special Requirements</label>
            <textarea
              name="special_requirements"
              value={formData.special_requirements}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          {/* Optional Services */}
          <div className="col-span-full space-y-2">
            <p className="font-medium">Optional Services:</p>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.services.helicopter}
                  onChange={() => handleServiceChange('helicopter')}
                  className="cursor-pointer"
                />
                Helicopter Ride
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.services.hotel_upgrade}
                  onChange={() => handleServiceChange('hotel_upgrade')}
                  className="cursor-pointer"
                />
                Hotel Upgrade
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.services.nurse_support}
                  onChange={() => handleServiceChange('nurse_support')}
                  className="cursor-pointer"
                />
                Nurse Support
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-full">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : '✅ Create Booking'}
            </button>
          </div>
        </form>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded shadow overflow-auto">
        <h2 className="text-xl font-semibold p-4">📋 All Bookings</h2>
        <table className="min-w-full border-collapse border border-gray-300 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Booking ID</th>
              <th className="border border-gray-300 px-4 py-2">Customer</th>
              <th className="border border-gray-300 px-4 py-2">Package</th>
              <th className="border border-gray-300 px-4 py-2">Dates</th>
              <th className="border border-gray-300 px-4 py-2">Travelers</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Guide</th>
              <th className="border border-gray-300 px-4 py-2">Transport</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && bookings.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{booking._id.slice(-6)}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {booking.customer_id?.name || 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {booking.package_id?.title || 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {format(new Date(booking.travel_start_date), 'dd MMM yyyy')} - {' '}
                    {format(new Date(booking.travel_end_date), 'dd MMM yyyy')}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{booking.num_travelers}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className="border rounded px-2 py-1 capitalize"
                    >
                      {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <select
                      value={booking.guide_id || ''}
                      onChange={(e) => handleAssignGuide(booking._id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">None</option>
                      {guides.map((guide) => (
                        <option key={guide._id} value={guide._id}>
                          {guide.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <select
                      value={booking.transport_id || ''}
                      onChange={(e) => handleAssignTransport(booking._id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">None</option>
                      {transports.map((transport) => (
                        <option key={transport._id} value={transport._id}>
                          {transport.name} ({transport.type})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => generateBookingPDF(booking._id)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      title="Generate PDF"
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center text-gray-500 py-6">
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