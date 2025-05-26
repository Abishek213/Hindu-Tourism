import { useState } from "react";

export default function AssignTeamPage() {
  const [assigningGuideFor, setAssigningGuideFor] = useState(null);
  const [assigningTransportFor, setAssigningTransportFor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample confirmed bookings that need assignments
  const [confirmedBookings, setConfirmedBookings] = useState([
    {
      id: "1",
      bookingRef: "TK-2024-001",
      customerName: "John Doe",
      tourName: "Himalayan Trek Adventure",
      startDate: "2024-06-15",
      endDate: "2024-06-20",
      duration: "5 days",
      location: "Himalayas, Nepal",
      groupSize: 8,
      totalAmount: "$2,500",
      status: "Confirmed",
      hasGuide: false,
      hasTransport: false,
      notes: "High altitude trek - experienced guide required"
    },
    {
      id: "2",
      bookingRef: "TK-2024-002",
      customerName: "Sarah Wilson",
      tourName: "City Heritage Walk",
      startDate: "2024-06-10",
      endDate: "2024-06-10",
      duration: "1 day",
      location: "Old City, Kathmandu",
      groupSize: 4,
      totalAmount: "$200",
      status: "Confirmed",
      hasGuide: false,
      hasTransport: false,
      notes: "Cultural tour focusing on heritage sites"
    },
    {
      id: "3",
      bookingRef: "TK-2024-003",
      customerName: "Mike Johnson",
      tourName: "Mountain Bike Adventure",
      startDate: "2024-06-25",
      endDate: "2024-06-27",
      duration: "3 days",
      location: "Pokhara Valley",
      groupSize: 6,
      totalAmount: "$800",
      status: "Confirmed",
      hasGuide: true,
      hasTransport: false,
      notes: "Adventure tour with bike rental included"
    },
    {
      id: "4",
      bookingRef: "TK-2024-004",
      customerName: "Emily Chen",
      tourName: "Wildlife Safari",
      startDate: "2024-07-01",
      endDate: "2024-07-03",
      duration: "3 days",
      location: "Chitwan National Park",
      groupSize: 12,
      totalAmount: "$1,200",
      status: "Confirmed",
      hasGuide: false,
      hasTransport: true,
      notes: "Family friendly safari experience"
    }
  ]);

  // Available guides and transports
  const [availableGuides] = useState([
    { id: "1", name: "John Smith", age: "32", email: "john@example.com", phone: "123-456-7890", experience: "5 years", specialization: "Mountain Tours" },
    { id: "2", name: "Sarah Johnson", age: "28", email: "sarah@example.com", phone: "098-765-4321", experience: "3 years", specialization: "City Tours" },
    { id: "3", name: "Mike Davis", age: "35", email: "mike@example.com", phone: "555-123-4567", experience: "7 years", specialization: "Adventure Tours" }
  ]);

  const [availableTransports] = useState([
    { id: "1", vehicleName: "Luxury Coach A1", vehicleType: "Bus", vehicleCategory: "luxury" },
    { id: "2", vehicleName: "Premium Van B2", vehicleType: "Van", vehicleCategory: "premium" },
    { id: "3", vehicleName: "Delux Sedan C3", vehicleType: "Car", vehicleCategory: "delux" }
  ]);

  const [assignedGuides, setAssignedGuides] = useState([]);
  const [assignedTransports, setAssignedTransports] = useState([]);

  const [guideAssignment, setGuideAssignment] = useState({
    selectedId: ""
  });

  const [transportAssignment, setTransportAssignment] = useState({
    selectedId: ""
  });

  const handleGuideAssignmentChange = (e) => {
    const { name, value } = e.target;
    setGuideAssignment(prev => ({ ...prev, [name]: value }));
  };

  const handleTransportAssignmentChange = (e) => {
    const { name, value } = e.target;
    setTransportAssignment(prev => ({ ...prev, [name]: value }));
  };

  const handleAssignGuide = (bookingId) => {
    const selectedGuide = availableGuides.find(g => g.id === guideAssignment.selectedId);
    const selectedBooking = confirmedBookings.find(b => b.id === bookingId);
    
    if (selectedGuide && selectedBooking) {
      const assignment = {
        id: Date.now().toString(),
        guide: selectedGuide,
        booking: selectedBooking,
        status: "Active",
        assignedDate: new Date().toISOString().split('T')[0]
      };
      
      setAssignedGuides(prev => [...prev, assignment]);
      
      // Update booking to show it has a guide
      setConfirmedBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, hasGuide: true }
          : booking
      ));
      
      setGuideAssignment({ selectedId: "" });
      setAssigningGuideFor(null);
    }
  };

  const handleAssignTransport = (bookingId) => {
    const selectedTransport = availableTransports.find(t => t.id === transportAssignment.selectedId);
    const selectedBooking = confirmedBookings.find(b => b.id === bookingId);
    
    if (selectedTransport && selectedBooking) {
      const assignment = {
        id: Date.now().toString(),
        transport: selectedTransport,
        booking: selectedBooking,
        status: "Active",
        assignedDate: new Date().toISOString().split('T')[0]
      };
      
      setAssignedTransports(prev => [...prev, assignment]);
      
      // Update booking to show it has transport
      setConfirmedBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, hasTransport: true }
          : booking
      ));
      
      setTransportAssignment({ selectedId: "" });
      setAssigningTransportFor(null);
    }
  };

  const handleRemoveGuide = (bookingId) => {
    const assignment = assignedGuides.find(a => a.booking.id === bookingId);
    if (assignment) {
      setAssignedGuides(prev => prev.filter(item => item.id !== assignment.id));
      setConfirmedBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, hasGuide: false }
          : booking
      ));
    }
  };

  const handleRemoveTransport = (bookingId) => {
    const assignment = assignedTransports.find(a => a.booking.id === bookingId);
    if (assignment) {
      setAssignedTransports(prev => prev.filter(item => item.id !== assignment.id));
      setConfirmedBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, hasTransport: false }
          : booking
      ));
    }
  };

  const getAssignedGuide = (bookingId) => {
    const assignment = assignedGuides.find(a => a.booking.id === bookingId);
    return assignment ? assignment.guide : null;
  };

  const getAssignedTransport = (bookingId) => {
    const assignment = assignedTransports.find(a => a.booking.id === bookingId);
    return assignment ? assignment.transport : null;
  };

  // Filter bookings based on search query
  const filteredBookings = confirmedBookings.filter(booking => 
    booking.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.tourName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-orange-800 mb-2">Assign Team Members</h1>
        <p className="text-gray-600 text-lg">Assign guides and transport to confirmed bookings</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings by reference, customer, tour, or location..."
              className="block w-full pl-10 pr-3 py-3 border border-orange-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Confirmed Bookings Table */}
      <div className="bg-white rounded-xl shadow-xl border border-orange-100 overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-orange-500 to-amber-500 border-b border-orange-200">
          <h2 className="text-2xl font-bold text-white">Confirmed Bookings</h2>
          <p className="text-orange-100 mt-1">
            {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'} found
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Booking Details</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Schedule</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Guide</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Transport</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center">
                    <div className="text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-1.01-6-2.709M6.343 14.657L4.93 16.07M19.071 8.929l-1.414 1.414" />
                      </svg>
                      <p className="text-lg font-medium">No bookings found</p>
                      <p className="text-sm">Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-orange-25 transition-colors duration-150">
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-gray-900">{booking.tourName}</div>
                        <div className="text-sm text-orange-600 font-medium">Ref: {booking.bookingRef}</div>
                        <div className="text-sm text-gray-600">{booking.location}</div>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {booking.groupSize} people
                          </span>
                          <span className="text-orange-600 font-medium">{booking.totalAmount}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-gray-900">{booking.customerName}</div>
                        <span className="inline-flex px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {booking.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">{booking.startDate}</div>
                        <div className="text-sm text-gray-500">to {booking.endDate}</div>
                        <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded font-medium inline-block">
                          {booking.duration}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {booking.hasGuide ? (
                        <div className="space-y-2">
                          <div className="text-sm font-semibold text-gray-900">
                            {getAssignedGuide(booking.id)?.name}
                          </div>
                          <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            {getAssignedGuide(booking.id)?.specialization}
                          </div>
                          <button
                            onClick={() => handleRemoveGuide(booking.id)}
                            className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors duration-150"
                          >
                            Remove Guide
                          </button>
                        </div>
                      ) : assigningGuideFor === booking.id ? (
                        <div className="space-y-3">
                          <select
                            name="selectedId"
                            value={guideAssignment.selectedId}
                            onChange={handleGuideAssignmentChange}
                            className="w-full p-3 border border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 focus:border-transparent shadow-sm"
                          >
                            <option value="">Select Guide</option>
                            {availableGuides.map(guide => (
                              <option key={guide.id} value={guide.id}>
                                {guide.name} - {guide.specialization}
                              </option>
                            ))}
                          </select>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAssignGuide(booking.id)}
                              className="flex-1 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors duration-150 shadow-sm"
                            >
                              Assign
                            </button>
                            <button
                              onClick={() => {
                                setAssigningGuideFor(null);
                                setGuideAssignment({ selectedId: "" });
                              }}
                              className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors duration-150 shadow-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAssigningGuideFor(booking.id)}
                          className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors duration-150 shadow-sm"
                        >
                          Assign Guide
                        </button>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      {booking.hasTransport ? (
                        <div className="space-y-2">
                          <div className="text-sm font-semibold text-gray-900">
                            {getAssignedTransport(booking.id)?.vehicleName}
                          </div>
                          <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            {getAssignedTransport(booking.id)?.vehicleType}
                          </div>
                          <button
                            onClick={() => handleRemoveTransport(booking.id)}
                            className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors duration-150"
                          >
                            Remove Transport
                          </button>
                        </div>
                      ) : assigningTransportFor === booking.id ? (
                        <div className="space-y-3">
                          <select
                            name="selectedId"
                            value={transportAssignment.selectedId}
                            onChange={handleTransportAssignmentChange}
                            className="w-full p-3 border border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-300 focus:border-transparent shadow-sm"
                          >
                            <option value="">Select Transport</option>
                            {availableTransports.map(transport => (
                              <option key={transport.id} value={transport.id}>
                                {transport.vehicleName} - {transport.vehicleType}
                              </option>
                            ))}
                          </select>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAssignTransport(booking.id)}
                              className="flex-1 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors duration-150 shadow-sm"
                            >
                              Assign
                            </button>
                            <button
                              onClick={() => {
                                setAssigningTransportFor(null);
                                setTransportAssignment({ selectedId: "" });
                              }}
                              className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors duration-150 shadow-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAssigningTransportFor(booking.id)}
                          className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors duration-150 shadow-sm"
                        >
                          Assign Transport
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}