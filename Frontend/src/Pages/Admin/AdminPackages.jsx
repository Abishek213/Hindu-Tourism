import { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, Pencil, Download, X, CalendarDays } from 'lucide-react';
import api from '../../api/auth';
import { toast } from 'react-toastify';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newPackage, setNewPackage] = useState({
    title: '',
    description: '',
    base_price: '',
    duration_days: '',
    inclusions: '',
    exclusions: '',
    brochure: null,
    is_active: true
  });
  const [editingId, setEditingId] = useState(null);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [currentPackageId, setCurrentPackageId] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [currentItinerary, setCurrentItinerary] = useState({
    day_number: '',
    title: '',
    description: '',
    accommodation: '',
    meals: '',
    transport: ''
  });
  const [editingItineraryId, setEditingItineraryId] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/package');
      setPackages(response.data);
    } catch (error) {
      toast.error('Failed to fetch packages');
      console.error('Error fetching packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchItineraries = async (packageId) => {
    try {
      const response = await api.get(`/package/${packageId}`);
      setItineraries(response.data.itineraries || []);
    } catch (error) {
      toast.error('Failed to fetch itineraries');
      console.error('Error fetching itineraries:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'brochure') {
      setNewPackage({ ...newPackage, brochure: files[0] });
    } else {
      setNewPackage({ ...newPackage, [name]: value });
    }
  };

  const handleItineraryChange = (e) => {
    const { name, value } = e.target;
    setCurrentItinerary({ ...currentItinerary, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    for (const key in newPackage) {
      if (key === 'brochure') {
        if (newPackage[key]) formData.append(key, newPackage[key]);
      } else if (newPackage[key] !== null && newPackage[key] !== undefined) {
        formData.append(key, newPackage[key]);
      }
    }

    try {
      if (editingId) {
        await api.put(`/package/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Package updated successfully');
      } else {
        await api.post('/package', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Package created successfully');
      }
      fetchPackages();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItinerarySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItineraryId) {
        await api.put(`/package/itineraries/${editingItineraryId}`, currentItinerary);
        toast.success('Itinerary updated successfully');
      } else {
        await api.post(`/package/${currentPackageId}/itineraries`, currentItinerary);
        toast.success('Itinerary added successfully');
      }
      fetchItineraries(currentPackageId);
      setCurrentItinerary({
        day_number: '',
        title: '',
        description: '',
        accommodation: '',
        meals: '',
        transport: ''
      });
      setEditingItineraryId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const openItineraryModal = async (packageId) => {
    setCurrentPackageId(packageId);
    await fetchItineraries(packageId);
    setShowItineraryModal(true);
  };

  const handleEditItinerary = (itinerary) => {
    setCurrentItinerary(itinerary);
    setEditingItineraryId(itinerary._id);
  };

  const handleDeleteItinerary = async (itineraryId) => {
    if (!window.confirm('Are you sure you want to delete this itinerary?')) return;
    try {
      await api.delete(`/package/itineraries/${itineraryId}`);
      toast.success('Itinerary deleted successfully');
      fetchItineraries(currentPackageId);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = (pkg) => {
    setEditingId(pkg._id);
    setNewPackage({
      title: pkg.title,
      description: pkg.description,
      base_price: pkg.base_price,
      duration_days: pkg.duration_days,
      inclusions: pkg.inclusions,
      exclusions: pkg.exclusions || '',
      brochure: null,
      is_active: pkg.is_active
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    
    try {
      await api.delete(`/package/${id}`);
      toast.success('Package deleted successfully');
      fetchPackages();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/package/${id}`);
      toast.success(`Package ${currentStatus ? 'deactivated' : 'activated'}`);
      fetchPackages();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status update failed');
    }
  };

  const resetForm = () => {
    setNewPackage({
      title: '',
      description: '',
      base_price: '',
      duration_days: '',
      inclusions: '',
      exclusions: '',
      brochure: null,
      is_active: true
    });
    setEditingId(null);
  };

  const downloadBrochure = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Manage Packages</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          name="title"
          type="text"
          placeholder="Package Title"
          value={newPackage.title}
          onChange={handleInputChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="base_price"
          type="number"
          placeholder="Base Price"
          value={newPackage.base_price}
          onChange={handleInputChange}
          className="border p-2 rounded"
          min="0"
          step="0.01"
          required
        />
        <input
          name="duration_days"
          type="number"
          placeholder="Duration (days)"
          value={newPackage.duration_days}
          onChange={handleInputChange}
          className="border p-2 rounded"
          min="1"
          required
        />
        <div className="flex items-center gap-2 col-span-full">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={newPackage.is_active}
              onChange={(e) => setNewPackage({...newPackage, is_active: e.target.checked})}
            />
            Active Package
          </label>
        </div>
        <textarea
          name="description"
          placeholder="Description"
          value={newPackage.description}
          onChange={handleInputChange}
          className="border p-2 rounded col-span-full"
          required
        />
        <textarea
          name="inclusions"
          placeholder="Inclusions (comma separated)"
          value={newPackage.inclusions}
          onChange={handleInputChange}
          className="border p-2 rounded"
          required
        />
        <textarea
          name="exclusions"
          placeholder="Exclusions (comma separated)"
          value={newPackage.exclusions}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <div className="flex items-center gap-2 col-span-full">
          <input
            type="file"
            name="brochure"
            accept=".pdf,.doc,.docx"
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <Upload size={18} className="text-gray-600" />
          {editingId && (
            <span className="text-sm text-gray-500">
              {newPackage.brochure ? 'New file selected' : 'Leave empty to keep current'}
            </span>
          )}
        </div>

        <div className="flex gap-2 col-span-full">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            {isLoading ? 'Processing...' : editingId ? 'Update Package' : 'Add Package'}
            {!isLoading && <Plus size={18} />}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mt-10 mb-4">Existing Packages</h3>

      {isLoading && packages.length === 0 ? (
        <div className="text-center py-8">Loading packages...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Duration</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Brochure</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{pkg.title}</td>
                  <td className="p-2">Rs. {pkg.base_price.toFixed(2)}</td>
                  <td className="p-2">{pkg.duration_days} days</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {pkg.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-2">
                    {pkg.brochure_url ? (
                      <button
                        onClick={() => downloadBrochure(pkg.brochure_url)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => openItineraryModal(pkg._id)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Manage Itinerary"
                    >
                      <CalendarDays size={18} />
                    </button>
                    <button
                      onClick={() => toggleStatus(pkg._id, pkg.is_active)}
                      className={`p-1 ${
                        pkg.is_active
                          ? 'text-yellow-600 hover:text-yellow-800'
                          : 'text-green-600 hover:text-green-800'
                      }`}
                      title={pkg.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {pkg.is_active ? (
                        <span className="text-xs">Deactivate</span>
                      ) : (
                        <span className="text-xs">Activate</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {packages.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No packages found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Itinerary Modal */}
      {showItineraryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Manage Itinerary</h3>
              <button
                onClick={() => {
                  setShowItineraryModal(false);
                  setCurrentItinerary({
                    day_number: '',
                    title: '',
                    description: '',
                    accommodation: '',
                    meals: '',
                    transport: ''
                  });
                  setEditingItineraryId(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleItinerarySubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="day_number"
                type="number"
                placeholder="Day Number"
                value={currentItinerary.day_number}
                onChange={handleItineraryChange}
                className="border p-2 rounded"
                min="1"
                required
              />
              <input
                name="title"
                type="text"
                placeholder="Title"
                value={currentItinerary.title}
                onChange={handleItineraryChange}
                className="border p-2 rounded"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={currentItinerary.description}
                onChange={handleItineraryChange}
                className="border p-2 rounded col-span-full"
                required
              />
              <input
                name="accommodation"
                type="text"
                placeholder="Accommodation"
                value={currentItinerary.accommodation}
                onChange={handleItineraryChange}
                className="border p-2 rounded"
              />
              <input
                name="meals"
                type="text"
                placeholder="Meals"
                value={currentItinerary.meals}
                onChange={handleItineraryChange}
                className="border p-2 rounded"
              />
              <input
                name="transport"
                type="text"
                placeholder="Transport"
                value={currentItinerary.transport}
                onChange={handleItineraryChange}
                className="border p-2 rounded"
              />
              <div className="col-span-full flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentItinerary({
                      day_number: '',
                      title: '',
                      description: '',
                      accommodation: '',
                      meals: '',
                      transport: ''
                    });
                    setEditingItineraryId(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingItineraryId ? 'Update Itinerary' : 'Add Itinerary'}
                </button>
              </div>
            </form>

            <h4 className="text-lg font-medium mb-3">Itinerary Days</h4>
            <div className="space-y-4">
              {itineraries.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No itinerary days added yet</p>
              ) : (
                [...itineraries]
                  .sort((a, b) => a.day_number - b.day_number)
                  .map((itinerary) => (
                    <div key={itinerary._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">Day {itinerary.day_number}: {itinerary.title}</h5>
                          <p className="text-sm text-gray-600">{itinerary.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm">
                            {itinerary.accommodation && (
                              <p><span className="font-medium">Accommodation:</span> {itinerary.accommodation}</p>
                            )}
                            {itinerary.meals && (
                              <p><span className="font-medium">Meals:</span> {itinerary.meals}</p>
                            )}
                            {itinerary.transport && (
                              <p><span className="font-medium">Transport:</span> {itinerary.transport}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditItinerary(itinerary)}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteItinerary(itinerary._id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}