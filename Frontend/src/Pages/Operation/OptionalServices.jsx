import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus, Edit, Eye, EyeOff } from "lucide-react";
import api from "../../api/auth";

// API Service functions
const optionalServiceService = {
  getAllServices: async () => {
    const response = await api.get("/optService");
    return response.data;
  },

  getActiveServices: async () => {
    const response = await api.get("/optService/active");
    return response.data;
  },

  createService: async (data) => {
    const response = await api.post("/optService", data);
    return response.data;
  },

  updateService: async (id, data) => {
    const response = await api.put(`/optService/${id}`, data);
    return response.data;
  },

  updateServiceStatus: async (id, isActive) => {
    const response = await api.put(`/optService/${id}/status`, {
      is_active: isActive,
    });
    return response.data;
  },

  deleteService: async (id) => {
    const response = await api.delete(`/optService/${id}`);
    return response.data;
  },
};

// Empty service template
const emptyService = {
  name: "",
  description: "",
  price: "",
  is_active: true,
};

// Form Input Component
const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  options = [],
  placeholder = "",
}) => (
  <div className="mb-4">
    <label className="block text-orange-900 font-medium mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        required={required}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : type === "textarea" ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows="3"
        className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
        required={required}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
        step={type === "number" ? "0.01" : undefined}
        className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        required={required}
      />
    )}
  </div>
);

// Service Row Component
const ServiceRow = ({ service, index, onEdit, onToggleStatus, onDelete }) => (
  <tr className={index % 2 === 0 ? "bg-white" : "bg-orange-25"}>
    <td className="px-6 py-4 font-medium text-gray-900">{service.name}</td>
    <td className="px-6 py-4 text-gray-700">
      <div className="max-w-xs truncate" title={service.description}>
        {service.description || "No description"}
      </div>
    </td>
    <td className="px-6 py-4 font-semibold text-orange-600">
      Rs.{service.price}
    </td>
    <td className="px-6 py-4">
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          service.is_active
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {service.is_active ? "Active" : "Inactive"}
      </span>
    </td>
    <td className="px-6 py-4">
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(service)}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
          title="Edit Service"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => onToggleStatus(service._id, !service.is_active)}
          className={`p-2 rounded-lg transition-colors ${
            service.is_active
              ? "bg-red-100 hover:bg-red-200 text-red-700"
              : "bg-green-100 hover:bg-green-200 text-green-700"
          }`}
          title={service.is_active ? "Deactivate" : "Activate"}
        >
          {service.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        <button
          onClick={() => onDelete(service._id, service.name)}
          className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
          title="Delete Service"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </td>
  </tr>
);

