import { useState, useEffect } from 'react';
import {
  Search, Filter, User, Calendar,
  Tag, MapPin, Phone, Plus, X, UserCheck
} from 'lucide-react';
import api from '../../api/auth';
// import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { ChevronDown } from 'lucide-react';

export default function LeadManagement() {
  // Lead list state
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  // const navigate = useNavigate();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'website',
    communicationType: 'email',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Status color mapping
  const statusColors = {
    new: 'bg-blue-50 text-blue-700 border-blue-200',
    contacted: 'bg-amber-50 text-amber-700 border-amber-200',
    converted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    lost: 'bg-red-50 text-red-700 border-red-200'
  };

  // Status label mapping
  const statusLabels = {
    new: 'New',
    contacted: 'Contacted',
    converted: 'Converted',
    lost: 'Lost'
  };

  // Source label mapping
  const sourceLabels = {
    website: 'Website',
    referral: 'Referral',
    social_media: 'Social Media',
    walk_in: 'Walk-in',
    other: 'Other'
  };

  // Load leads from API
  const loadLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/lead');
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (error) {
      console.error('Error loading leads:', error);
      setError('Failed to load leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = debounce((term) => {
    setSearchTerm(term);
  }, 300);

  // Handle search and filtering
  useEffect(() => {
    const fetchFilteredLeads = async () => {
      try {
        const params = {
          search: searchTerm,
          status: statusFilter,

        };
        console.log('Params sent to API:', params);
        const response = await api.get('/lead', { params });
        setFilteredLeads(response.data);
      } catch (error) {
        console.error('Filter error:', error);
        setError('Failed to filter leads');
      }
    };

    fetchFilteredLeads();
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    loadLeads();
  }, []);

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      source: 'website',
      communicationType: 'email',
      notes: '',
    });
  };


  //   e.preventDefault();
  //   setSubmitting(true);

  //   try {
  //     const response = await api.post('/lead', form);
  //     console.log('Lead created successfully:', response.data);
  //     loadLeads(); // Refresh the leads list
  //     setShowForm(false);
  //     resetForm();
  //   } catch (error) {
  //     console.error('Failed to submit lead:', error.response?.data || error.message);
  //     setError('Error submitting lead. Please check your input and try again.');
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // First create the lead
      const response = await api.post('/lead', form);
      console.log('Lead created successfully:', response.data);

      // Then create the communication log
      try {
        const logData = {
          lead_id: response.data._id,
          type: form.communicationType,
          content: `Initial contact via ${form.communicationType}. Notes: ${form.notes || 'No notes provided'}`,
          status: 'completed'
        };
        await api.post('/communication/createlog', logData);
        console.log('Communication log created successfully');
      } catch (logError) {
        console.error('Failed to create communication log:', logError);
        // Don't fail the entire operation if log creation fails
      }

      loadLeads(); // Refresh the leads list
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Failed to submit lead:', error.response?.data || error.message);
      setError('Error submitting lead. Please check your input and try again.');
    } finally {
      setSubmitting(false);
    }
  };


  const handleConvertToCustomer = async (leadId) => {
    console.log('Attempting to convert lead:', leadId); // Add this
    try {
      setFilteredLeads(prev => prev.filter(lead => lead._id !== leadId));

      const response = await api.post(`/lead/${leadId}/convert`);

      console.log('Conversion successful:', response.data); // Add this
      // loadLeads(); // Refresh the leads list
    } catch (error) {
      console.error('Failed to convert lead:', error);
      console.error('Error details:', error.response?.data); // Add this
      setError('Failed to convert lead to customer.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="p-4 mx-auto max-w-7xl sm:p-6">
        <div className="bg-white border border-orange-100 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-100 bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-2xl">
            <div className="flex flex-col items-center justify-between sm:flex-row">
              <div>
                <h2 className="mb-2 text-3xl font-bold text-white">
                  Lead Management
                </h2>
                <p className="text-orange-100">Manage and track your potential customers</p>
              </div>

              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-6 py-3 mt-4 font-medium text-orange-600 transition-all duration-200 bg-white shadow-lg sm:mt-0 rounded-xl hover:bg-orange-50"
              >
                <Plus className="w-5 h-5" />
                Add New Lead
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Error message */}
            {error && (
              <div className="p-4 mb-6 text-red-700 border border-red-200 bg-red-50 rounded-xl">
                <div className="font-medium">Error:</div>
                <div>{error}</div>
                <button
                  onClick={() => setError('')}
                  className="mt-2 text-sm text-red-600 underline hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Lead Form Modal */}
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                <div className="w-full max-w-sm bg-white shadow-2xl rounded-2xl">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Add New Lead
                      </h3>
                      <button
                        onClick={() => {
                          setShowForm(false);
                          resetForm();
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="space-y-3">
                        <div>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleFormChange}
                            placeholder="Full Name *"
                            required
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleFormChange}
                            placeholder="Email Address *"
                            required
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleFormChange}
                            placeholder="Phone Number *"
                            required
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <select
                            name="source"
                            value={form.source}
                            onChange={handleFormChange}
                            required
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="website">Website</option>
                            <option value="referral">Referral</option>
                            <option value="social_media">Social Media</option>
                            <option value="walk_in">Walk-in</option>
                            <option value="other">Other</option>
                          </select>
                        </div>




                        <div>
                          <select
                            name="communicationType"
                            value={form.communicationType}
                            onChange={handleFormChange}
                            required
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="email">Email</option>
                            <option value="call">Call</option>
                            <option value="meeting">Meeting</option>
                            <option value="message">Message</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleFormChange}
                            rows="2"
                            placeholder="Notes (optional)"
                            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>

                        <div className="flex gap-2 pt-3">
                          <button
                            type="button"
                            onClick={() => {
                              setShowForm(false);
                              resetForm();
                            }}
                            className="flex-1 px-4 py-2.5 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2.5 text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors font-medium"
                          >
                            {submitting ? 'Creating...' : 'Create Lead'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Filters Section */}
            <div className="flex flex-col gap-4 mb-6 lg:flex-row">
              <div className="relative flex-grow">
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Search leads by name, email, phone, or notes..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3">
                {(searchTerm || statusFilter) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('');

                    }}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <X className="w-4 h-4" />
                    Clear filters
                  </button>
                )}

                <Filter className="w-5 h-5 text-gray-500" />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>

              </div>
            </div>

            {/* Loading state */}
            {loading ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 mx-auto border-4 border-orange-200 rounded-full border-t-orange-500 animate-spin"></div>
                <p className="mt-4 font-medium text-gray-600">Loading leads...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="py-16 text-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="mb-2 text-xl font-semibold text-gray-600">
                  {leads.length === 0
                    ? "No leads found"
                    : "No leads match your filters"
                  }
                </p>
                <p className="mb-6 text-gray-500">
                  {leads.length === 0
                    ? "Add your first lead to get started with lead management."
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
                {leads.length === 0 && (
                  <button
                    onClick={() => {
                      resetForm();
                      setShowForm(true);
                    }}
                    className="inline-flex items-center gap-2 px-8 py-4 font-medium text-white transition-all duration-200 bg-orange-500 shadow-lg rounded-xl hover:bg-orange-600"
                  >
                    <Plus className="w-5 h-5" />
                    Add Your First Lead
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-hidden border border-gray-200 rounded-2xl">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Client Name
                          </div>
                        </th>
                        <th className="hidden px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase md:table-cell">
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            Contact
                          </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            Source
                          </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 mr-2" />
                            Status
                          </div>
                        </th>
                        <th className="hidden px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase sm:table-cell">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Created
                          </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredLeads.map((lead, index) => (
                        <tr key={lead._id || lead.id} className={`transition-all duration-200 hover:bg-orange-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{lead.name}</div>
                            <div className="max-w-xs text-sm text-gray-500 truncate">
                              {lead.notes && lead.notes.length > 40
                                ? `${lead.notes.substring(0, 40)}...`
                                : lead.notes || 'No notes'
                              }
                            </div>
                          </td>
                          <td className="hidden px-6 py-4 md:table-cell">
                            <div className="text-sm font-medium text-gray-900">{lead.email}</div>
                            <div className="text-sm text-gray-500">{lead.phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {sourceLabels[lead.source] || lead.source}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="relative">
                              <select
                                value={lead.status}
                                onChange={async (e) => {
                                  try {
                                    await api.put(`/lead/${lead._id}`, {
                                      status: e.target.value
                                    });
                                    loadLeads();
                                  } catch (error) {
                                    console.error('Error:', error.response?.data);
                                    setError(error.response?.data?.message || 'Update failed');
                                  }
                                }}
                                className={`appearance-none px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[lead.status] || 'bg-gray-50 text-gray-700 border-gray-200'} pr-7 focus:outline-none focus:ring-1 focus:ring-orange-500`}
                              >
                                {/* Current status (display only) */}
                                <option value={lead.status} disabled className="bg-white">
                                  {statusLabels[lead.status] || lead.status}
                                </option>

                                {/* Options for NEW leads */}
                                {lead.status === 'new' && (
                                  <>
                                    <option value="contacted">Contacted</option>
                                    <option value="lost">Lost</option>
                                  </>
                                )}

                                {/* Options for CONTACTED leads */}
                                {lead.status === 'contacted' && (
                                  <>
                                    <option value="qualified">Qualified</option>
                                    <option value="lost">Lost</option>
                                  </>
                                )}

                                {/* Options for QUALIFIED leads (only Convert button should appear) */}
                                {lead.status === 'qualified' && (
                                  <option value="lost">Lost</option>
                                )}
                              </select>
                              {lead.status !== 'converted' && lead.status !== 'lost' && (
                                <ChevronDown className="absolute w-3 h-3 transform -translate-y-1/2 pointer-events-none right-2 top-1/2" />
                              )}
                            </div>
                          </td>
                          <td className="hidden px-6 py-4 text-sm font-medium text-gray-500 sm:table-cell">
                            {formatDate(lead.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            {lead.status !== 'converted' && (
                              <button
                                onClick={() => handleConvertToCustomer(lead._id || lead.id)}
                                className="p-2 transition-all duration-200 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                                title="Convert to Customer"
                              >
                                <UserCheck className="w-5 h-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Results summary */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-600">
                      Showing <span className="font-semibold text-gray-900">{filteredLeads.length}</span> leads
                      {(searchTerm || statusFilter) && (
                        <span className="px-2 py-1 ml-2 text-xs text-orange-700 bg-orange-100 rounded-full">
                          Filtered
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Click the convert icon to mark leads as customers
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}