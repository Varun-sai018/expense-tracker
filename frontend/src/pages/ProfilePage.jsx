import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    profilePicture: 'https://via.placeholder.com/150',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    currency: 'USD',
    language: 'English',
  });
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const userData = await userService.getProfile();
      setFormData({
        name: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        bio: userData.bio || '',
        profilePicture: userData.profilePicture || 'https://via.placeholder.com/150',
      });
      if (userData.preferences) {
        setPreferences(userData.preferences);
      }
    } catch (error) {
      setToast({ message: 'Failed to load profile data', type: 'error' });
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        profilePicture: formData.profilePicture
      });
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to update profile', type: 'error' });
      console.error('Error updating profile:', error);
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ message: 'New passwords do not match!', type: 'error' });
      return;
    }
    try {
      await userService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setToast({ message: 'Password changed successfully!', type: 'success' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setToast({ message: 'Failed to change password', type: 'error' });
      console.error('Error changing password:', error);
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    try {
      await userService.updatePreferences(preferences);
      setToast({ message: 'Preferences saved successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to save preferences', type: 'error' });
      console.error('Error saving preferences:', error);
    }
    setTimeout(() => setToast(null), 3000);
  };

  if (isLoading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profilePictureContainer}>
          <img 
            src={formData.profilePicture} 
            alt="Profile" 
            className={styles.profilePicture}
          />
          <label className={styles.profilePictureUpload}>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className={styles.fileInput}
            />
            <span>Change Photo</span>
          </label>
        </div>
        <div className={styles.profileInfo}>
          <h1>{formData.name}</h1>
          <p>{formData.email}</p>
          <p>{formData.location}</p>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'personal' ? styles.active : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Info
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'password' ? styles.active : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Password
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'preferences' ? styles.active : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'personal' && (
          <form onSubmit={handleSavePersonalInfo} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handlePersonalInfoChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handlePersonalInfoChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handlePersonalInfoChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handlePersonalInfoChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handlePersonalInfoChange}
                rows="4"
              />
            </div>
            <button type="submit" className={styles.saveButton}>
              Save Changes
            </button>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength="8"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength="8"
              />
            </div>
            <button type="submit" className={styles.saveButton}>
              Change Password
            </button>
          </form>
        )}

        {activeTab === 'preferences' && (
          <form onSubmit={handleSavePreferences} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={preferences.emailNotifications}
                  onChange={handlePreferenceChange}
                />
                Email Notifications
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="pushNotifications"
                  checked={preferences.pushNotifications}
                  onChange={handlePreferenceChange}
                />
                Push Notifications
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="darkMode"
                  checked={preferences.darkMode}
                  onChange={handlePreferenceChange}
                />
                Dark Mode
              </label>
            </div>
            <div className={styles.formGroup}>
              <label>Currency</label>
              <select
                name="currency"
                value={preferences.currency}
                onChange={handlePreferenceChange}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Language</label>
              <select
                name="language"
                value={preferences.language}
                onChange={handlePreferenceChange}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
            <button type="submit" className={styles.saveButton}>
              Save Preferences
            </button>
          </form>
        )}
      </div>

      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 