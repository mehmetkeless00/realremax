'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DebugResetPage() {
  const searchParams = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const info = {
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
              <label className="block text-sm font-medium text-gray-700">Full URL:</label>
              <p className="text-sm text-gray-900 break-all">{debugInfo.url}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Pathname:</label>
              <p className="text-sm text-gray-900">{debugInfo.pathname}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Search:</label>
              <p className="text-sm text-gray-900 break-all">{debugInfo.search}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Hash:</label>
              <p className="text-sm text-gray-900 break-all">{debugInfo.hash}</p>
            </div>
          </div>

          <h2 className="text-lg font-semibold mt-6">Token Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Access Token Present:</label>
              <p className="text-sm text-gray-900">{debugInfo.accessToken ? 'Yes' : 'No'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Refresh Token Present:</label>
              <p className="text-sm text-gray-900">{debugInfo.refreshToken ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <h2 className="text-lg font-semibold mt-6">All URL Parameters</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.allParams, null, 2)}
          </pre>

          <div className="mt-6">
            <a 
              href="/reset-password"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Reset Password Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 