// Service Form Modal Component
const ServiceFormModal = ({
  isEdit,
  isOpen,
  formData,
  onInputChange,
  onSave,
  onClose,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-orange-900 mb-6">
          {isEdit ? "Edit Service" : "Create New Service"}
        </h2>

        <div>
          <FormInput
            label="Service Name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="Enter service name"
            required
          />

          <FormInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={onInputChange}
            type="textarea"
            placeholder="Enter service description"
          />

          <FormInput
            label="Price (Rs.)"
            name="price"
            value={formData.price}
            onChange={onInputChange}
            type="number"
            placeholder="0.00"
            required
          />

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={(e) =>
                  onInputChange({
                    target: { name: "is_active", value: e.target.checked },
                  })
                }
                className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-orange-300 rounded"
              />
              <span className="text-orange-900 font-medium">
                Active Service
              </span>
            </label>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isLoading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : isEdit ? (
                "Update"
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const OptionalServicesDashboard = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalState, setModalState] = useState({
    createForm: false,
    editForm: false,
  });
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({ ...emptyService });
  const [currentView, setCurrentView] = useState("all"); // 'all' or 'active'

  const fetchServices = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) setIsRefreshing(true);
      else setIsLoading(true);

      const response =
        currentView === "active"
          ? await optionalServiceService.getActiveServices()
          : await optionalServiceService.getAllServices();

      if (response.success) {
        setServices(response.data || []);
      } else {
        throw new Error(response.message || "Failed to fetch services");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load services");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [currentView]);

  const handleFormInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openCreateModal = () => {
    setFormData({ ...emptyService, is_active: true });
    setModalState((prev) => ({ ...prev, createForm: true }));
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      price: service.price.toString(),
      is_active: service.is_active,
    });
    setModalState((prev) => ({ ...prev, editForm: true }));
  };

  const closeAllModals = () => {
    setModalState({ createForm: false, editForm: false });
    setSelectedService(null);
    setFormData({ ...emptyService });
  };

  const handleCreateService = async () => {
    if (!formData.name.trim() || !formData.price) {
      return toast.error("Please fill in all required fields");
    }

    if (parseFloat(formData.price) < 0) {
      return toast.error("Price cannot be negative");
    }

    try {
      setIsSaving(true);
      const response = await optionalServiceService.createService({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        is_active: formData.is_active,
      });

      if (response.success) {
        closeAllModals();
        toast.success(response.message || "Service created successfully");
        await fetchServices(true);
      } else {
        throw new Error(response.message || "Creation failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Creation failed"
      );
      console.error("Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateService = async () => {
    if (!selectedService || !formData.name.trim() || !formData.price) {
      return toast.error("Please fill in all required fields");
    }

    if (parseFloat(formData.price) < 0) {
      return toast.error("Price cannot be negative");
    }

    try {
      setIsSaving(true);
      const response = await optionalServiceService.updateService(
        selectedService._id,
        {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          is_active: formData.is_active,
        }
      );

      if (response.success) {
        closeAllModals();
        toast.success(response.message || "Service updated successfully");
        await fetchServices(true);
      } else {
        throw new Error(response.message || "Update failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Update failed"
      );
      console.error("Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (serviceId, isActive) => {
    try {
      const response = await optionalServiceService.updateServiceStatus(
        serviceId,
        isActive
      );
      if (response.success) {
        toast.success(response.message || "Status updated successfully");
        await fetchServices(true);
      } else {
        throw new Error(response.message || "Status update failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed");
      console.error("Error:", error);
    }
  };

  const handleDeleteService = async (serviceId, serviceName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${serviceName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await optionalServiceService.deleteService(serviceId);
      if (response.success) {
        toast.success(response.message || "Service deleted successfully");
        await fetchServices(true);
      } else {
        throw new Error(response.message || "Delete failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
      console.error("Error:", error);
    }
  };

  const handleManualRefresh = () => fetchServices(true);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-800">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4  bg-white rounded-lg shadow-md">
      {/* Header Section */}
      <div
        className=" px-6 py-8 border-b border-gray-100
       bg-primary-saffron"
      >
        <div className="">
          <div className=" flex justify-between items-center">
            <div className="">
              <h1 className="text-xl font-bold text-white">
                Optional Services Management
              </h1>
              {isRefreshing && (
                <div className="flex items-center gap-2 text-orange-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-orange-600"></div>
                  <span className="text-sm">Refreshing...</span>
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              <select
                value={currentView}
                className="flex items-center gap-2 px-6 py-2 mx-auto  rounded-md text-sm
                 text-orange-600 transition-all duration-200
                  bg-white shadow-lg sm:mt-0 hover:bg-orange-100"
              >
                <option value="all">All Services</option>
                <option value="active">Active Only</option>
              </select>
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-6 py-2 mx-auto  rounded-md text-sm
                 text-orange-600 transition-all duration-200
                  bg-white shadow-lg sm:mt-0 hover:bg-orange-100"
              >
                Refresh
              </button>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 px-6 py-2 mx-auto  rounded-md text-sm
                 text-orange-600 transition-all duration-200
                  bg-white shadow-lg sm:mt-0 hover:bg-orange-100"
              >
                <Plus size={20} />
                Add Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className=" mx-auto max-w-7xl py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className=" bg-secondary-green">
                <tr className="text-white uppercase">
                  <th className="px-4 py-3 border-r text-left border-green-700">
                    Description
                  </th>
                  <th className="px-4 py-3 border-r text-left border-green-700">
                    Service Name
                  </th>
                  <th className="px-4 py-3 border-r text-left border-green-700">
                    Price
                  </th>
                  <th className="px-4 py-3 border-r text-left border-green-700">
                    Status
                  </th>
                  <th className="px-4 py-3 border-r text-left border-green-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.length > 0 ? (
                  services.map((service, index) => (
                    <ServiceRow
                      key={service._id}
                      service={service}
                      index={index}
                      onEdit={openEditModal}
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDeleteService}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <p className="text-lg font-medium">No services found</p>
                        <p className="text-sm">
                          Create your first optional service to get started!
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ServiceFormModal
        isEdit={false}
        isOpen={modalState.createForm}
        formData={formData}
        onInputChange={handleFormInputChange}
        onSave={handleCreateService}
        onClose={closeAllModals}
        isLoading={isSaving}
      />

      <ServiceFormModal
        isEdit={true}
        isOpen={modalState.editForm}
        formData={formData}
        onInputChange={handleFormInputChange}
        onSave={handleUpdateService}
        onClose={closeAllModals}
        isLoading={isSaving}
      />
    </div>
  );
};

export default OptionalServicesDashboard;
