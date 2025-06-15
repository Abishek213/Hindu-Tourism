import { useState, useEffect, useCallback } from 'react'; // Added useCallback
import {
  Users, Eye, Plus, Calendar, User, Phone,
  MapPin, X, Search, Filter, CheckCircle // Added CheckCircle icon
} from 'lucide-react';
import BookingFormOverlay from '../../Components/SalesBooking/BookingForm';
import { debounce } from 'lodash';
import api from '../../api/auth';


const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch customers, made into a useCallback to be stable for useEffect
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/customer'); // Fetch initial customer data

      if (!response || !response.data) {
        throw new Error('No data received from server');
      }

      const customersData = Array.isArray(response.data)
        ? response.data
        : response.data.customers || [];

      // For each customer, check if they have any bookings
      const customersWithBookingStatus = await Promise.all(
        customersData.map(async (customer) => {
          try {
            const customerId = customer._id || customer.id;
            // Use the existing /customer/:id/bookings endpoint to check for bookings
            const bookingResponse = await api.get(`/customer/${customerId}/bookings`);
            // Assuming getCustomerBookings returns an array of bookings
            const hasBooking = bookingResponse.data && bookingResponse.data.length > 0;
            
            console.log(`[fetchCustomers] Customer: ${customer.name} (${customerId}), Has Booking: ${hasBooking}`);
            return {
              ...customer,
              has_active_booking: hasBooking // Add this flag to the customer object
            };
          } catch (bookingError) {
            console.warn(`[fetchCustomers] Could not fetch booking status for customer ${customer.name}:`, bookingError);
            return { ...customer, has_active_booking: false }; // Default to false if check fails
          }
        })
      );
      setCustomers(customersWithBookingStatus);

    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array ensures this function itself is stable

  // Initial fetch on component mount
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]); // Depend on fetchCustomers useCallback

  const addCustomer = async (newCustomer) => {
    try {
      const response = await api.post('/customer', newCustomer);
      // New customer won't have a booking initially
      setCustomers(prev => [...prev, { ...response.data, has_active_booking: false }]); 
      return response.data;
    } catch (err) {
      console.error('Error adding customer:', {
        status: err.response?.status,
        data: err.response?.data,
      });
      if (err.response?.status === 403) {
        throw new Error('You need admin privileges to add customers. Please contact your administrator.');
      }
      throw err;
    }
  };

  return { customers, loading, error, addCustomer, fetchCustomers }; // Return fetchCustomers for re-fetching
};

// Add Customer Form Modal (no changes)
function AddCustomerModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    source: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.source.trim()) {
      newErrors.source = 'Source is required';
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);

    setFormData({
      name: '',
      phone: '',
      email: '',
      source: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      source: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 rounded-t-lg bg-primary-saffron">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Add New Customer</h2>
            <button
              onClick={handleClose}
              className="text-white transition-colors duration-150 hover:text-yellow-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="Enter full name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
              Contact Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
                         className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}

              placeholder="Enter contact number"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
                           className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}

              placeholder="Enter email address"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="source" className="block mb-1 text-sm font-medium text-gray-700">
              Source *
            </label>
            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}

            >
              <option value="">Select source</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Social Media">Social Media</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Direct Call">Direct Call</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Other">Other</option>
            </select>
            {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source}</p>}
          </div>

          <div>
            <label htmlFor="notes" className="block mb-1 text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="Enter any additional notes"
            />
          </div>

          <div className="flex gap-1 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 transition-colors duration-200 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 font-semibold text-white transition-all duration-200 rounded-lg bg-primary-saffron"
            >
              Add Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Header Component (no changes)
function CustomerHeader({ onAddCustomer }) {
  return (
    <div className="mb-6 px-6 py-6 border-b border-gray-100 bg-primary-saffron">
      <div  className="flex flex-col items-center justify-between sm:flex-row">

         <div >
          <h1 className="text-xl font-bold text-white">Booking Management</h1>
          <p className=" text-white">Select Customer for Booking</p>
        </div>
        <button
          onClick={onAddCustomer}
            className="flex items-center gap-2 px-4 py-2 mt-4 font-medium
                 text-orange-600 transition-all duration-200
                  bg-white shadow-lg sm:mt-0 rounded-md hover:bg-orange-100"
              >
          <Plus className="w-5 h-5" />
          Add New Customer
        </button>
      </div>
    </div>
  );
}

