'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';

interface DebugInfo {
  url: string;
  pathname: string;
  search: string;
  hash: string;
  searchParams: string;
  accessToken: string | null;
  refreshToken: string | null;
  allParams: Record<string, string>;
}

function DebugResetContent() {
  const searchParams = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    url: '',
    pathname: '',
    search: '',
    hash: '',
    searchParams: '',
    accessToken: null,
    refreshToken: null,
    allParams: {},
  });

  useEffect(() => {
    const info: DebugInfo = {
      url: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      searchParams: searchParams.toString(),
      accessToken: searchParams.get('access_token'),
      refreshToken: searchParams.get('refresh_token'),
      allParams: Object.fromEntries(searchParams.entries()),
    };

    setDebugInfo(info);
    console.log('Debug info:', info);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Password Reset Debug Info</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">URL Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full URL:
              </label>
              <p className="text-sm text-gray-900 break-all">{debugInfo.url}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pathname:
              </label>
              <p className="text-sm text-gray-900">{debugInfo.pathname}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Search:
              </label>
              <p className="text-sm text-gray-900 break-all">
                {debugInfo.search}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hash:
              </label>
              <p className="text-sm text-gray-900 break-all">
                {debugInfo.hash}
              </p>
            </div>
          </div>

          <h2 className="text-lg font-semibold mt-6">Token Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Access Token Present:
              </label>
              <p className="text-sm text-gray-900">
                {debugInfo.accessToken ? 'Yes' : 'No'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Refresh Token Present:
              </label>
              <p className="text-sm text-gray-900">
                {debugInfo.refreshToken ? 'Yes' : 'No'}
              </p>
            </div>
          </div>

          <h2 className="text-lg font-semibold mt-6">All URL Parameters</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.allParams, null, 2)}
          </pre>

          <div className="mt-6">
            <Button asChild variant="secondary" size="md">
              <a href="/reset-password">
                <span>Go to Reset Password Page</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DebugResetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading debug information...</p>
          </div>
        </div>
      }
    >
      <DebugResetContent />
    </Suspense>
  );
}
