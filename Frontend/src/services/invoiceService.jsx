import api, { getCurrentUser } from "../api/auth";

/**
 * Invoice Service - Handles all invoice-related API operations
 */
export const invoiceService = {
  /**
   * Centralized error handler
   */
  handleError(error) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    switch (status) {
      case 401:
        return new Error('Unauthorized - Please login again');
      case 403:
        return new Error('Forbidden - You lack required permissions');
      case 404:
        return new Error('Invoice not found');
      case 400:
        return new Error(message || 'Invalid request data');
      default:
        return new Error(message || 'Failed to process invoice request');
    }
  },
  
  /**
   * Get all invoices with authentication check
   * @returns {Promise<Array>} Array of invoice objects
   * @throws {Error} If not authenticated or API request fails
   */
  async getInvoices() {
    try {
      const user = getCurrentUser();
      if (!user) throw new Error('Not authenticated');
      
      const response = await api.get('/invoice');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Get invoices with bookings data for detailed view
   * @returns {Promise<Object>} Object containing invoices and bookings arrays
   * @throws {Error} If not authenticated or API request fails
   */
  async getInvoicesWithBookings() {
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const invoicesResponse = await api.get('/invoice');
      const bookingsResponse = await api.get('/booking');

      return {
        invoices: invoicesResponse.data,
        bookings: bookingsResponse.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  },

  /**
   * Get a single invoice by ID
   * @param {string} invoiceId - The invoice ID
   * @returns {Promise<Object>} Invoice object
   * @throws {Error} If not authenticated or API request fails
   */
  async getInvoiceById(invoiceId) {
    try {
      if (!invoiceId) throw new Error('Invoice ID is required');
      
      const response = await api.get(`/invoice/${invoiceId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Get invoice by booking ID
   * @param {string} bookingId - The booking ID
   * @returns {Promise<Object|null>} Invoice object or null if not found
   * @throws {Error} If not authenticated or API request fails
   */
  async getInvoiceByBookingId(bookingId) {
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (!bookingId) {
        throw new Error('Booking ID is required');
      }

      const response = await api.get(`/invoice/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  },

  /**
   * Generate invoice from booking
   * @param {string} bookingId - The booking ID
   * @param {Object} additionalData - Additional invoice data (optional)
   * @returns {Promise<Object>} Generated invoice object
   * @throws {Error} If not authenticated or API request fails
   */
  async generateInvoiceFromBooking(bookingId, additionalData = {}) {
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (!bookingId) {
        throw new Error('Booking ID is required');
      }

      const requestData = {
        bookingId,
        ...additionalData
      };

      const response = await api.post('/invoice/generate', requestData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  },

  /**
   * Download invoice as PDF
   * @param {string} invoiceId - The invoice ID
   * @throws {Error} If not authenticated or API request fails
   */
  async downloadInvoicePDF(invoiceId) {
    try {
      const response = await api.get(`/invoice/${invoiceId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Get invoice statistics/analytics
   * @param {Object} filters - Optional filters (date range, status, etc.)
   * @returns {Promise<Object>} Statistics object
   * @throws {Error} If not authenticated or API request fails
   */
  async getInvoiceStats(filters = {}) {
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `/invoice/stats?${queryParams}` : '/invoice/stats';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  },

  /**
   * Get invoices with filters
   * @param {Object} filters - Filter options (status, dateRange, customer, etc.)
   * @returns {Promise<Array>} Filtered array of invoice objects
   * @throws {Error} If not authenticated or API request fails
   */
  async getFilteredInvoices(filters = {}) {
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/invoice?${queryString}` : '/invoice';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  }
};

export default invoiceService;