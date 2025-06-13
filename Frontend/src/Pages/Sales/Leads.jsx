import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  User,
  Calendar,
  Tag,
  MapPin,
  Phone,
  Plus,
  X,
  UserCheck,
} from "lucide-react";
import api from "../../api/auth";
import { debounce } from "lodash";

export default function LeadManagement() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [convertingLeads, setConvertingLeads] = useState(new Set());
  // const navigate = useNavigate();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "sources",
    communicationType: "email",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Status color mapping
  const statusColors = {
    new: "bg-blue-50 text-blue-700 border-blue-200",
    contacted: "bg-amber-50 text-amber-700 border-amber-200",
    converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    lost: "bg-red-50 text-red-700 border-red-200",
  };

  // Status label mapping
  const statusLabels = {
    new: "New",
    contacted: "Contacted",
    converted: "Converted",
    lost: "Lost",
  };

  // Source label mapping
  const sourceLabels = {
    sources: "Sources",
    website: "Website",
    referral: "Referral",
    social_media: "Social Media",
    walk_in: "Walk-in",
    other: "Other",
  };

  // Load leads from API
  const loadLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/lead");
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (error) {
      console.error("Error loading leads:", error);
      setError("Failed to load leads. Please try again.");
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
        console.log("Params sent to API:", params);
        const response = await api.get("/lead", { params });
        setFilteredLeads(response.data);
      } catch (error) {
        console.error("Filter error:", error);
        setError("Failed to filter leads");
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
      name: "",
      email: "",
      phone: "",
      source: "website",
      communicationType: "email",
      notes: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // First create the lead
      const response = await api.post("/lead", form);
      console.log("Lead created successfully:", response.data);

      // Then create the communication log
      try {
        const logData = {
          lead_id: response.data._id,
          type: form.communicationType,
          content: `Initial contact via ${form.communicationType}. Notes: ${
            form.notes || "No notes provided"
          }`,
          status: "completed",
        };
        await api.post("/communication/createlog", logData);
        console.log("Communication log created successfully");
      } catch (logError) {
        console.error("Failed to create communication log:", logError);
        // Don't fail the entire operation if log creation fails
      }

      loadLeads(); // Refresh the leads list
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error(
        "Failed to submit lead:",
        error.response?.data || error.message
      );
      setError("Error submitting lead. Please check your input and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConvertToCustomer = async (leadId) => {
    console.log("Attempting to convert lead:", leadId);

    // Add lead to converting state
    setConvertingLeads((prev) => new Set([...prev, leadId]));

    try {
      const response = await api.post(`/lead/${leadId}/convert`);
      console.log("Conversion successful:", response.data);

      // Show success feedback
      const leadName =
        leads.find((lead) => lead._id === leadId)?.name || "Lead";
      setError(""); // Clear any previous errors
      setSuccessMessage(`${leadName} successfully converted to customer!`);

      // Refresh the leads list to show updated data
      await loadLeads();
    } catch (error) {
      console.error("Failed to convert lead:", error);
      console.error("Error details:", error.response?.data);
      setError("Failed to convert lead to customer.");
    } finally {
      // Remove lead from converting state
      setConvertingLeads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return "Invalid Date";
    }
  };

  // Function to render convert button based on lead status
  const renderConvertButton = (lead) => {
    const leadId = lead._id || lead.id;
    const isConverting = convertingLeads.has(leadId);

    if (lead.status === "converted") {
      return (
        <button
          disabled
          className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-lg cursor-default"
        >
          <div className="flex items-center gap-1">
            <UserCheck className="w-4 h-4" />
            Converted
          </div>
        </button>
      );
    }

    return (
      <button
        onClick={() => handleConvertToCustomer(leadId)}
        disabled={isConverting}
        className={`
          px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors duration-200
          ${
            isConverting
              ? "text-orange-600 bg-orange-50 border-orange-200 cursor-not-allowed"
              : "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700"
          }
        `}
      >
        <div className="flex items-center gap-1">
          {isConverting ? (
            <>
              <div className="w-4 h-4 border-2 border-orange-300 rounded-full border-t-orange-600 animate-spin"></div>
              Converting...
            </>
          ) : (
            <>
              <UserCheck className="w-4 h-4" />
              Convert
            </>
          )}
        </div>
      </button>
    );
  };

  return (
    // <div className="">
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div>
        {/* Header */}
        <div className="mb-6 px-6 py-6 border-b border-gray-100 bg-primary-saffron">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <div>
              <h2 className=" text-xl font-bold text-white">Lead Management</h2>
              <p className="text-white">
                Manage and track your potential customers
              </p>
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 mt-4 font-medium
                 text-orange-600 transition-all duration-200
                  bg-white shadow-lg sm:mt-0 rounded-md hover:bg-orange-100"
            >
              <Plus className="w-5 h-5" />
              Add New Lead
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Success message */}
          {successMessage && (
            <div className="p-4 mb-6 text-green-700 border border-green-200 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                <div className="font-medium">{successMessage}</div>
              </div>
              <button
                onClick={() => setSuccessMessage("")}
                className="mt-2 text-sm text-green-600 underline hover:text-green-800"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-4 mb-6 text-red-700 border border-red-200 bg-red-50 rounded-xl">
              <div className="font-medium">Error:</div>
              <div>{error}</div>
              <button
                onClick={() => setError("")}
                className="mt-2 text-sm text-red-600 underline hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Lead Form Modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
              <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 rounded-t-lg bg-primary-saffron">
                  <h2 className="text-xl font-bold text-white">Add New Lead</h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="text-white hover:text-yellow-200 transition duration-200"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="p-6 space-y-4">
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      placeholder="Full Name *"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      placeholder="Email Address *"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleFormChange}
                      placeholder="Phone Number *"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                    <select
                      name="sources"
                      value={form.sources}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="" disabled hidden>
                        Sources
                      </option>
                      <option value="website">Website</option>
                      <option value="referral">Referral</option>
                      <option value="social_media">Social Media</option>
                      <option value="walk_in">Walk-in</option>
                      <option value="other">Other</option>
                    </select>

                    <select
                      name="comm"
                      value={form.comm}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="comm" disabled hidden>
                        Communication Log
                      </option>
                      <option value="email">Email</option>
                      <option value="call">Call</option>
                      <option value="meeting">Meeting</option>
                      <option value="message">Message</option>
                      <option value="other">Other</option>
                    </select>

                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleFormChange}
                      rows="2"
                      placeholder="Notes (optional)"
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          resetForm();
                        }}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-60 transition-all font-medium"
                      >
                        {submitting ? "Creating..." : "Create Lead"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Filters Section */}
          <div className="relative flex flex-col gap-4 mb-6 lg:flex-row">
            <div className="relative flex-grow">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search leads by name, email, phone, or notes..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-400 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3">
              {(searchTerm || statusFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                  }}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </button>
              )}

              <Filter className="w-5 h-5 text-gray-500" />

              <div>
                <div className="relative inline-block w-full max-w-xs">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="
                      w-full
                      pl-3 pr-10 py-2.5
                      text-gray-700
                      bg-white
                      border border-gray-300
                      rounded-lg
                      shadow-sm
                      focus:outline-none
                      focus:ring-2 focus:ring-orange-500
                      focus:border-transparent
                      appearance-none
                      transition-all
                      duration-150
                      ease-in-out
                      hover:border-gray-400
                    "
                  >
                    <option value="">All Status</option>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <div
                    className="
                  absolute
                  inset-y-0
                  right-0
                  flex
                  items-center
                  pr-2
                  pointer-events-none
                "
                  >
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 text-gray-500 transform -translate-y-1/2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
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
                  : "No leads match your filters"}
              </p>
              <p className="mb-6 text-gray-500">
                {leads.length === 0
                  ? "Add your first lead to get started with lead management."
                  : "Try adjusting your search or filter criteria."}
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
                  <thead className=" bg-secondary-green">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Lead Name
                        </div>
                      </th>
                      <th className="hidden px-6 py-4 text-xs font-semibold tracking-wider text-left  text-white uppercase md:table-cell">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          Contact
                        </div>
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left  text-white uppercase">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Source
                        </div>
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left  text-white uppercase">
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 mr-2" />
                          Status
                        </div>
                      </th>
                      <th className="hidden px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase sm:table-cell">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Created
                        </div>
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLeads.map((lead, index) => (
                      <tr
                        key={lead._id || lead.id}
                        className={`transition-all duration-200 hover:bg-orange-50 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {lead.name}
                          </div>
                          <div className="max-w-xs text-sm text-gray-500 truncate">
                            {lead.notes && lead.notes.length > 30
                              ? `${lead.notes.substring(0, 30)}...`
                              : lead.notes || "No notes"}
                          </div>
                        </td>
                        <td className="hidden px-6 py-4 md:table-cell">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lead.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {sourceLabels[lead.source] || lead.source}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="relative">
                            {" "}
                            {/* Keep this relative div for positioning */}
                            <select
                              value={lead.status}
                              onChange={async (e) => {
                                try {
                                  await api.put(`/lead/${lead._id}`, {
                                    status: e.target.value,
                                  });
                                  loadLeads();
                                } catch (error) {
                                  console.error("Error:", error.response?.data);
                                  setError(
                                    error.response?.data?.message ||
                                      "Update failed"
                                  );
                                }
                              }}
                              // Combine all necessary Tailwind classes here.
                              // The `appearance-none` hides the default arrow.
                              // The `bg-[url(...)]` provides your custom arrow.
                              // Ensure `pr-7` or a similar padding is sufficient for your arrow.
                              className={`
                                      appearance-none
                                      px-3 py-1 text-xs font-semibold rounded-full border
                                      ${
                                        statusColors[lead.status] ||
                                        "bg-gray-50 text-gray-700 border-gray-200"
                                      }
                                      pr-7
                                      focus:outline-none focus:ring-1 focus:ring-orange-500
                                      bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27gray%27%3E%3Cpath d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27/%3E%3C/svg%3E')]
                                      bg-no-repeat bg-right bg-[length:1rem]
                                      
                                      /* Add these for consistent arrow hiding across browsers if not already covered by appearance-none */
                                      /* For Firefox */
                                      [-moz-appearance:none]
                                      /* For Webkit (Chrome, Safari) */
                                      [-webkit-appearance:none]
                                      /* For IE 10+ (requires a separate CSS rule, typically) */
                                      /* If you need IE10/11 support, you'll need a global CSS rule like: */
                                      /* select::-ms-expand { display: none; } */
                                    `}
                            >
                              {/* Current status (display only) */}
                              <option
                                value={lead.status}
                                disabled
                                className="bg-white"
                              >
                                {statusLabels[lead.status] || lead.status}
                              </option>

                              {/* Options for NEW leads */}
                              {lead.status === "new" && (
                                <>
                                  <option value="contacted">Contacted</option>
                                  <option value="lost">Lost</option>
                                </>
                              )}

                              {/* Options for CONTACTED leads */}
                              {lead.status === "contacted" && (
                                <>
                                  <option value="lost">Lost</option>
                                </>
                              )}
                            </select>
                          </div>
                        </td>

                        <td className="hidden px-6 py-4 text-sm font-medium text-gray-500 sm:table-cell">
                          {formatDate(lead.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          {renderConvertButton(lead)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    // </div>
  );
}