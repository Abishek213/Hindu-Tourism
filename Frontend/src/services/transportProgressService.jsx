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

    if (travelStatus === 'Cancelled') {
      try {
        const invoiceResponse = await api.get(`/invoice?booking_id=${bookingId}`);
        if (invoiceResponse.data.length > 0) {
          const invoiceId = invoiceResponse.data[0]._id;
          await api.put(`/invoice/${invoiceId}/status`, {
            status: 'cancelled'
          });
        }
      } catch (invoiceError) {
        console.error("Failed to update invoice status:", invoiceError);
      }
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
