import api from '../api/auth.jsx';

export const fetchBookings = async () => {
  try {
    const response = await api.get('/booking');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateTravelStatus = async (bookingId, travelStatus) => {  
  try {
    const response = await api.put(`/booking/${bookingId}/travel-status`, {
      travelStatus
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};