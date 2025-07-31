'use client';

import { useState, useEffect } from 'react';
import { useUserStore, useUIStore } from '@/lib/store';
import { updateUserRoleById } from '@/lib/auth';
import type { User } from '@supabase/supabase-js';
import ChangePasswordModal from './ChangePasswordModal';

interface ProfileFormProps {
  user: User;
}

type TabType = 'profile' | 'preferences' | 'security';

export default function ProfileForm({ user }: ProfileFormProps) {
  const { profile, updateProfile, updateRole } = useUserStore();
  const { addToast } = useUIStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    license_number: '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    emailFrequency: 'weekly',
    propertyAlerts: true,
    marketUpdates: false,
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        company: profile.company || '',
        license_number: profile.license_number || '',
      });
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferenceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      updateProfile(formData);
      addToast({
        type: 'success',
        message: 'Profile updated successfully!',
      });
    } catch {
      addToast({
        type: 'error',
        message: 'Failed to update profile. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically save preferences to the database
      addToast({
        type: 'success',
        message: 'Preferences updated successfully!',
      });
    } catch {
      addToast({
        type: 'error',
        message: 'Failed to update preferences. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (newRole: 'registered' | 'agent') => {
    if (!user) return;

    setLoading(true);
    try {
      await updateUserRoleById(user.id, newRole);
      updateRole(newRole);
      addToast({
        type: 'success',
        message: `Role updated to ${newRole}!`,
      });
    } catch {
      addToast({
        type: 'error',
        message: 'Failed to update role. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'profile', label: 'Personal Information' },
              { id: 'preferences', label: 'Preferences' },
              { id: 'security', label: 'Security' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-blue text-primary-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                  placeholder="Enter your phone number"
                />
              </div>

              {profile?.role === 'agent' && (
                <>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="license_number"
                      className="block text-sm font-medium text-gray-700"
                    >
                      License Number
                    </label>
                    <input
                      type="text"
                      id="license_number"
                      name="license_number"
                      value={formData.license_number}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                      placeholder="Enter your license number"
                    />
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Email address cannot be changed. Contact support if needed.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleRoleChange('registered')}
                  disabled={profile?.role === 'registered' || loading}
                  className={`px-4 py-2 rounded-md border ${
                    profile?.role === 'registered'
                      ? 'bg-primary-blue text-white border-primary-blue'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  } disabled:opacity-50`}
                >
                  Registered User
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('agent')}
                  disabled={profile?.role === 'agent' || loading}
                  className={`px-4 py-2 rounded-md border ${
                    profile?.role === 'agent'
                      ? 'bg-primary-blue text-white border-primary-blue'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  } disabled:opacity-50`}
                >
                  Real Estate Agent
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-blue text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <form onSubmit={handlePreferencesSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive email notifications about new properties and updates
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={preferences.emailNotifications}
                  onChange={handlePreferenceChange}
                  className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="emailFrequency"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Frequency
                </label>
                <select
                  id="emailFrequency"
                  name="emailFrequency"
                  value={preferences.emailFrequency}
                  onChange={handlePreferenceChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Property Alerts
                  </h3>
                  <p className="text-sm text-gray-500">
                    Get notified when new properties match your criteria
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="propertyAlerts"
                  name="propertyAlerts"
                  checked={preferences.propertyAlerts}
                  onChange={handlePreferenceChange}
                  className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Market Updates
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive market analysis and trend reports
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="marketUpdates"
                  name="marketUpdates"
                  checked={preferences.marketUpdates}
                  onChange={handlePreferenceChange}
                  className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-blue text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Password Management
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Update your password to keep your account secure
              </p>
              <button
                type="button"
                onClick={() => setShowChangePasswordModal(true)}
                className="bg-primary-red text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red"
              >
                Change Password
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Account Security
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button
                    type="button"
                    className="bg-white text-primary-blue border border-primary-blue px-4 py-2 rounded-md hover:bg-blue-50"
                  >
                    Enable
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Login History
                    </h4>
                    <p className="text-sm text-gray-500">
                      View recent login activity
                    </p>
                  </div>
                  <button
                    type="button"
                    className="bg-white text-primary-blue border border-primary-blue px-4 py-2 rounded-md hover:bg-blue-50"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </>
  );
}
