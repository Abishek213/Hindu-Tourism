import { useState, useEffect } from "react";

const defaultFormData = {
  title: "",
  description: "",
  duration: "",
  destination: "",
  price: "",
  inclusions: "",
  exclusions: "",
};

export default function PackageForm({ initialData = null, onSubmit = (data) => console.log('Form submitted:', data) }) {
  const [formData, setFormData] = useState(defaultFormData);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Package title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required";
    if (!formData.destination) newErrors.destination = "Destination is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

<<<<<<< HEAD
  const handleUpdatePackage = async () => {
    if (!selectedPackage) return;

    try {
      await packageService.updatePackage(selectedPackage.id, {
        title: formData.name,
        duration_days: Number(formData.duration),
        base_price: Number(formData.price),
        description: formData.description,
        inclusions: formData.inclusions,
        exclusions: formData.exclusions
      });
      closeAllModals();
      toast.success('Package updated');
      await fetchPackages(true);
    } catch (error) {
      toast.error(error.message || 'Update failed');
      console.error('Error:', error);
    }
  };

  const handleToggleStatus = async (pkgId, isActive) => {
    try {
      await packageService.updatePackageStatus(pkgId, isActive);
      toast.success('Status updated');
      await fetchPackages(true);
    } catch (error) {
      toast.error('Status update failed');
      console.error('Error:', error);
    }
  };

  const handleViewItinerary = (pkg) => {
    setSelectedPackage(pkg);
    setModalState(prev => ({ ...prev, itineraryView: true }));
  };

  const prepareNewItinerary = () => {
    const nextDay = selectedPackage.itinerary.length + 1;
    setItineraryData({ ...emptyItinerary, day: nextDay });
    setModalState({ itineraryView: false, itineraryForm: true });
  };

  const handleEditItinerary = (itinerary) => {
    setItineraryData({
      id: itinerary.id,
      day: itinerary.day,
      title: itinerary.title,
      description: itinerary.description,
      meals: itinerary.meals,
      accommodation: itinerary.accommodation
    });
    setModalState({ itineraryView: false, itineraryForm: true });
  };

  const handleSaveItinerary = async () => {
    if (!selectedPackage) return;

    try {
      if (itineraryData.id) {
        await packageService.updateItinerary(itineraryData.id, {
          day_number: Number(itineraryData.day),
          title: itineraryData.title,
          description: itineraryData.description,
          meals: itineraryData.meals,
          accommodation: itineraryData.accommodation
        });
      } else {
        await packageService.addItinerary(selectedPackage.id, {
          day_number: Number(itineraryData.day),
          title: itineraryData.title,
          description: itineraryData.description,
          meals: itineraryData.meals,
          accommodation: itineraryData.accommodation
        });
      }

      await fetchPackages(true);
      const updatedPackages = await packageService.getAllPackages();
      const refreshedPackage = updatedPackages.find(p => p._id === selectedPackage.id);
      
      if (refreshedPackage) {
        setSelectedPackage({
          ...selectedPackage,
          itinerary: refreshedPackage.itineraries.map(it => ({
            id: it._id,
            day: it.day_number,
            title: it.title,
            description: it.description,
            meals: it.meals,
            accommodation: it.accommodation
          }))
        });
        setModalState({ itineraryForm: false, itineraryView: true });
      }
      
      toast.success(`Itinerary ${itineraryData.id ? 'updated' : 'added'}`);
    } catch (error) {
      toast.error('Operation failed');
      console.error('Error:', error);
    }
  };

  const handleManualRefresh = () => fetchPackages(true);

  if (isLoading) {
    return (
      <div className="p-4  bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-800">Loading packages...</p>
        </div>
=======
  const InputField = ({ label, name, type = "text", required = false, children, className = "", placeholder = "" }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-orange-800">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {children || (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField(null)}
            placeholder={placeholder}
            className={`w-full px-3 py-2.5 bg-white border-2 rounded-lg transition-all duration-200 ${
              focusedField === name
                ? 'border-orange-400 shadow-md'
                : errors[name]
                ? 'border-red-300'
                : 'border-orange-200 hover:border-orange-300'
            } focus:outline-none placeholder-gray-400 text-sm ${className}`}
            required={required}
          />
        )}
>>>>>>> b9586c5f066ff1a376602850e4317a0b930261e5
      </div>
      {errors[name] && (
        <p className="text-red-500 text-xs">{errors[name]}</p>
      )}
    </div>
  );

  const TextareaField = ({ label, name, rows = 2, required = false, placeholder = "" }) => (
    <InputField label={label} name={name} required={required} placeholder={placeholder}>
      <textarea
        name={name}
        value={formData[name]}
        onChange={handleChange}
        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField(null)}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 bg-white border-2 rounded-lg transition-all duration-200 resize-none text-sm ${
          focusedField === name
            ? 'border-orange-400 shadow-md'
            : errors[name]
            ? 'border-red-300'
            : 'border-orange-200 hover:border-orange-300'
        } focus:outline-none placeholder-gray-400`}
        required={required}
      />
    </InputField>
  );

  return (
<<<<<<< HEAD
    <div className="p-4  bg-white rounded-lg shadow-md">
      {/* Header Section */}

          <div className="mb-6 flex justify-between items-center px-6 py-8 border-b border-gray-100
       bg-primary-saffron">
              <h1 className="text-xl font-bold text-white">Package Management</h1>
              {isRefreshing && (
                <div className="flex items-center gap-2 text-orange-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-orange-600"></div>
                  <span className="text-sm">Refreshing...</span>
                </div>
              )}
            <div className="flex space-x-4">
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
               className="px-4 py-2 text-sm rounded-md  text-orange-600 transition-all duration-200
                  bg-white shadow-lg sm:mt-0 hover:bg-orange-100"
          >
                Refresh
              </button>
              <button
                onClick={openCreateModal}
                className="px-4 py-2 text-sm rounded-md  text-orange-600 transition-all duration-200
                  bg-white shadow-lg sm:mt-0 hover:bg-orange-100"
          >
                
                Create Package
              </button>
            </div>
           </div>

      {/* Packages Table */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
             <thead className="bg-secondary-green border-secondary-green-700">
                <tr className="text-white font-semibold">
                  <th className="px-4 py-2 border-r border-green-700">Package Name</th>
                  <th className="px-4 py-2 border-r border-green-700">Duration</th>
                  <th className="px-4 py-2 border-r border-green-700">Price</th>
                  <th className="px-4 py-2 border-r border-green-700">Destinations</th>
                  <th className="px-4 py-2 border-r border-green-700">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {packages.length > 0 ? (
                  packages.map((pkg, index) => (
                    <PackageRow 
                      key={pkg.id} 
                      pkg={pkg} 
                      index={index}
                      onView={handleViewItinerary}
                      onEdit={openEditModal}
                      onToggleStatus={handleToggleStatus}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No packages found. Create your first package!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PackageFormModal
        isEdit={false}
        isOpen={modalState.createForm}
        formData={formData}
        onInputChange={handleFormInputChange}
        onSave={handleCreatePackage}
        onClose={closeAllModals}
      />

      <PackageFormModal
        isEdit={true}
        isOpen={modalState.editForm}
        formData={formData}
        onInputChange={handleFormInputChange}
        onSave={handleUpdatePackage}
        onClose={closeAllModals}
      />

      <ItineraryViewModal
        isOpen={modalState.itineraryView}
        selectedPackage={selectedPackage}
        onClose={closeAllModals}
        onAddDay={prepareNewItinerary}
        onEditDay={handleEditItinerary}
      />

      <ItineraryFormModal
        isOpen={modalState.itineraryForm}
        itineraryData={itineraryData}
        onInputChange={handleItineraryInputChange}
        onSave={handleSaveItinerary}
        onClose={() => setModalState({ itineraryForm: false, itineraryView: true })}
      />
=======
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-orange-800 mb-1">
            {initialData ? "Edit Package" : "Create Package"}
          </h1>
          <p className="text-orange-600 text-sm">Hindu Travels CRM</p>
        </div>

        {/* Compact Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-t-2xl">
            <h2 className="text-lg font-semibold text-white">Package Details</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-orange-800 mb-1.5">
                  Package Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Sacred Journey to Pashupatinath"
                  className="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                  required
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-orange-800 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description of the spiritual journey and what makes it special..."
                  className="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 resize-none"
                  required
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Package Details */}
            <div className="bg-orange-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Package Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-800 mb-1.5">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g., 3 Days 2 Nights"
                    className="w-full px-3 py-2.5 bg-white border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                    required
                  />
                  {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-orange-800 mb-1.5">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., ₹25,000 per person"
                    className="w-full px-3 py-2.5 bg-white border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                    required
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-orange-800 mb-1.5">
                    Destination <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all duration-200 text-gray-700 cursor-pointer"
                    required
                  >
                    <option value="">Select Destination</option>
                    <option value="Pashupatinath">🕉️ Pashupatinath Temple</option>
                    <option value="Muktinath">🙏 Muktinath Temple</option>
                    <option value="Pashupatinath-Muktinath">✨ Both Sacred Sites</option>
                  </select>
                  {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination}</p>}
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-orange-800 mb-1.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  What's Included
                </label>
                <textarea
                  name="inclusions"
                  value={formData.inclusions}
                  onChange={handleChange}
                  rows={4}
                  placeholder="• Accommodation (3-star hotels)&#10;• All meals (breakfast, lunch, dinner)&#10;• AC transportation&#10;• Professional guide&#10;• Temple entry fees"
                  className="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-orange-800 mb-1.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  What's Excluded
                </label>
                <textarea
                  name="exclusions"
                  value={formData.exclusions}
                  onChange={handleChange}
                  rows={4}
                  placeholder="• Personal expenses & shopping&#10;• Travel insurance&#10;• Tips for guide/driver&#10;• Extra activities not mentioned&#10;• Flight tickets to/from Nepal"
                  className="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transform hover:scale-[1.01] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {initialData ? "Update Package" : "Create Package"}
              </button>
            </div>
          </div>
        </div>

        
      </div>
>>>>>>> b9586c5f066ff1a376602850e4317a0b930261e5
    </div>
  );
};

