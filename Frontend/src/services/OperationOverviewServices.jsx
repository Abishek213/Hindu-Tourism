import api from '../api/auth';

export const fetchDashboardData = async () => {
  try {
    const [bookingsRes, guidesRes, transportsRes, packagesRes] = await Promise.all([
      api.get('/booking'),
      api.get('/guide'),
      api.get('/transport'),
      api.get('/package?is_active=true')
    ]);

    return {
      bookings: bookingsRes.data,
      guides: guidesRes.data,
      transports: transportsRes.data,
      packages: packagesRes.data
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const updateTravelStatus = async (bookingId, status) => {
  try {
    const response = await api.put(`/booking/${bookingId}/travel-status`, {
      travelStatus: status
    });
    return response.data;
  } catch (error) {
    console.error('Error updating travel status:', error);
    throw error;
  }
};

export const calculateStats = (bookings, guides, transports) => {
  const activeTours = bookings.filter(b => 
    ['confirmed', 'in-progress'].includes(b.status)
  ).length;
  
  const guidesAssigned = guides.filter(g => 
    bookings.some(b => b.guide_id?.toString() === g._id.toString())
  ).length;
  
  const tripsCompleted = bookings.filter(b => 
    b.status === 'completed'
  ).length;
  
  const onSchedule = bookings.filter(b => 
    b.travelStatus === 'On Schedule'
  ).length;
  
  const delayed = bookings.filter(b => 
    b.travelStatus === 'Delayed'
  ).length;
  
  const totalGuides = guides.length;
  const unassignedGuides = totalGuides - guidesAssigned;
  
  const transportsAssigned = transports.filter(t => 
    bookings.some(b => b.transport_id?.toString() === t._id.toString())
  ).length;
  
  const totalTransport = transports.length;
  const unassignedTransport = totalTransport - transportsAssigned;
  
  return {
    activeTours,
    guidesAssigned,
    tripsCompleted,
    customerSatisfaction: 4.8, // You might calculate this differently
    pendingAssignments: bookings.filter(b => !b.guide_id || !b.transport_id).length,
    vehicles: transportsAssigned,
    onSchedule,
    delayed,
    unassignedGuides,
    unassignedTransport,
    totalGuides,
    totalTransport
  };
};

export const processBookingsData = (bookings) => {
  return bookings.map(booking => ({
    id: booking._id,
    name: booking.customer_id?.name || 'N/A',
    package: booking.package_id?.title || 'N/A',
    location: getCurrentLocation(booking),
    status: getBookingStatus(booking),
    lastUpdate: formatLastUpdate(booking.updatedAt),
    travelers: booking.num_travelers || 0,
    assignedTransport: booking.transport_id?.name || 'Unassigned',
    assignedGuide: booking.guide_id?.name || 'Unassigned'
  }));
};

export const processPackageDistribution = (packages) => {
  // Group bookings by package
  const packageCounts = packages.reduce((acc, pkg) => {
    acc[pkg._id] = {
      name: pkg.title,
      count: 0,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    };
    return acc;
  }, {});

  // Calculate total for percentage calculation
  const total = Object.values(packageCounts).reduce((sum, pkg) => sum + pkg.count, 1);

  return Object.values(packageCounts).map(pkg => ({
    name: pkg.name,
    value: Math.round((pkg.count / total) * 100),
    bookings: pkg.count,
    color: pkg.color
  }));
};

export const processGuidePerformance = (guides) => {
  return guides.map(guide => ({
    guide: guide.name,
    tours: Math.floor(Math.random() * 20) + 5, // Replace with actual tour count
    rating: (Math.random() * 1 + 4).toFixed(1) // Random rating between 4.0-5.0
  }));
};

export const processStatusDistribution = (bookings) => {
  const statusCounts = {
    'Confirmed': 0,
    'Completed': 0,
    'Cancelled': 0
  };
  
  bookings.forEach(booking => {
    if (booking.status === 'confirmed') statusCounts['Confirmed']++;
    else if (booking.status === 'completed') statusCounts['Completed']++;
    else if (booking.status === 'cancelled') statusCounts['Cancelled']++;
  });
  
  return [
    { status: 'Confirmed', count: statusCounts['Confirmed'], color: '#10B981' },
    { status: 'Completed', count: statusCounts['Completed'], color: '#3B82F6' },
    { status: 'Cancelled', count: statusCounts['Cancelled'], color: '#EF4444' },
  ];
};

// Helper functions
const getCurrentLocation = (booking) => {
  // Implement logic to determine current location based on itinerary
  return booking.package_id?.itineraries?.[0]?.location || 'Unknown';
};

const getBookingStatus = (booking) => {
  if (booking.status === 'cancelled') return 'cancelled';
  if (booking.travelStatus === 'Delayed') return 'delayed';
  if (booking.travelStatus === 'On Route') return 'on-route';
  return 'on-schedule';
};

const formatLastUpdate = (dateString) => {
  const now = new Date();
  const updatedAt = new Date(dateString);
  const diffMinutes = Math.floor((now - updatedAt) / (1000 * 60));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
  return `${Math.floor(diffMinutes / 1440)} days ago`;
};