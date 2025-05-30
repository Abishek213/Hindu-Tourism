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