import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import api from '../../api/auth';
import { toast } from 'react-toastify';

const Settings = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileUpdatePassword, setProfileUpdatePassword] = useState('');
  const [showProfilePassword, setShowProfilePassword] = useState(false);

  // Password strength indicators
  const passwordStrengthLabels = ['Very Weak', 'Weak', 'Good', 'Strong', 'Very Strong'];
  const passwordStrengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  // Load user profile from backend
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await api.get('/staff/profile');
        const userProfile = response.data;
        
        setUsername(userProfile.username || '');
        setName(userProfile.name || '');
        setEmail(userProfile.email || '');
        setPhone(userProfile.phone || '');
        
        // Update localStorage with the fetched username
        localStorage.setItem('userName', userProfile.username || '');
      } catch (error) {
        console.error('Failed to load user profile:', error);
        setMessage({ 
          text: 'Failed to load profile information.', 
          type: 'error' 
        });
        toast.error('Failed to load profile information');
      } finally {
        setProfileLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  // Calculate password strength
  useEffect(() => {
    if (newPassword.length === 0) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (newPassword.length >= 8) strength++;
    if (newPassword.match(/[A-Z]/)) strength++;
    if (newPassword.match(/[0-9]/)) strength++;
    if (newPassword.match(/[^A-Za-z0-9]/)) strength++;
    if (newPassword.length >= 12) strength++;

    setPasswordStrength(Math.min(strength, 4));
  }, [newPassword]);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle go back using React Router navigation
  const handleGoBack = () => {
    navigate(-1);
  };

  // Handle cancel - same as go back
  const handleCancel = () => {
    navigate(-1);
  };

  // Handle profile update (username, name, email, phone)
  const handleSaveProfile = async () => {
    if (!username.trim()) {
      setMessage({ text: 'Username cannot be empty.', type: 'error' });
      return;
    }

    if (!name.trim()) {
      setMessage({ text: 'Name cannot be empty.', type: 'error' });
      return;
    }

    if (!email.trim()) {
      setMessage({ text: 'Email cannot be empty.', type: 'error' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    // Show password confirmation modal
    setShowPasswordModal(true);
  };

  // Confirm profile update with password
  const confirmProfileUpdate = async () => {
    if (!profileUpdatePassword) {
      setMessage({ text: 'Please enter your current password to confirm changes.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      // Update the profile with password verification
      const response = await api.put('/staff/profile', {
        username: username.trim(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        currentPassword: profileUpdatePassword
      });

      // Update localStorage with the new username
      localStorage.setItem('userName', response.data.username);
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      toast.success('Profile updated successfully!');
      
      // Close modal and clear password
      setShowPasswordModal(false);
      setProfileUpdatePassword('');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.errors?.[0]?.msg || 
                          'Failed to update profile. Please try again.';
      setMessage({ text: errorMessage, type: 'error' });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cancel profile update
  const cancelProfileUpdate = () => {
    setShowPasswordModal(false);
    setProfileUpdatePassword('');
  };

  // Handle password update
  const handleChangePassword = async () => {
    if (!oldPassword) {
      setMessage({ text: 'Please enter your current password.', type: 'error' });
      return;
    }

    if (!newPassword || !confirmPassword) {
      setMessage({ text: 'Please fill out all password fields.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match.', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: 'New password must be at least 6 characters long.', type: 'error' });
      return;
    }

    if (passwordStrength < 2) {
      setMessage({ text: 'Password is too weak. Please choose a stronger password.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await api.put('/staff/change-password', {
        currentPassword: oldPassword,
        newPassword: newPassword
      });

      setMessage({ text: 'Password updated successfully!', type: 'success' });
      toast.success('Password updated successfully!');
      
      // Clear password fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.errors?.[0]?.msg || 
                          'Failed to update password. Please try again.';
      setMessage({ text: errorMessage, type: 'error' });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="max-w-5xl mx-auto mt-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-saffron"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header with Go Back Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Account Settings</h2>
        <button
          onClick={handleGoBack}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
        >
          <FiArrowLeft className="mr-1" />
          Go Back
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column - Profile Information */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Profile Information</h3>
            <div className="w-12 h-1 bg-gradient-to-r from-primary-saffron to-orange-500 rounded-full"></div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-saffron dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-saffron dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-saffron dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-saffron dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  loading
                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-primary-saffron hover:bg-orange-600 text-white'
                }`}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
              
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg font-medium text-sm text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Password Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Password Settings</h3>
            <div className="w-12 h-1 bg-gradient-to-r from-primary-saffron to-orange-500 rounded-full"></div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-saffron dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-saffron dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              
              {/* Password strength meter */}
              {newPassword && (
                <div className="mt-1">
                  <div className="flex items-center mb-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${passwordStrengthColors[passwordStrength]}`}
                        style={{ width: `${(passwordStrength + 1) * 25}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-300">
                      {passwordStrengthLabels[passwordStrength]}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {newPassword.length < 8 && '8+ chars. '}
                    {!newPassword.match(/[A-Z]/) && 'Uppercase. '}
                    {!newPassword.match(/[0-9]/) && 'Numbers. '}
                    {!newPassword.match(/[^A-Za-z0-9]/) && 'Special chars.'}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-saffron dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  loading
                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-primary-saffron hover:bg-orange-600 text-white'
                }`}
              >
                {loading ? 'Updating...' : 'Change Password'}
              </button>
              
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg font-medium text-sm text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message Section */}
      {message.text && (
        <div
          className={`mt-4 p-3 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
          }`}
        >
          <div className="flex items-center">
            {message.type === 'success' ? (
              <FiCheckCircle className="text-green-500 dark:text-green-400 mr-2" size={16} />
            ) : (
              <FiAlertCircle className="text-red-500 dark:text-red-400 mr-2" size={16} />
            )}
            <span className="text-sm font-medium">
              {message.text}
            </span>
          </div>
        </div>
      )}

      {/* Password Confirmation Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Confirm Profile Update
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Please enter your current password to confirm the profile changes.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showProfilePassword ? "text" : "password"}
                  value={profileUpdatePassword}
                  onChange={(e) => setProfileUpdatePassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-saffron dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="Enter your current password"
                  onKeyPress={(e) => e.key === 'Enter' && confirmProfileUpdate()}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setShowProfilePassword(!showProfilePassword)}
                >
                  {showProfilePassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelProfileUpdate}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-all"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmProfileUpdate}
                disabled={loading || !profileUpdatePassword}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  loading || !profileUpdatePassword
                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500'
                    : 'bg-primary-saffron hover:bg-orange-600 text-white'
                }`}
              >
                {loading ? 'Confirming...' : 'Confirm Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;