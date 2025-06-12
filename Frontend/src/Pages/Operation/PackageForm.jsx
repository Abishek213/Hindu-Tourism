import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';
import * as packageService from '../../services/packageService';
import {
  PackageFormModal,
  ItineraryViewModal,
  ItineraryFormModal,
  FormInput,
  FormTextarea,
  PackageRow,
  DayCard,
  EmptyItinerary,
  emptyPackage,
  emptyItinerary
} from '../../Components/Operation/PackageComponents';

const PackageDashboard = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalState, setModalState] = useState({
    createForm: false,
    editForm: false,
    itineraryView: false,
    itineraryForm: false
  });
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({ ...emptyPackage });
  const [itineraryData, setItineraryData] = useState({ ...emptyItinerary });

  const fetchPackages = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) setIsRefreshing(true);
      else setIsLoading(true);

      const data = await packageService.getAllPackages();
      const transformedPackages = data.map(pkg => ({
        id: pkg._id,
        name: pkg.title,
        duration: pkg.duration_days,
        price: pkg.base_price,
        destinations: pkg.description,
        status: pkg.is_active ? 'Active' : 'Inactive',
        itinerary: (pkg.itineraries || []).map(it => ({
          id: it._id,
          day: it.day_number,
          title: it.title,
          description: it.description,
          meals: it.meals,
          accommodation: it.accommodation
        }))
      }));

      setPackages(transformedPackages);
      if (selectedPackage) {
        const updatedPkg = transformedPackages.find(p => p.id === selectedPackage.id);
        if (updatedPkg) setSelectedPackage(updatedPkg);
      }
    } catch (error) {
      toast.error('Failed to load packages');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => { fetchPackages(); }, []);

  const handleFormInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleItineraryInputChange = (e) => {
    setItineraryData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openCreateModal = () => {
    setFormData({ ...emptyPackage, status: 'Active' });
    setModalState(prev => ({ ...prev, createForm: true }));
  };

  const openEditModal = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({ 
      name: pkg.name,
      duration: pkg.duration,
      price: pkg.price,
      description: pkg.description || '',
      destinations: pkg.destinations,
      inclusions: pkg.inclusions || '',
      exclusions: pkg.exclusions || ''
    });
    setModalState(prev => ({ ...prev, editForm: true }));
  };

  const closeAllModals = () => {
    setModalState({ createForm: false, editForm: false, itineraryView: false, itineraryForm: false });
    setSelectedPackage(null);
    setFormData({ ...emptyPackage });
    setItineraryData({ ...emptyItinerary });
  };

  const handleCreatePackage = async () => {
    if (!formData.name || !formData.duration || !formData.price) {
      return toast.error('Please fill in all required fields');
    }

    try {
      await packageService.createPackage({
        title: formData.name,
        duration_days: formData.duration,
        base_price: formData.price,
        description: formData.destinations,
        inclusions: formData.inclusions,
        exclusions: formData.exclusions,
        is_active: formData.status === 'Active'
      });
      closeAllModals();
      toast.success('Package created');
      await fetchPackages(true);
    } catch (error) {
      toast.error(error.message || 'Creation failed');
      console.error('Error:', error);
    }
  };

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
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-t-2 border-b-2 border-orange-600 rounded-full animate-spin"></div>
          <p className="text-orange-800">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header Section */}
      <div className="px-4 py-8">
        <div className="flex items-center justify-between px-6 py-8 mb-6 border-b border-gray-100 bg-primary-saffron">
          <h1 className="text-xl font-bold text-white">Package Management</h1>
          {isRefreshing && (
            <div className="flex items-center gap-2 text-orange-600">
              <div className="w-4 h-4 border-t-2 border-b-2 border-orange-600 rounded-full animate-spin"></div>
              <span className="text-sm">Refreshing...</span>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 text-sm text-orange-600 transition-all duration-200 bg-white rounded-md shadow-lg sm:mt-0 hover:bg-orange-100"
          >
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 text-sm text-orange-600 transition-all duration-200 bg-white rounded-md shadow-lg sm:mt-0 hover:bg-orange-100"
          >
            Create Package
          </button>
        </div>
      </div>

      {/* Packages Table */}
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="overflow-hidden bg-white shadow-lg rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-green border-secondary-green-700">
                <tr className="font-semibold text-white">
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
    </div>
  );
};

export default PackageDashboard;