// Customer View Modal (no changes)
function CustomerViewModal({ isOpen, onClose, customer }) {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 rounded-t-lg bg-gradient-to-r from-yellow-500 to-orange-500">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Customer Details</h2>
            <button
              onClick={onClose}
              className="text-white transition-colors duration-150 hover:text-yellow-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
                <User size={18} className="text-yellow-500" />
                Personal Information
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs tracking-wide text-gray-500 uppercase">Lead ID</p>
                  <p className="text-sm font-medium">{customer.leadId}</p>
                </div>
                <div>
                  <p className="text-xs tracking-wide text-gray-500 uppercase">Name</p>
                  <p className="text-sm font-medium">{customer.name}</p>
                </div>
                <div>
                  <p className="text-xs tracking-wide text-gray-500 uppercase">Email</p>
                  <p className="text-sm font-medium">{customer.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-yellow-500" />
                  <div>
                    <p className="text-xs tracking-wide text-gray-500 uppercase">Phone</p>
                    <p className="text-sm font-medium">{customer.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
                <MapPin size={18} className="text-yellow-500" />
                Additional Information
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs tracking-wide text-gray-500 uppercase">Source</p>
                  <p className="text-sm font-medium">{customer.source}</p>
                </div>
                <div>
                  <p className="text-xs tracking-wide text-gray-500 uppercase">Inquiry Date</p>
                  <p className="text-sm font-medium">{new Date(customer.inquiryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs tracking-wide text-gray-500 uppercase">Last Contact</p>
                  <p className="text-sm font-medium">{new Date(customer.lastContact).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {customer.notes && (
            <div className="mt-6">
              <h4 className="mb-3 font-semibold text-gray-800">Notes</h4>
              <div className="p-4 rounded-lg bg-gray-50">
                <p className="text-sm">{customer.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simplified Table Component - Contains the conditional button logic
function CustomerTable({ customers, onViewCustomer, onBookNow }) {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-2xl">
      <table className=" overflow-x-auto w-full">
        <thead className="bg-secondary-green">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-left text-white uppercase">Customer</th>
            <th className="px-6 py-4 text-xs font-semibold text-left text-white uppercase">Contact</th>
            <th className="px-6 py-4 text-xs font-semibold text-center text-white uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.id || customer._id} className="transition-colors duration-150 hover:bg-yellow-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 text-sm font-medium text-white rounded-full bg-primary-saffron">
                      {customer.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{customer.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{customer._id  || 'No ID'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="text-gray-900">{customer.email || 'No email'}</div>
                    <div className="text-gray-500">{customer.phone || 'No phone'}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onViewCustomer(customer)}
                      className="p-2 text-gray-400 transition-colors duration-150 rounded-lg hover:text-yellow-600 hover:bg-yellow-50"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    {/* Conditional Rendering for Book Now / Booked button */}
                    {customer.has_active_booking ? (
                      <button
                        className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-gray-400 rounded-md cursor-not-allowed"
                        title="Booking Already Exists"
                        disabled
                      >
                        <CheckCircle size={12} />
                        Booked
                      </button>
                    ) : (
                      <button
                        onClick={() => onBookNow(customer)}
                        className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white transition-all duration-200 rounded-md bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        title="Create Booking"
                      >
                        <Calendar size={12} />
                        Book Now
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                No customers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Empty State Component (no changes)
function EmptyState({ onAddCustomer }) {
  return (
    <div className="py-12 text-center">
      <Users size={48} className="mx-auto mb-4 text-gray-400" />
      <h3 className="mb-2 text-lg font-medium text-gray-900">No customers found</h3>
      <p className="mb-6 text-gray-500">Get started by adding your first customer lead.</p>
      <button
        onClick={onAddCustomer}
        className="flex items-center gap-2 px-6 py-3 mx-auto font-semibold
         text-white transition-all duration-200 rounded-lg bg-primary-saffron"
      >
        <Plus size={20} />
        Add Customer
      </button>
    </div>
  );
}

// Main CustomerList Component
export default function CustomerList({ onAddCustomer }) {
  // Destructure fetchCustomers from the hook return
  const { customers, addCustomer, fetchCustomers } = useCustomers();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  // Debounced search (no changes)
  const debouncedSearch = debounce((term) => {
    setSearchTerm(term);
  }, 300);

  // Filter customers based on search term (no changes)
  useEffect(() => {
    if (!customers) return;

    const filtered = customers.filter(customer => {
      if (!customer) return false;

      const searchLower = searchTerm.toLowerCase();
      const fieldsToSearch = [
        customer.name || '',
        customer.email || '',
        customer.phone || '',
        customer.leadId || '',
        customer.source || '',
        customer.notes || ''
      ];

      return fieldsToSearch.some(field =>
        field.toLowerCase().includes(searchLower)
      );
    });

    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);


  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setViewModalOpen(true);
  };

  const handleBookNow = (customer) => {
    setSelectedCustomer(customer);
    setBookingFormOpen(true);
  };

  const handleCloseView = () => {
    setViewModalOpen(false);
    setSelectedCustomer(null);
  };

  // Called when booking form closes
  const handleCloseBooking = () => {
    setBookingFormOpen(false);
    setSelectedCustomer(null);
    fetchCustomers(); // CRITICAL: Re-fetch customers to update their booking status
  };

  // Called after a successful booking submission from BookingFormOverlay
  const handleBookingSubmitted = (bookingData) => {
    console.log('Booking submitted for customer:', selectedCustomer.name, bookingData);
    // Optimistically update the customer's booking status in the local state
    setCustomers(prev => {
      const updatedCustomers = prev.map(c => {
        if ((c._id || c.id) === (selectedCustomer._id || selectedCustomer.id)) {
          console.log(`[handleBookingSubmitted] Updating customer ${c.name} to has_active_booking: true`);
          return { ...c, has_active_booking: true };
        }
        return c;
      });
      return updatedCustomers;
    });
  };

  const handleAddCustomerClick = () => {
    setAddCustomerModalOpen(true);
  };

  // Called when Add Customer modal closes
  const handleCloseAddCustomer = () => {
    setAddCustomerModalOpen(false);
    fetchCustomers(); // CRITICAL: Re-fetch customers after adding a new one
  };

 const handleAddCustomerSubmit = async (customerData) => {
  try {
    await addCustomer(customerData);
    // Show success message
    alert('Customer added successfully!'); // Using alert for simplicity, consider a custom modal
    setAddCustomerModalOpen(false);
  } catch (err) {
    // Show user-friendly error
    alert(err.message || 'Failed to add customer'); // Using alert for simplicity
  }
};

  return (
    <div className="p-4 mx-auto max-w-7xl">
      {/* Header */}
      <CustomerHeader onAddCustomer={handleAddCustomerClick} />

     {/* Search Bar */}
            <div className=" mb-6 relative flex flex-col gap-4 mb-0 lg:flex-row">
          <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search customers by name, email, phone, or lead ID..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-400 rounded-xl"
          />
        </div>


      {/* Main Content */}
      <div className=" overflow-hidden bg-white rounded-lg ">
        {filteredCustomers.length === 0 ? (
          <EmptyState onAddCustomer={handleAddCustomerClick} />
        ) : (
          <CustomerTable
            customers={filteredCustomers}
            onViewCustomer={handleViewCustomer}
            onBookNow={handleBookNow}
          />
        )}
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={addCustomerModalOpen}
        onClose={handleCloseAddCustomer}
        onSubmit={handleAddCustomerSubmit}
      />

      {/* Customer View Modal */}
      {viewModalOpen && selectedCustomer && (
        <CustomerViewModal
          customer={selectedCustomer}
          isOpen={viewModalOpen}
          onClose={handleCloseView}
        />
      )}

      {/* Your External Booking Form */}
      {bookingFormOpen && (
        <BookingFormOverlay
          isOpen={bookingFormOpen}
          onClose={handleCloseBooking}
          onSubmitted={handleBookingSubmitted}
          customer={selectedCustomer} // Pass customer data if needed
        />
      )}
    </div>
  );
}   