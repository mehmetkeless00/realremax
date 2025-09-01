'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);

    // Optional: Send error to external service (e.g., Sentry)
    // captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Error Icon */}
        <div className="mx-auto h-24 w-24 text-red-500">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong!
          </h1>
          <p className="text-gray-600 mb-4">
            We&apos;re sorry, but something unexpected happened. Our team has
            been notified and is working to fix the issue.
          </p>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <h3 className="text-sm font-medium text-red-800 mb-2">
                Error Details (Development)
              </h3>
              <p className="text-sm text-red-700 mb-2">
                <strong>Message:</strong> {error.message}
              </p>
              {error.digest && (
                <p className="text-sm text-red-700 mb-2">
                  <strong>Error ID:</strong> {error.digest}
                </p>
              )}
              <details className="text-xs text-red-600">
                <summary className="cursor-pointer hover:text-red-800">
                  Stack Trace
                </summary>
                <pre className="mt-2 whitespace-pre-wrap overflow-auto">
                  {error.stack}
                </pre>
              </details>
            </div>
          )}

          {/* Error ID for Production */}
          {process.env.NODE_ENV === 'production' && error.digest && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Error ID:</strong> {error.digest}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Please include this ID when contacting support.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={reset}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </Button>

            <Button
              asChild
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Go Home
              </Link>
            </Button>
          </div>

          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/properties">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Browse Properties
            </Link>
          </Button>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            If this problem persists, please{' '}
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              contact our support team
            </Link>
            {error.digest && (
              <>
                {' '}
                and mention error ID:{' '}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  {error.digest}
                </code>
              </>
            )}
          </p>
        </div>

        {/* Browser Info */}
        <div className="mt-6 text-xs text-gray-400">
          <p>
            Browser:{' '}
            {typeof window !== 'undefined'
              ? window.navigator.userAgent.split(' ')[0]
              : 'Unknown'}
          </p>
          <p>Time: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
