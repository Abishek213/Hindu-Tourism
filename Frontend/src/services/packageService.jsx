import api from '../api/auth.jsx';

export const createPackage = async (packageData) => {
  try {
    const response = await api.post('/package', packageData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.errors || 
          error.response?.data?.message || 
          error.response?.data?.error?.message || 
          'Failed to create package';
  }
};

export const updatePackage = async (id, packageData) => {
  try {
    const response = await api.put(`/package/${id}`, packageData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update package';
  }
};

export const getAllPackages = async () => {
  try {
    const response = await api.get('/package');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch packages';
  }
};

export const getPackageById = async (id) => {
  try {
    const response = await api.get(`/package/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch package';
  }
};

export const updatePackageStatus = async (id, isActive) => {
  try {
    const response = await api.patch(`/package/${id}/status`, { is_active: isActive });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update status';
  }
};

export const addItinerary = async (packageId, itineraryData) => {
  try {
    const response = await api.post(`/package/${packageId}/itineraries`, itineraryData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to add itinerary';
  }
};

export const updateItinerary = async (itineraryId, itineraryData) => {
  try {
    const response = await api.put(`/package/itineraries/${itineraryId}`, itineraryData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update itinerary';
  }
};

export const deleteItinerary = async (itineraryId) => {
  try {
    const response = await api.delete(`/package/itineraries/${itineraryId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete itinerary';
  }
};