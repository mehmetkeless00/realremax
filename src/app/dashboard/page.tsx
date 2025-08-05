'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from '@/lib/auth';
import { useUserStore } from '@/lib/store';
import UserProfile from '@/components/UserProfile';
import InquiryManagement from '@/components/InquiryManagement';

export default function Dashboard() {
  const router = useRouter();
  const {
    user,
    signIn: setUserInStore,
    signOut: signOutFromStore,
  } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUserInStore(currentUser, null);
        } else {
          router.push('/auth/signin');
        }
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/auth/signin');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router, setUserInStore]);

  const handleSignOut = async () => {
    try {
      await signOut();
      signOutFromStore();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-base font-bold text-gray-900">
                    Welcome to Remax Unified Platform
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    {user?.email} - {user?.user_metadata?.role || 'User'}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="bg-primary-red text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    User Profile
                  </h2>
                  <UserProfile />
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-900">
                        Properties
                      </h3>
                      <p className="mt-2 text-sm text-blue-700">
                        Browse and search for properties
                      </p>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-green-900">
                        Listings
                      </h3>
                      <p className="mt-2 text-sm text-green-700">
                        View active property listings
                      </p>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-purple-900">
                        Agents
                      </h3>
                      <p className="mt-2 text-sm text-purple-700">
                        Connect with real estate agents
                      </p>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-orange-900">
                        Favorites
                      </h3>
                      <p className="mt-2 text-sm text-orange-700">
                        View your saved properties
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Inquiry Management
                </h2>
                <InquiryManagement />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
