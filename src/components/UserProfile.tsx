'use client';

import { useUserStore, useUIStore } from '@/lib/store';

export default function UserProfile() {
  const { user, profile, updateProfile, updateRole } = useUserStore();
  const { addToast, openModal } = useUIStore();

  const handleUpdateProfile = () => {
    if (!profile) return;

    // Example: Update user profile
    updateProfile({
      name: 'John Doe',
      phone: '+1234567890',
    });

    addToast({
      type: 'success',
      message: 'Profile updated successfully!',
    });
  };

  const handleRoleChange = () => {
    if (!profile) return;

    // Example: Change user role
    updateRole('agent');

    addToast({
      type: 'info',
      message: 'Role updated to agent',
    });
  };

  const handleOpenModal = () => {
    openModal('edit-profile', { userId: user?.id });
  };

  if (!user) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">User Profile</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <p className="mt-1 text-sm text-gray-900">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {profile?.role || 'visitor'}
          </p>
        </div>

        {profile?.name && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <p className="mt-1 text-sm text-gray-900">{profile.name}</p>
          </div>
        )}

        {profile?.phone && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <p className="mt-1 text-sm text-gray-900">{profile.phone}</p>
          </div>
        )}

        {profile?.company && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company
            </label>
            <p className="mt-1 text-sm text-gray-900">{profile.company}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleUpdateProfile}
          className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700"
        >
          Update Profile
        </button>

        <button
          onClick={handleRoleChange}
          className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700"
        >
          Change Role
        </button>

        <button
          onClick={handleOpenModal}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Open Modal
        </button>
      </div>
    </div>
  );
}
