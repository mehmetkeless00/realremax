'use client';

import { useState } from 'react';
import {
  signUpWithEmail,
  signInWithGoogle,
  signInWithFacebook,
} from '@/lib/auth';
import { Button } from '@/components/ui/button';

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
        <div className="max-w-md w-full space-y-6">
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
      <div className="max-w-md w-full space-y-6">
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
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Please wait…' : 'Create account'}
            </Button>
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

            <div className="mt-6 space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignUp}
                disabled={loading}
              >
                Continue with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleFacebookSignUp}
                disabled={loading}
              >
                Continue with Facebook
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
