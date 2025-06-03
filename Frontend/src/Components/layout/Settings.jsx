import React, { useState, useEffect } from 'react';
import { FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const Settings = () => {
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength indicators
  const passwordStrengthLabels = ['Very Weak', 'Weak', 'Good', 'Strong', 'Very Strong'];
  const passwordStrengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  // Load existing userName from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('userName') || '';
    setUsername(storedName);
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

  // Handle username update
  const handleSaveUsername = async () => {
    if (!username.trim()) {
      setMessage({ text: 'Username cannot be empty.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      localStorage.setItem('userName', username);
      setMessage({ text: 'Username updated successfully!', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to update username. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
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

    if (passwordStrength < 2) {
      setMessage({ text: 'Password is too weak. Please choose a stronger password.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call with validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would normally verify oldPassword with your backend
      const isOldPasswordValid = true; // Replace with actual validation
      
      if (!isOldPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // 🔐 TODO: Replace with actual backend call to update password
      setMessage({ text: 'Password updated successfully!', type: 'success' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage({ text: error.message || 'Failed to update password. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Account Settings</h2>

      {/* Username Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Profile Information</h3>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-saffron to-orange-500 rounded-full"></div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-saffron dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Enter your username"
              />
            </div>
          </div>
          
          <button
            onClick={handleSaveUsername}
            disabled={loading}
            className={`mt-2 w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all ${
              loading
                ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-primary-saffron hover:bg-orange-600 text-white'
            }`}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

      {/* Password Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Password Settings</h3>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-saffron to-orange-500 rounded-full"></div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-saffron dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-saffron dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Enter your new password"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            
            {/* Password strength meter */}
            {newPassword && (
              <div className="mt-2">
                <div className="flex items-center mb-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${passwordStrengthColors[passwordStrength]}`}
                      style={{ width: `${(passwordStrength + 1) * 25}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-600 dark:text-gray-300">
                    {passwordStrengthLabels[passwordStrength]}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {newPassword.length < 8 && 'At least 8 characters required. '}
                  {!newPassword.match(/[A-Z]/) && 'Include uppercase letters. '}
                  {!newPassword.match(/[0-9]/) && 'Include numbers. '}
                  {!newPassword.match(/[^A-Za-z0-9]/) && 'Include special characters.'}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-saffron dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          
          <button
            onClick={handleChangePassword}
            disabled={loading}
            className={`mt-2 w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all ${
              loading
                ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-primary-saffron hover:bg-orange-600 text-white'
            }`}
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </div>

      {/* Message Section */}
      {message.text && (
        <div
          className={`mt-6 p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
          }`}
        >
          <div className="flex items-center">
            {message.type === 'success' ? (
              <FiCheckCircle className="text-green-500 dark:text-green-400 mr-2" />
            ) : (
              <FiAlertCircle className="text-red-500 dark:text-red-400 mr-2" />
            )}
            <span className="text-sm font-medium">
              {message.text}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;