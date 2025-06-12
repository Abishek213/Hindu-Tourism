import api, { getCurrentUser } from "../api/auth";

/**
 * Invoice Service - Handles all invoice-related API operations
 */
export const invoiceService = {
  /**
   * Get all invoices with authentication check
   * @returns {Promise<Array>} Array of invoice objects
   * @throws {Error} If not authenticated or API request fails
   */
  async getInvoices() {
    try {
      // Check authentication
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const response = await api.get('/invoice');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  },

  /**
   * Get invoices with bookings data for detailed view
   * @returns {Promise<Object>} Object containing invoices and bookings arrays
   * @throws {Error} If not authenticated or API request fails
   */
  async getInvoicesWithBookings() {
    try {
      // Check authentication
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Fetch invoices
      const invoicesResponse = await api.get('/invoice');
      
      // Fetch bookings for reference
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
      // Check authentication
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (!invoiceId) {
        throw new Error('Invoice ID is required');
      }

      const response = await api.get(`/invoice/${invoiceId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  },

  /**
   * Update invoice status
   * @param {string} invoiceId - The invoice ID
   * @param {string} status - New status ('draft', 'sent', 'paid', 'cancelled')
   * @returns {Promise<Object>} Updated invoice object
   * @throws {Error} If not authenticated or API request fails
   */
  async updateInvoiceStatus(invoiceId, status) {
    try {
      // Check authentication
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (!invoiceId) {
        throw new Error('Invoice ID is required');
      }

      if (!status) {
        throw new Error('Status is required');
      }

      // Validate status
      const validStatuses = ['draft', 'sent', 'paid', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      const response = await api.put(`/invoice/${invoiceId}/status`, { status });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
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
      // Check authentication
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
        return null; // Invoice not found for this booking
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
      // Check authentication
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
   * Duplicate an existing invoice
   * @param {string} invoiceId - The invoice ID to duplicate
   * @param {Object} overrideData - Data to override in the duplicated invoice
   * @returns {Promise<Object>} New invoice object
   * @throws {Error} If not authenticated or API request fails
   */
  async duplicateInvoice(invoiceId, overrideData = {}) {
    try {
      // Check authentication
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (!invoiceId) {
        throw new Error('Invoice ID is required');
      }

      const requestData = {
        sourceInvoiceId: invoiceId,
        ...overrideData
      };

      const response = await api.post('/invoice/duplicate', requestData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  },

  /**
   * Add payment to invoice
   * @param {string} invoiceId - The invoice ID
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Updated invoice object
   * @throws {Error} If not authenticated or API request fails
   */
  async addPayment(invoiceId, paymentData) {
    try {
      // Check authentication
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (!invoiceId) {
        throw new Error('Invoice ID is required');
      }

      if (!paymentData || typeof paymentData !== 'object') {
        throw new Error('Payment data is required and must be an object');
      }

      const response = await api.post(`/invoice/${invoiceId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  },

  /**
   * Get payment history for an invoice
   * @param {string} invoiceId - The invoice ID
   * @returns {Promise<Array>} Array of payment objects
   * @throws {Error} If not authenticated or API request fails
   */
  async getPaymentHistory(invoiceId) {
    try {
      // Check authentication
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (!invoiceId) {
        throw new Error('Invoice ID is required');
      }

      const response = await api.get(`/invoice/${invoiceId}/payments`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  },

  /**
   * Export invoices to various formats
   * @param {Object} options - Export options (format, filters, etc.)
   * @returns {Promise<Blob>} Export file blob
   * @throws {Error} If not authenticated or API request fails
   */
  async exportInvoices(options = {}) {
    try {
      // Check authentication
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const {
        format = 'csv',
        filters = {},
        fields = []
      } = options;

      const requestData = {
        format,
        filters,
        fields
      };

      const response = await api.post('/invoice/export', requestData, {
        responseType: 'blob'
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to export invoices';
      throw new Error(errorMessage);
    }
  },

  /**
   * Get invoice templates
   * @returns {Promise<Array>} Array of template objects
   * @throws {Error} If not authenticated or API request fails
   */
  async getInvoiceTemplates() {
    try {
      // Check authentication
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const response = await api.get('/invoice/templates');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  },

  /**
   * Preview invoice before generating
   * @param {Object} invoiceData - Invoice data for preview
   * @returns {Promise<Object>} Preview data
   * @throws {Error} If not authenticated or API request fails
   */
  async previewInvoice(invoiceData) {
    try {
      // Check authentication
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (!invoiceData || typeof invoiceData !== 'object') {
        throw new Error('Invoice data is required and must be an object');
      }

      const response = await api.post('/invoice/preview', invoiceData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  },

  /**
   * Update entire invoice
   * @param {string} invoiceId - The invoice ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated invoice object
   * @throws {Error} If not authenticated or API request fails
   */
  async updateInvoice(invoiceId, updateData) {
    try {
      // Check authentication
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (!invoiceId) {
        throw new Error('Invoice ID is required');
      }

      if (!updateData || typeof updateData !== 'object') {
        throw new Error('Update data is required and must be an object');
      }

      const response = await api.put(`/invoice/${invoiceId}`, updateData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  },

  /**
   * Create a new invoice
   * @param {Object} invoiceData - Invoice data
   * @returns {Promise<Object>} Created invoice object
   * @throws {Error} If not authenticated or API request fails
   */
  async createInvoice(invoiceData) {
    try {
      // Check authentication
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (!invoiceData || typeof invoiceData !== 'object') {
        throw new Error('Invoice data is required and must be an object');
      }

      const response = await api.post('/invoice', invoiceData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  },

  /**
   * Delete an invoice
   * @param {string} invoiceId - The invoice ID
   * @returns {Promise<Object>} Success response
   * @throws {Error} If not authenticated or API request fails
   */
  async deleteInvoice(invoiceId) {
    try {
      // Check authentication
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (!invoiceId) {
        throw new Error('Invoice ID is required');
      }

      const response = await api.delete(`/invoice/${invoiceId}`);
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
      // Check authentication
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (!invoiceId) {
        throw new Error('Invoice ID is required');
      }

      const response = await api.get(`/invoice/${invoiceId}/download`, {
        responseType: 'blob'
      });
      
      // Create a blob URL for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to download invoice';
      throw new Error(errorMessage);
    }
  },

  /**
   * Send invoice via email
   * @param {string} invoiceId - The invoice ID
   * @param {string} email - Recipient email address (optional, will use customer email if not provided)
   * @returns {Promise<Object>} Success response
   * @throws {Error} If not authenticated or API request fails
   */
  async sendInvoiceEmail(invoiceId, email = null) {
    try {
      // Check authentication
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (!invoiceId) {
        throw new Error('Invoice ID is required');
      }

      const requestData = email ? { email } : {};
      const response = await api.post(`/invoice/${invoiceId}/send`, requestData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
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
      // Check authentication
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
      // Check authentication
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const queryParams = new URLSearchParams();
      
      // Add filters to query params
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
  },

  /**
   * Bulk update invoice statuses
   * @param {Array} invoiceIds - Array of invoice IDs
   * @param {string} status - New status to apply to all
   * @returns {Promise<Array>} Array of updated invoice objects
   * @throws {Error} If not authenticated or API request fails
   */
  async bulkUpdateInvoiceStatus(invoiceIds, status) {
    try {
      // Check authentication
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (!Array.isArray(invoiceIds) || invoiceIds.length === 0) {
        throw new Error('Invoice IDs array is required and must not be empty');
      }

      if (!status) {
        throw new Error('Status is required');
      }

      // Validate status
      const validStatuses = ['draft', 'sent', 'paid', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      const response = await api.put('/invoice/bulk-update', {
        invoiceIds,
        status
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
  }
};

export default invoiceService;