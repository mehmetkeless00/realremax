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
  const [tokensValid, setTokensValid] = useState(false);
  const [validatingTokens, setValidatingTokens] = useState(true);

  // Get tokens from URL parameters
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  useEffect(() => {
    const validateTokens = async () => {
      setValidatingTokens(true);

      // Debug logging
      console.log('Reset password page loaded');
      console.log('Access token present:', !!accessToken);
      console.log('Refresh token present:', !!refreshToken);
      console.log('URL search params:', searchParams.toString());
      console.log('Full URL:', window.location.href);

      // Try multiple ways to get tokens
      let finalAccessToken = accessToken;
      let finalRefreshToken = refreshToken;

      if (!finalAccessToken || !finalRefreshToken) {
        console.log('Missing tokens, checking for hash fragment...');

        // Check if tokens are in hash fragment (some browsers/redirects might put them there)
        const hash = window.location.hash;
        if (hash) {
          const hashParams = new URLSearchParams(hash.substring(1));
          const hashAccessToken = hashParams.get('access_token');
          const hashRefreshToken = hashParams.get('refresh_token');

          if (hashAccessToken && hashRefreshToken) {
            console.log('Found tokens in hash fragment');
            finalAccessToken = hashAccessToken;
            finalRefreshToken = hashRefreshToken;
            // Update URL to include tokens in search params
            const newUrl = `${window.location.pathname}?access_token=${hashAccessToken}&refresh_token=${hashRefreshToken}`;
            window.history.replaceState({}, '', newUrl);
          }
        }

        // If still no tokens, check if we can get them from the session
        if (!finalAccessToken || !finalRefreshToken) {
          try {
            const {
              data: { session },
            } = await supabase.auth.getSession();
            if (session?.access_token && session?.refresh_token) {
              console.log('Found tokens in existing session');
              finalAccessToken = session.access_token;
              finalRefreshToken = session.refresh_token;
            }
          } catch (error) {
            console.error('Error checking session:', error);
          }
        }

        // If still no tokens, check if they're in the URL as different parameter names
        if (!finalAccessToken || !finalRefreshToken) {
          const allParams = Object.fromEntries(searchParams.entries());
          console.log('All URL parameters:', allParams);

          // Check for common variations
          finalAccessToken =
            finalAccessToken ||
            allParams['access_token'] ||
            allParams['token'] ||
            allParams['auth_token'];
          finalRefreshToken =
            finalRefreshToken ||
            allParams['refresh_token'] ||
            allParams['refresh'] ||
            allParams['refreshToken'];
        }

        // If still no tokens, check if we're in a password recovery flow
        if (!finalAccessToken || !finalRefreshToken) {
          try {
            // Try to get the current session and see if we're in a recovery flow
            const {
              data: { session },
            } = await supabase.auth.getSession();
            if (session?.user) {
              console.log(
                'Found existing session, checking if user needs password update'
              );
              // Check if this is a password recovery session
              const {
                data: { user },
              } = await supabase.auth.getUser();
              if (user && user.app_metadata?.provider === 'email') {
                console.log('User found in recovery flow');
                setTokensValid(true);
                setValidatingTokens(false);
                return;
              }
            }
          } catch (error) {
            console.error('Error checking recovery flow:', error);
          }
        }
      }

      if (!finalAccessToken || !finalRefreshToken) {
        console.log('No valid tokens found after all attempts');

        // In production, show a more helpful error message
        if (process.env.NODE_ENV === 'production') {
          addToast({
            type: 'error',
            message:
              'Password reset link appears to be invalid or expired. Please request a new password reset.',
          });
        } else {
          addToast({
            type: 'error',
            message:
              'Invalid or missing reset token. Please request a new password reset.',
          });
        }

        router.push('/auth/forgot-password');
        return;
      }

      // Validate tokens by trying to set the session
      try {
        console.log('Attempting to validate tokens...');
        const { data: sessionData, error: sessionError } =
          await supabase.auth.setSession({
            access_token: finalAccessToken,
            refresh_token: finalRefreshToken,
          });

        if (sessionError) {
          console.error('Session validation error:', sessionError);
          throw sessionError;
        }

        if (sessionData.session) {
          console.log('Tokens validated successfully');
          setTokensValid(true);
        } else {
          throw new Error('No session created from tokens');
        }
      } catch (error) {
        console.error('Token validation failed:', error);

        // In production, show a more helpful error message
        if (process.env.NODE_ENV === 'production') {
          addToast({
            type: 'error',
            message:
              'Password reset link has expired or is invalid. Please request a new password reset.',
          });
        } else {
          addToast({
            type: 'error',
            message:
              'Invalid reset token. Please request a new password reset.',
          });
        }

        router.push('/auth/forgot-password');
        return;
      } finally {
        setValidatingTokens(false);
      }
    };

    validateTokens();
  }, [accessToken, refreshToken, router, addToast, searchParams]);

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
      // Ensure we have a valid session before updating password
      if (!tokensValid) {
        // Final fallback: check if we have a session that allows password update
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('No valid session found');
        }
      }

      // Update password
      await updatePassword(formData.password);

      addToast({
        type: 'success',
        message: 'Password updated successfully! You can now sign in.',
      });
      router.push('/auth/signin');
    } catch (error) {
      console.error('Password update error:', error);
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

  // Show loading state while validating tokens
  if (validatingTokens) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-lg font-extrabold text-gray-900">
              Validating Reset Link
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we validate your password reset link...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
          </div>

          {/* Debug info for production troubleshooting */}
          {process.env.NODE_ENV === 'production' && (
            <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
              <p>
                <strong>Debug Info:</strong>
              </p>
              <p>
                URL:{' '}
                {typeof window !== 'undefined' ? window.location.href : 'N/A'}
              </p>
              <p>Search Params: {searchParams.toString()}</p>
              <p>Access Token: {accessToken ? 'Present' : 'Missing'}</p>
              <p>Refresh Token: {refreshToken ? 'Present' : 'Missing'}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Don't render the form if tokens are not valid
  if (!tokensValid) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-lg font-extrabold text-gray-900">
            Reset Your Password
          </h2>
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
