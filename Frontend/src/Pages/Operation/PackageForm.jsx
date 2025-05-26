import React, { useState } from 'react';
import { Plus, Edit, Eye, MapPin, Calendar, Clock, Users, X, Save } from 'lucide-react';

const PackageDashboard = () => {
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "Divine Char Dham Yatra",
      duration: "12 Days",
      price: "₹45,000",
      destinations: "Kedarnath, Badrinath, Gangotri, Yamunotri",
      maxPeople: 25,
      status: "Active",
      itinerary: [
        {
          day: 1,
          title: "Arrival in Haridwar",
          description: "Check-in at hotel, evening Ganga Aarti at Har Ki Pauri",
          activities: ["Hotel check-in", "Ganga Aarti", "Local sightseeing"],
          meals: "Dinner",
          accommodation: "Hotel Ganga Lahari"
        }
      ]
    },
    {
      id: 2,
      name: "Golden Triangle with Varanasi",
      duration: "8 Days",
      price: "₹32,000",
      destinations: "Delhi, Agra, Jaipur, Varanasi",
      maxPeople: 20,
      status: "Active",
      itinerary: []
    },
    {
      id: 3,
      name: "South India Temple Tour",
      duration: "10 Days",
      price: "₹38,000",
      destinations: "Chennai, Madurai, Rameswaram, Kanyakumari",
      maxPeople: 30,
      status: "Draft",
      itinerary: []
    }
  ]);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showItinerary, setShowItinerary] = useState(false);
  const [showItineraryForm, setShowItineraryForm] = useState(false);
  const [newPackage, setNewPackage] = useState({
    name: '',
    duration: '',
    price: '',
    destinations: '',
    maxPeople: '',
    status: 'Draft'
  });
  const [newItinerary, setNewItinerary] = useState({
    day: 1,
    title: '',
    description: '',
    activities: [''],
    meals: '',
    accommodation: ''
  });

  const handleCreatePackage = () => {
    if (newPackage.name && newPackage.duration && newPackage.price) {
      const packageToAdd = {
        ...newPackage,
        id: packages.length + 1,
        itinerary: []
      };
      setPackages([...packages, packageToAdd]);
      setNewPackage({
        name: '',
        duration: '',
        price: '',
        destinations: '',
        maxPeople: '',
        status: 'Draft'
      });
      setShowCreateForm(false);
    }
  };

  const handleEditPackage = (pkg) => {
    setSelectedPackage(pkg);
    setNewPackage({ ...pkg });
    setShowEditForm(true);
  };

  const handleUpdatePackage = () => {
    setPackages(packages.map(pkg => 
      pkg.id === selectedPackage.id ? { ...newPackage, id: selectedPackage.id } : pkg
    ));
    setShowEditForm(false);
    setSelectedPackage(null);
  };

  const handleViewItinerary = (pkg) => {
    setSelectedPackage(pkg);
    setShowItinerary(true);
  };

  const handleAddItinerary = () => {
    const nextDay = selectedPackage.itinerary.length + 1;
    setNewItinerary({
      day: nextDay,
      title: '',
      description: '',
      activities: [''],
      meals: '',
      accommodation: ''
    });
    setShowItinerary(false); // Close the itinerary view
    setShowItineraryForm(true);
  };

  const handleSaveItinerary = () => {
    const updatedPackage = {
      ...selectedPackage,
      itinerary: [...selectedPackage.itinerary, newItinerary]
    };
    setPackages(packages.map(pkg => 
      pkg.id === selectedPackage.id ? updatedPackage : pkg
    ));
    setSelectedPackage(updatedPackage);
    setShowItineraryForm(false);
    setShowItinerary(true); // Return to itinerary view
  };

  const addActivity = () => {
    setNewItinerary({
      ...newItinerary,
      activities: [...newItinerary.activities, '']
    });
  };

  const updateActivity = (index, value) => {
    const updatedActivities = [...newItinerary.activities];
    updatedActivities[index] = value;
    setNewItinerary({
      ...newItinerary,
      activities: updatedActivities
    });
  };

  const removeActivity = (index) => {
    setNewItinerary({
      ...newItinerary,
      activities: newItinerary.activities.filter((_, i) => i !== index)
    });
  };

  const closeAllModals = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowItinerary(false);
    setShowItineraryForm(false);
    setSelectedPackage(null);
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-orange-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-orange-900">Package Management</h1>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <Plus size={20} />
              Create Package
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-orange-100">
                <tr>
                  <th className="px-6 py-4 text-left text-orange-900 font-semibold">Package Name</th>
                  <th className="px-6 py-4 text-left text-orange-900 font-semibold">Duration</th>
                  <th className="px-6 py-4 text-left text-orange-900 font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-orange-900 font-semibold">Destinations</th>
                  <th className="px-6 py-4 text-left text-orange-900 font-semibold">Max People</th>
                  <th className="px-6 py-4 text-left text-orange-900 font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-orange-900 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg, index) => (
                  <tr key={pkg.id} className={`border-b ${index % 2 === 0 ? 'bg-orange-25' : 'bg-white'} hover:bg-orange-50 transition-colors`}>
                    <td className="px-6 py-4 font-medium text-gray-900">{pkg.name}</td>
                    <td className="px-6 py-4 text-gray-700">{pkg.duration}</td>
                    <td className="px-6 py-4 text-orange-700 font-semibold">{pkg.price}</td>
                    <td className="px-6 py-4 text-gray-700">{pkg.destinations}</td>
                    <td className="px-6 py-4 text-gray-700">{pkg.maxPeople}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        pkg.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewItinerary(pkg)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Itinerary"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditPackage(pkg)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit Package"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Package Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-orange-900">Create New Package</h2>
              <button onClick={closeAllModals} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-orange-800 font-medium mb-1 text-sm">Package Name</label>
                <input
                  type="text"
                  value={newPackage.name}
                  onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
                  className="w-full p-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  placeholder="Enter package name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-orange-800 font-medium mb-1 text-sm">Duration</label>
                  <input
                    type="text"
                    value={newPackage.duration}
                    onChange={(e) => setNewPackage({...newPackage, duration: e.target.value})}
                    className="w-full p-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    placeholder="e.g., 7 Days"
                  />
                </div>
                <div>
                  <label className="block text-orange-800 font-medium mb-1 text-sm">Price</label>
                  <input
                    type="text"
                    value={newPackage.price}
                    onChange={(e) => setNewPackage({...newPackage, price: e.target.value})}
                    className="w-full p-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    placeholder="e.g., ₹25,000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-orange-800 font-medium mb-1 text-sm">Destinations</label>
                <input
                  type="text"
                  value={newPackage.destinations}
                  onChange={(e) => setNewPackage({...newPackage, destinations: e.target.value})}
                  className="w-full p-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  placeholder="e.g., Delhi, Agra, Jaipur"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-orange-800 font-medium mb-1 text-sm">Max People</label>
                  <input
                    type="number"
                    value={newPackage.maxPeople}
                    onChange={(e) => setNewPackage({...newPackage, maxPeople: e.target.value})}
                    className="w-full p-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    placeholder="e.g., 20"
                  />
                </div>
                <div>
                  <label className="block text-orange-800 font-medium mb-1 text-sm">Status</label>
                  <select
                    value={newPackage.status}
                    onChange={(e) => setNewPackage({...newPackage, status: e.target.value})}
                    className="w-full p-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleCreatePackage}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg font-medium transition-colors text-sm"
              >
                Create Package
              </button>
              <button
                onClick={closeAllModals}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2.5 rounded-lg font-medium transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Package Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-orange-900">Edit Package</h2>
              <button onClick={closeAllModals} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-orange-800 font-medium mb-1 text-sm">Package Name</label>
                <input
                  type="text"
                  value={newPackage.name}
                  onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
                  className="w-full p-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-orange-800 font-medium mb-1 text-sm">Duration</label>
                  <input
                    type="text"
                    value={newPackage.duration}
                    onChange={(e) => setNewPackage({...newPackage, duration: e.target.value})}
                    className="w-full p-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-orange-800 font-medium mb-1 text-sm">Price</label>
                  <input
                    type="text"
                    value={newPackage.price}
                    onChange={(e) => setNewPackage({...newPackage, price: e.target.value})}
                    className="w-full p-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-orange-800 font-medium mb-1 text-sm">Destinations</label>
                <input
                  type="text"
                  value={newPackage.destinations}
                  onChange={(e) => setNewPackage({...newPackage, destinations: e.target.value})}
                  className="w-full p-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-orange-800 font-medium mb-1 text-sm">Max People</label>
                  <input
                    type="number"
                    value={newPackage.maxPeople}
                    onChange={(e) => setNewPackage({...newPackage, maxPeople: e.target.value})}
                    className="w-full p-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-orange-800 font-medium mb-1 text-sm">Status</label>
                  <select
                    value={newPackage.status}
                    onChange={(e) => setNewPackage({...newPackage, status: e.target.value})}
                    className="w-full p-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleUpdatePackage}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg font-medium transition-colors text-sm"
              >
                Update Package
              </button>
              <button
                onClick={closeAllModals}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2.5 rounded-lg font-medium transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Itinerary View Modal */}
      {showItinerary && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-orange-900">{selectedPackage.name} - Itinerary</h2>
                <p className="text-orange-700">{selectedPackage.duration} • {selectedPackage.destinations}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddItinerary}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus size={16} />
                  Add Day {selectedPackage.itinerary.length + 1}
                </button>
                <button
                  onClick={closeAllModals}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              {selectedPackage.itinerary.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-orange-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No itinerary added yet</h3>
                  <p className="text-gray-500 mb-4">Start building your day-by-day itinerary</p>
                  <button
                    onClick={handleAddItinerary}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                  >
                    <Plus size={16} />
                    Add First Day
                  </button>
                </div>
              ) : (
                selectedPackage.itinerary.map((day, index) => (
                  <div key={index} className="border border-orange-200 rounded-lg p-6 bg-orange-50">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        {day.day}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-orange-900">{day.title}</h3>
                        <p className="text-orange-700">{day.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                          <MapPin size={16} />
                          Activities
                        </h4>
                        <ul className="text-gray-700 space-y-1">
                          {day.activities.map((activity, i) => (
                            <li key={i} className="text-sm">• {activity}</li>
                          ))}
                        </ul>
                      </div>
                      
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
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Itinerary Modal */}
      {showItineraryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 pt-20">
          <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4 max-h-[75vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-bold text-orange-900">Add Day {newItinerary.day}</h2>
              <button
                onClick={() => {
                  setShowItineraryForm(false);
                  setShowItinerary(true);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-2.5">
              <div>
                <label className="block text-orange-800 font-medium mb-1 text-xs">Day Title</label>
                <input
                  type="text"
                  value={newItinerary.title}
                  onChange={(e) => setNewItinerary({...newItinerary, title: e.target.value})}
                  className="w-full p-2 border border-orange-200 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-transparent text-sm"
                  placeholder="e.g., Arrival in Delhi"
                />
              </div>
              
              <div>
                <label className="block text-orange-800 font-medium mb-1 text-xs">Description</label>
                <textarea
                  value={newItinerary.description}
                  onChange={(e) => setNewItinerary({...newItinerary, description: e.target.value})}
                  className="w-full p-2 border border-orange-200 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-transparent h-12 text-sm resize-none"
                  placeholder="Brief description"
                />
              </div>
              
              <div>
                <label className="block text-orange-800 font-medium mb-1 text-xs">Activities</label>
                {newItinerary.activities.map((activity, index) => (
                  <div key={index} className="flex gap-1 mb-1.5">
                    <input
                      type="text"
                      value={activity}
                      onChange={(e) => updateActivity(index, e.target.value)}
                      className="flex-1 p-2 border border-orange-200 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-transparent text-sm"
                      placeholder="Enter activity"
                    />
                    {newItinerary.activities.length > 1 && (
                      <button
                        onClick={() => removeActivity(index)}
                        className="px-1.5 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addActivity}
                  className="text-orange-600 hover:text-orange-700 text-xs font-medium"
                >
                  + Add Activity
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-orange-800 font-medium mb-1 text-xs">Meals</label>
                  <input
                    type="text"
                    value={newItinerary.meals}
                    onChange={(e) => setNewItinerary({...newItinerary, meals: e.target.value})}
                    className="w-full p-2 border border-orange-200 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-transparent text-sm"
                    placeholder="Breakfast, Lunch"
                  />
                </div>
                <div>
                  <label className="block text-orange-800 font-medium mb-1 text-xs">Accommodation</label>
                  <input
                    type="text"
                    value={newItinerary.accommodation}
                    onChange={(e) => setNewItinerary({...newItinerary, accommodation: e.target.value})}
                    className="w-full p-2 border border-orange-200 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-transparent text-sm"
                    placeholder="Hotel name"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSaveItinerary}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1 text-sm"
              >
                <Save size={12} />
                Save Day {newItinerary.day}
              </button>
              <button
                onClick={() => {
                  setShowItineraryForm(false);
                  setShowItinerary(true);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md font-medium transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDashboard;