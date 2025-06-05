import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Match your backend URL
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response?.status === 401) {
    logout();
    toast.error('Session expired. Please login again.');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

// Auth functions
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token } = response.data;
    
    // Decode token to get user info
    const decoded = jwtDecode(token);
    const role = decoded.role;
    const userId = decoded.id;

    // Store token and user info
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', userId);
    localStorage.setItem('tokenExpiration', decoded.exp);

    // Fetch user profile using the new profile endpoint
    const userDetails = await getUserProfile();
    
    // Store the actual username from backend
    if (userDetails?.username) {
      localStorage.setItem('userName', userDetails.username);
    }
    
    return { 
      success: true, 
      role,
      username: userDetails?.username || credentials.username
    };
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

// Use the new profile endpoint that's accessible to all authenticated users
const getUserProfile = async () => {
  try {
    const response = await api.get('/staff/profile');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('tokenExpiration');
  return api.post('/auth/logout');
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      logout();
      return null;
    }
    
    return {
      role: localStorage.getItem('userRole'),
      userId: localStorage.getItem('userId'),
      username: localStorage.getItem('userName'),
      token
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    logout();
    return null;
  }
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Export the getUserProfile function for use in other components
export { getUserProfile };

export default api;