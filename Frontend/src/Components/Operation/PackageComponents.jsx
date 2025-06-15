import React from "react";
import {
  Plus,
  Edit,
  Eye,
  MapPin,
  Calendar,
  Clock,
  Users,
  X,
  Save,
} from "lucide-react";

export const emptyPackage = {
  name: "",
  duration: "",
  price: "",
  destinations: "",
  inclusions: "",
  exclusions: "",
  status: "Active",
};

export const emptyItinerary = {
  day: 1,
  title: "",
  description: "",
  meals: "",
  accommodation: "",
};

export const PackageFormModal = ({
  isEdit,
  isOpen,
  formData,
  onInputChange,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 rounded-t-lg bg-primary-saffron">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? "Edit Package" : "Create New Package"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-yellow-200 transition duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <form>
          <div className="p-4 space-y-2">
            <FormInput
              name="name"
              value={formData.name}
              onChange={onInputChange}
              placeholder="Enter package name"
            />

            <div className="grid grid-cols-2 gap-1">
              <FormInput
                name="duration"
                value={formData.duration}
                onChange={onInputChange}
                placeholder="Enter duration(days) e.g., 7"
                type="number"
              />

              <FormInput
                name="price"
                value={formData.price}
                onChange={onInputChange}
                placeholder="Enter Price e.g., 25000"
                type="number"
              />
            </div>

            <FormTextarea
              name="destinations"
              value={formData.destinations}
              onChange={onInputChange}
              placeholder="Enter Package description"
            />

            <FormTextarea
              name="inclusions"
              value={formData.inclusions}
              onChange={onInputChange}
              placeholder="What's included in the package"
            />

            <FormTextarea
              name="exclusions"
              value={formData.exclusions}
              onChange={onInputChange}
              placeholder="What's not included in the package"
             />

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="flex-1 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-60 transition-all font-medium"
              >
                {isEdit ? "Update Package" : "Create Package"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ItineraryViewModal = ({
  isOpen,
  selectedPackage,
  onClose,
  onAddDay,
  onEditDay,
}) => {
  if (!isOpen || !selectedPackage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-orange-900">
              {selectedPackage.name} - Itinerary
            </h2>
            <p className="text-orange-700">
              {selectedPackage.duration} days • {selectedPackage.destinations}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onAddDay}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Add Day {selectedPackage.itinerary?.length + 1}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {selectedPackage.itinerary?.length === 0 ? (
            <EmptyItinerary onAdd={onAddDay} />
          ) : (
            selectedPackage.itinerary?.map((day, index) => (
              <DayCard key={index} day={day} onEdit={onEditDay} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export const ItineraryFormModal = ({
  isOpen,
  itineraryData,
  onInputChange,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-orange-900">
            {itineraryData.id ? "Edit" : "Add"} Day {itineraryData.day}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <FormInput
            label="Day Title"
            name="title"
            value={itineraryData.title}
            onChange={onInputChange}
            placeholder="e.g., Arrival in Delhi"
          />

          <FormTextarea
            label="Description"
            name="description"
            value={itineraryData.description}
            onChange={onInputChange}
            placeholder="Detailed day description"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Meals"
              name="meals"
              value={itineraryData.meals}
              onChange={onInputChange}
              placeholder="Breakfast, Lunch"
            />
            <FormInput
              label="Accommodation"
              name="accommodation"
              value={itineraryData.accommodation}
              onChange={onInputChange}
              placeholder="Hotel name"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onSave}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {itineraryData.id ? "Update Day" : "Save Day"} {itineraryData.day}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export const FormInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  small = false,
}) => (
  <div>
    <label
      className={`block text-orange-800 font-medium mb-1 ${
        small ? "text-xs" : "text-sm"
      }`}
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`w-full ${
        small ? "p-2 text-sm" : "p-2.5"
      } border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
      placeholder={placeholder}
    />
  </div>
);

export const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  small = false,
}) => (
  <div>
    <label
      className={`block text-orange-800 font-medium mb-1 ${
        small ? "text-xs" : "text-sm"
      }`}
    >
      {label}
    </label>
    <textarea
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`w-full p-2 border border-orange-200 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-transparent ${
        small ? "h-12 text-sm" : "h-20"
      } resize-none`}
      placeholder={placeholder}
    />
  </div>
);

export const PackageRow = ({ pkg, index, onView, onEdit, onToggleStatus }) => (
  <tr
    className={`border-b ${
      index % 2 === 0 ? "bg-orange-25" : "bg-white"
    } hover:bg-orange-50 transition-colors`}
  >
    <td className="px-6 py-4 font-medium text-gray-900">{pkg.name}</td>
    <td className="px-6 py-4 text-gray-700">{pkg.duration}</td>
    <td className="px-6 py-4 text-orange-700 font-semibold">Rs.{pkg.price}</td>
    <td className="px-6 py-4 text-gray-700">{pkg.destinations}</td>
    <td className="px-6 py-4">
      <select
        value={pkg.status}
        onChange={(e) => onToggleStatus(pkg.id, e.target.value === "Active")}
        className={`px-6 py-1 rounded-full text-sm font-medium ${
          pkg.status === "Active"
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : "bg-red-100 text-red-800 hover:bg-red-200"
        }`}
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </td>
    <td className="px-6 py-4">
      <div className="flex gap-2">
        <button
          onClick={() => onView(pkg)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Itinerary"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => onEdit(pkg)}
          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
          title="Edit Package"
        >
          <Edit size={16} />
        </button>
      </div>
    </td>
  </tr>
);

export const DayCard = ({ day, onEdit }) => (
  <div className="border border-orange-200 rounded-lg p-6 bg-orange-50 relative">
    <div className="absolute top-4 right-4 flex gap-2">
      <button
        onClick={() => onEdit(day)}
        className="text-orange-600 hover:bg-orange-100 p-1 rounded-lg transition-colors"
        title="Edit Day"
      >
        <Edit size={16} />
      </button>
    </div>

    <div className="flex items-start gap-4 mb-4">
      <div className="flex flex-col">
        <h3 className="text-lg font-bold text-orange-600 mb-2">
          Day {day.day_number || day.day}
        </h3>
        <h2 className="text-xl font-bold text-orange-900">{day.title}</h2>
      </div>
    </div>

    <p className="text-orange-700 mb-6">{day.description}</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
          <Clock size={16} />
          Meals
        </h4>
        <p className="text-gray-700 text-sm">{day.meals}</p>
      </div>

      <div>
        <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
          <Users size={16} />
          Accommodation
        </h4>
        <p className="text-gray-700 text-sm">{day.accommodation}</p>
      </div>
    </div>
  </div>
);

export const EmptyItinerary = ({ onAdd }) => (
  <div className="text-center py-12">
    <Calendar className="mx-auto h-12 w-12 text-orange-300 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No itinerary added yet
    </h3>
    <p className="text-gray-500 mb-4">
      Start building your day-by-day itinerary
    </p>
    <button
      onClick={onAdd}
      className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
    >
      <Plus size={16} />
      Add First Day
    </button>
  </div>
);
