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

export const fetchMonthlyLeadTrends = async (fromDate, toDate) => {
  try {
    const params = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    
    const response = await api.get('/dashboard/lead-trends', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly lead trends:', error);
    throw error;
  }
};