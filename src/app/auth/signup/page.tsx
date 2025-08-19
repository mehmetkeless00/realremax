'use client';

import { useState } from 'react';
import {
  signUpWithEmail,
  signInWithGoogle,
  signInWithFacebook,
} from '@/lib/auth';

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'registered' as 'registered' | 'agent',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const result = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.role
      );

      if (result.user && !result.session) {
        setSuccess(true);
        setError(null);
      } else if (result.user && result.session) {
        // Kullanıcı otomatik olarak giriş yaptı, yönlendir
        window.location.href = '/dashboard';
      }
    } catch (err: unknown) {
      console.error('Signup error details:', err);

      // Supabase hata mesajlarını daha kullanıcı dostu hale getir
      let errorMessage = 'Failed to sign up';

      if (err && typeof err === 'object' && 'message' in err) {
        const errorMessageStr = String(err.message);
        if (errorMessageStr.includes('already registered')) {
          errorMessage =
            'This email is already registered. Please try signing in instead.';
        } else if (errorMessageStr.includes('password')) {
          errorMessage =
            'Password is too weak. Please use a stronger password.';
        } else if (errorMessageStr.includes('email')) {
          errorMessage = 'Please enter a valid email address.';
        } else {
          errorMessage = errorMessageStr;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      // OAuth redirects to callback page, so we don't need to handle the result here
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to sign up with Google'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      await signInWithFacebook();
      // OAuth redirects to callback page, so we don't need to handle the result here
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to sign up with Facebook'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-fg">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-muted">
              We&apos;ve sent you a confirmation link to verify your email
              address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-lg font-extrabold text-fg">
            Sign up with email
          </h2>
          <p className="mt-2 text-center text-sm text-muted">
            Or continue with email
          </p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleEmailSignUp}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-border placeholder-muted text-fg focus:outline-none focus:ring-primary-blue focus:border-primary-blue focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-border placeholder-muted text-fg focus:outline-none focus:ring-primary-blue focus:border-primary-blue focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-border placeholder-muted text-fg focus:outline-none focus:ring-primary-blue focus:border-primary-blue focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
            <div>
              <label htmlFor="role" className="sr-only">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: e.target.value as 'registered' | 'agent',
                  }))
                }
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-border placeholder-muted text-fg focus:outline-none focus:ring-primary-blue focus:border-primary-blue focus:z-10 sm:text-sm"
              >
                <option value="registered">Registered User</option>
                <option value="agent">Real Estate Agent</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-muted/20 text-muted">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full inline-flex justify-center py-2 px-4 border border-border rounded-md shadow-sm bg-white text-sm font-medium text-muted hover:bg-muted/20 disabled:opacity-50"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleFacebookSignUp}
                disabled={loading}
                className="w-full inline-flex justify-center py-2 px-4 border border-border rounded-md shadow-sm bg-white text-sm font-medium text-muted hover:bg-muted/20 disabled:opacity-50"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
