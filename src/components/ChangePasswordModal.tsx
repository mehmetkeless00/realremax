'use client';

import { useState } from 'react';
import { updatePassword } from '@/lib/auth';
import { useUIStore } from '@/lib/store';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const { addToast } = useUIStore();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
  });

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let score = 0;
    let feedback = '';

    if (minLength) score++;
    if (hasUpperCase) score++;
    if (hasLowerCase) score++;
    if (hasNumbers) score++;
    if (hasSpecialChar) score++;

    if (score < 3) {
      feedback = 'Weak password';
    } else if (score < 4) {
      feedback = 'Medium strength password';
    } else {
      feedback = 'Strong password';
    }

    return { score, feedback };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'newPassword') {
      setPasswordStrength(validatePassword(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      addToast({
        type: 'error',
        message: 'New passwords do not match',
      });
      setLoading(false);
      return;
    }

    // Validate password strength
    if (passwordStrength.score < 3) {
      addToast({
        type: 'error',
        message: 'Password is too weak. Please choose a stronger password.',
      });
      setLoading(false);
      return;
    }

    try {
      await updatePassword(formData.newPassword);
      addToast({
        type: 'success',
        message: 'Password updated successfully!',
      });
      onClose();
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      addToast({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to update password',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score < 3) return 'text-red-500';
    if (passwordStrength.score < 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getPasswordStrengthWidth = () => {
    return `${(passwordStrength.score / 5) * 100}%`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Change Password
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                required
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                placeholder="Enter your current password"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                required
                value={formData.newPassword}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                placeholder="Enter your new password"
              />

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={getPasswordStrengthColor()}>
                      {passwordStrength.feedback}
                    </span>
                    <span className="text-gray-500">
                      {passwordStrength.score}/5
                    </span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score < 3
                          ? 'bg-red-500'
                          : passwordStrength.score < 4
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                      style={{ width: getPasswordStrengthWidth() }}
                    ></div>
                  </div>

                  {/* Password Requirements */}
                  <div className="mt-2 text-xs text-gray-600 space-y-1">
                    <div
                      className={
                        formData.newPassword.length >= 8
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }
                    >
                      ✓ At least 8 characters
                    </div>
                    <div
                      className={
                        /[A-Z]/.test(formData.newPassword)
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }
                    >
                      ✓ One uppercase letter
                    </div>
                    <div
                      className={
                        /[a-z]/.test(formData.newPassword)
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }
                    >
                      ✓ One lowercase letter
                    </div>
                    <div
                      className={
                        /\d/.test(formData.newPassword)
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }
                    >
                      ✓ One number
                    </div>
                    <div
                      className={
                        /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }
                    >
                      ✓ One special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
                placeholder="Confirm your new password"
              />
              {formData.confirmPassword &&
                formData.newPassword !== formData.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    Passwords do not match
                  </p>
                )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  loading ||
                  formData.newPassword !== formData.confirmPassword ||
                  passwordStrength.score < 3
                }
                className="px-4 py-2 text-sm font-medium text-white bg-primary-blue border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
