import api from "../api/auth";

export const AssignTeamService = {
  async fetchAllData() {
    try {
      const [bookingsRes, guidesRes, transportsRes] = await Promise.all([
        api.get("/booking"),
        api.get("/guide"),
        api.get("/transport"),
      ]);

      return {
        bookings: bookingsRes.data,
        guides: guidesRes.data,
        transports: transportsRes.data,
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.error || error.message || "Failed to fetch data"
      );
    }
  },

  async assignGuide(bookingId, guideId) {
    try {
      const response = await api.put(`/guide/${bookingId}/assignguide`, {
        guide_id: guideId,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
          error.message ||
          "Failed to assign guide to booking"
      );
    }
  },

  async assignTransport(bookingId, transportId) {
    try {
      const response = await api.put(
        `/transport/${bookingId}/assigntransport`,
        {
          transport_id: transportId,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
          error.message ||
          "Failed to assign transport to booking"
      );
    }
  },

  async updateBookingStatus(bookingId, status) {
    try {
      const response = await api.put(`/booking/${bookingId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
          error.message ||
          "Failed to update booking status"
      );
    }
  },

  async getInvoiceForBooking(bookingId) {
    try {
      const response = await api.get(`/invoice?booking_id=${bookingId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
          error.message ||
          "Failed to fetch invoice data"
      );
    }
  },

  async updateInvoiceStatus(invoiceId, status) {
    try {
      const response = await api.put(`/invoice/${invoiceId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
          error.message ||
          "Failed to update invoice status"
      );
    }
  },
};