'use client';

import { useEffect, useState } from 'react';
import { useFavoritesStore } from '@/lib/store/favoritesStore';
import { useUIStore } from '@/lib/store';

export default function RealtimeDemo() {
  const { favorites, enableRealtime, disableRealtime, isRealtimeEnabled } =
    useFavoritesStore();
  const { addToast } = useUIStore();
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    enableRealtime(); // Enable real-time on component mount
    return () => {
      disableRealtime(); // Cleanup on unmount
    };
  }, [enableRealtime, disableRealtime]);

  useEffect(() => {
    setLastUpdate(new Date()); // Update timestamp when favorites change
  }, [favorites]);

  const handleToggleRealtime = async () => {
    if (isRealtimeEnabled) {
      disableRealtime();
      addToast({ type: 'info', message: 'Real-time updates disabled' });
    } else {
      await enableRealtime();
      addToast({ type: 'success', message: 'Real-time updates enabled' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-dark-charcoal mb-4">
        Real-time Favorites Demo
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${isRealtimeEnabled ? 'bg-green-500' : 'bg-gray-400'}`}
            ></div>
            <span className="text-sm font-medium">
              {isRealtimeEnabled ? 'Real-time Active' : 'Real-time Inactive'}
            </span>
          </div>
          <button
            onClick={handleToggleRealtime}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isRealtimeEnabled ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
          >
            {isRealtimeEnabled ? 'Disable' : 'Enable'} Real-time
          </button>
        </div>
        <div className="bg-gray-50 rounded-md p-4">
          <div className="text-sm text-gray-600 mb-2">Current Favorites:</div>
          <div className="text-2xl font-bold text-dark-charcoal">
            {favorites.length}
          </div>
        </div>
        {lastUpdate && (
          <div className="text-xs text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
        <div className="bg-blue-50 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            How to test:
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Open another browser tab/window</li>
            <li>• Navigate to any property page</li>
            <li>• Add/remove properties from favorites</li>
            <li>• Watch this demo update in real-time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
