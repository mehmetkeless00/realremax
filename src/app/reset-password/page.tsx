'use client';
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { updatePassword } from '@/lib/auth';
import { useUIStore } from '@/lib/store';

function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useUIStore();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
  });

  // Check if we have the necessary tokens
  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (!accessToken || !refreshToken) {
      addToast({
        type: 'error',
        message:
          'Invalid or missing reset token. Please request a new password reset.',
      });
      router.push('/auth/forgot-password');
    }
  }, [searchParams, router, addToast]);

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

    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      addToast({
        type: 'error',
        message: 'Passwords do not match',
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
      await updatePassword(formData.password);
      addToast({
        type: 'success',
        message:
          'Password updated successfully! You can now sign in with your new password.',
      });
      router.push('/auth/signin');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-blue focus:border-primary-blue focus:z-10 sm:text-sm"
                placeholder="Enter your new password"
              />

              {/* Password Strength Indicator */}
              {formData.password && (
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
                        formData.password.length >= 8
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }
                    >
                      ✓ At least 8 characters
                    </div>
                    <div
                      className={
                        /[A-Z]/.test(formData.password)
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }
                    >
                      ✓ One uppercase letter
                    </div>
                    <div
                      className={
                        /[a-z]/.test(formData.password)
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }
                    >
                      ✓ One lowercase letter
                    </div>
                    <div
                      className={
                        /\d/.test(formData.password)
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }
                    >
                      ✓ One number
                    </div>
                    <div
                      className={
                        /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
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
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-blue focus:border-primary-blue focus:z-10 sm:text-sm"
                placeholder="Confirm your new password"
              />
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    Passwords do not match
                  </p>
                )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={
                loading ||
                formData.password !== formData.confirmPassword ||
                passwordStrength.score < 3
              }
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="font-medium text-primary-blue hover:text-blue-500"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  );
}
