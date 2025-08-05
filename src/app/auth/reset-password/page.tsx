'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { updatePassword } from '@/lib/auth';
import { useUIStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

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

  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      addToast({
        type: 'error',
        message:
          'Invalid or missing reset token. Please request a new password reset.',
      });
      router.push('/auth/forgot-password');
    }
  }, [accessToken, refreshToken, router, addToast]);

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

    if (score < 3) feedback = 'Weak password';
    else if (score < 4) feedback = 'Medium strength password';
    else feedback = 'Strong password';

    return { score, feedback };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'password') setPasswordStrength(validatePassword(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      addToast({ type: 'error', message: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    if (passwordStrength.score < 3) {
      addToast({ type: 'error', message: 'Password is too weak.' });
      setLoading(false);
      return;
    }

    try {
      // Set the session with the tokens
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken!,
        refresh_token: refreshToken!,
      });

      if (sessionError) throw sessionError;

      // Update password
      await updatePassword(formData.password);

      addToast({
        type: 'success',
        message: 'Password updated successfully! You can now sign in.',
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
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* New Password Input */}
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
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue sm:text-sm"
                placeholder="Enter your new password"
              />
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs">
                    <span className={getPasswordStrengthColor()}>
                      {passwordStrength.feedback}
                    </span>
                    <span className="text-gray-500">
                      {passwordStrength.score}/5
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${getPasswordStrengthColor()}`}
                      style={{ width: getPasswordStrengthWidth() }}
                      aria-label={`Password strength: ${passwordStrength.score} out of 5`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
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
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue sm:text-sm"
                placeholder="Confirm your new password"
              />
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
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
              className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-blue hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="text-primary-blue hover:underline text-sm"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  );
}
