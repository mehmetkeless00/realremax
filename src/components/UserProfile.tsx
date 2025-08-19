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
        <p className="text-muted">Please sign in to view your profile</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-base font-bold text-fg mb-4">User Profile</h2>
        <p className="text-muted">
          Profile not found. Please complete your profile setup.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-base font-bold text-fg mb-4">User Profile</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-fg">Email</label>
          <p className="mt-1 text-sm text-fg">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-fg">User ID</label>
          <p className="mt-1 text-sm text-fg">{user.id}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-fg">Name</label>
          <p className="mt-1 text-sm text-fg">{profile.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-fg">Phone</label>
          <p className="mt-1 text-sm text-fg">{profile.phone}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-fg">Company</label>
          <p className="mt-1 text-sm text-fg">{profile.company}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleUpdateProfile}
          className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700"
        >
          Update Profile
        </button>

        <button
          onClick={handleRoleChange}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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
