'use client';

import { useState } from 'react';
import { resetPassword } from '@/lib/auth';
import { useUIStore } from '@/lib/store';

export default function TestResetPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useUIStore();

  const handleTestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Testing password reset for:', email);
      console.log('Current origin:', window.location.origin);
      console.log(
        'Redirect URL will be:',
        `${window.location.origin}/reset-password`
      );

      await resetPassword(email);

      addToast({
        type: 'success',
        message:
          'Password reset email sent! Check your email for the reset link.',
      });
    } catch (error) {
      console.error('Reset error:', error);
      addToast({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to send reset email',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Test Password Reset</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleTestReset} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue sm:text-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-blue hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Test Reset Email'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
            <h3 className="font-semibold mb-2">Debug Information:</h3>
            <p>
              <strong>Environment:</strong> {process.env.NODE_ENV}
            </p>
            <p>
              <strong>Origin:</strong>{' '}
              {typeof window !== 'undefined' ? window.location.origin : 'N/A'}
            </p>
            <p>
              <strong>Expected Redirect:</strong>{' '}
              {typeof window !== 'undefined'
                ? `${window.location.origin}/reset-password`
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
