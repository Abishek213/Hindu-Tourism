import { useState, useEffect } from 'react';
import {
  Users, Eye, Plus, Calendar, User, Phone,
  MapPin, X, Search, Filter
} from 'lucide-react';
import BookingFormOverlay from '../../Components/SalesBooking/BookingForm';
import { debounce } from 'lodash';
import api from '../../api/auth';


const useCustomers = () => {

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // Use '/customer' to match your backend route
        const response = await api.get('/customer');

        console.log('API Response:', response); // Debug log

        if (!response || !response.data) {
          throw new Error('No data received from server');
        }

        // Handle both direct array response and paginated response
        const customersData = Array.isArray(response.data)
          ? response.data
          : response.data.customers || [];

        setCustomers(customersData);

      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err.message || 'Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);


  const updateCustomer = async (id, updatedCustomer) => {
    try {
      const response = await api.put(`/customer/${id}`, updatedCustomer);
      setCustomers(prev => prev.map(customer =>
        customer._id === id ? response.data : customer
      ));
    } catch (err) {
      console.error('Error updating customer:', err);
      throw err;
    }
  };

  const addCustomer = async (newCustomer) => {
    try {
      const response = await api.post('/customer', newCustomer);
      setCustomers(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error adding customer:', {
        status: err.response?.status,
        data: err.response?.data,
      });

      // Throw a more specific error
      if (err.response?.status === 403) {
        throw new Error('You need admin and sales_agent privileges to add customers. Please contact your administrator.');
      }
      throw err;
    }
  };

  return { customers, loading, error, updateCustomer, addCustomer };
};

// Add Customer Form Modal
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
    // Clear error when user starts typing
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

    // Reset form
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 rounded-t-lg bg-gradient-to-r from-yellow-500 to-orange-500">
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

        <div className="p-6 space-y-4">
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.source ? 'border-red-500' : 'border-gray-300'
                }`}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Enter any additional notes"
            />
          </div>

          <div className="flex gap-3 pt-4">
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
              className="flex-1 px-4 py-2 font-semibold text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              Add Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Header Component
function CustomerHeader({ onAddCustomer, onSearch }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="mt-1 text-gray-600">Select Customer for Booking</p>
        </div>
        <button
          onClick={onAddCustomer}
          className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-200 rounded-lg shadow-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 hover:shadow-xl"
        >
          <Plus size={20} />
          Add New Customer
        </button>
      </div>
    </div>
  );
}

// Customer View Modal
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

// Simplified Table Component
function CustomerTable({ customers, onViewCustomer, onBookNow }) {
  // Ensure customers is always an array, default to empty array if not

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-yellow-100 to-orange-100">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">Customer</th>
            <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">Contact</th>
            <th className="px-6 py-4 text-sm font-semibold text-center text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.id || customer._id} className="transition-colors duration-150 hover:bg-yellow-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 text-sm font-medium text-white rounded-full bg-gradient-to-r from-yellow-400 to-orange-400">
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
                    <button
                      onClick={() => onBookNow(customer)}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white transition-all duration-200 rounded-md bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      title="Create Booking"
                    >
                      <Calendar size={12} />
                      Book Now
                    </button>
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

// Empty State Component
function EmptyState({ onAddCustomer }) {
  return (
    <div className="py-12 text-center">
      <Users size={48} className="mx-auto mb-4 text-gray-400" />
      <h3 className="mb-2 text-lg font-medium text-gray-900">No customers found</h3>
      <p className="mb-6 text-gray-500">Get started by adding your first customer lead.</p>
      <button
        onClick={onAddCustomer}
        className="flex items-center gap-2 px-6 py-3 mx-auto font-semibold text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
      >
        <Plus size={20} />
        Add Customer
      </button>
    </div>
  );
}

// Main CustomerList Component
export default function CustomerList({ onAddCustomer }) {
  const { customers, updateCustomer, addCustomer } = useCustomers();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  // Debounced search
  const debouncedSearch = debounce((term) => {
    setSearchTerm(term);
  }, 300);

  // Filter customers based on search term
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

  const handleCloseBooking = () => {
    setBookingFormOpen(false);
    setSelectedCustomer(null);
  };

  const handleBookingSubmitted = (bookingData) => {
    console.log('Booking submitted for customer:', selectedCustomer.name, bookingData);
    // Optionally update customer status after booking
    if (selectedCustomer) {
      updateCustomer(selectedCustomer.id, {
        ...selectedCustomer,
        status: 'booked',
        lastContact: new Date().toISOString()
      });
    }
  };

  const handleAddCustomerClick = () => {
    setAddCustomerModalOpen(true);
  };

  const handleCloseAddCustomer = () => {
    setAddCustomerModalOpen(false);
  };

 const handleAddCustomerSubmit = async (customerData) => {
  try {
    await addCustomer(customerData);
    // Show success message
    alert('Customer added successfully!');
    setAddCustomerModalOpen(false);
  } catch (err) {
    // Show user-friendly error
    alert(err.message || 'Failed to add customer');
  }
};

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* Header */}
      <CustomerHeader onAddCustomer={handleAddCustomerClick} />

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
        <input
          type="text"
          placeholder="Search customers by name, email, phone, or lead ID..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
      </div>

      {/* Main Content */}
      <div className="overflow-hidden bg-white rounded-lg shadow-lg">
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