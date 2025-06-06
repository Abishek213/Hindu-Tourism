import api from '../api/auth';

export const fetchLeadStats = async () => {
  try {
    const response = await api.get('/dashboard/lead-stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    throw error;
  }
};

export const fetchLeadSources = async () => {
  try {
    const response = await api.get('/dashboard/lead-sources');
    return response.data;
  } catch (error) {
    console.error('Error fetching lead sources:', error);
    throw error;
  }
};

export const fetchLeadStatusData = async () => {
  try {
    const response = await api.get('/dashboard/lead-status');
    return response.data;
  } catch (error) {
    console.error('Error fetching lead status:', error);
    throw error;
  }
};

export const fetchRecentLeads = async () => {
  try {
    const response = await api.get('/lead?limit=5&sort=-created_date');
    return response.data.map(lead => ({
      ...lead,
      date: new Date(lead.created_date).toISOString().split('T')[0],
      assignedTo: lead.staff_id?.name || 'Unassigned'
    }));
  } catch (error) {
    console.error('Error fetching recent leads:', error);
    throw error;
  }
};

export const fetchPackagePopularity = async () => {
  try {
    const response = await api.get('/dashboard/package-popularity');
    return response.data;
  } catch (error) {
    console.error('Error fetching package popularity:', error);
    throw error;
  }
};

export const fetchCommunicationMethods = async () => {
  try {
    const response = await api.get('/dashboard/communication-methods');
    return response.data;
  } catch (error) {
    console.error('Error fetching communication methods:', error);
    throw error;
  }
};
