'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/lib/store';

interface Inquiry {
  id: string;
  property_id: string;
  agent_id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'pending' | 'contacted' | 'closed';
  created_at: string;
  properties: {
    id: string;
    title: string;
    location: string;
  };
  agents: {
    id: string;
    name: string;
    email: string;
  };
  users: {
    id: string;
    email: string;
  };
}

export default function InquiryManagement() {
  const { user } = useUserStore();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'user' | 'agent'>('user');

  const loadInquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Determine user role based on user metadata
      const role = user?.user_metadata?.role === 'agent' ? 'agent' : 'user';
      setUserRole(role);

      const response = await fetch(`/api/inquiry?role=${role}`);
      if (!response.ok) {
        throw new Error('Failed to load inquiries');
      }

      const data = await response.json();
      setInquiries(data.inquiries || []);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to load inquiries'
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const updateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      const response = await fetch(`/api/inquiry/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update inquiry status');
      }

      // Reload inquiries to get updated data
      await loadInquiries();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to update status'
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-blue"></div>
          <span className="ml-2 text-sm text-gray-600">
            Loading inquiries...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={loadInquiries}
          className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <svg
          className="w-12 h-12 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p className="text-gray-600">
          {userRole === 'agent'
            ? 'No inquiries received yet.'
            : 'No inquiries sent yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {userRole === 'agent' ? 'Received Inquiries' : 'My Inquiries'}
          </h3>
          <button
            onClick={loadInquiries}
            className="text-sm text-primary-blue hover:text-blue-700"
          >
            Refresh
          </button>
        </div>

        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {userRole === 'agent'
                      ? inquiry.name
                      : inquiry.properties.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {userRole === 'agent'
                      ? inquiry.email
                      : inquiry.properties.location}
                  </p>
                  {inquiry.phone && (
                    <p className="text-sm text-gray-600">{inquiry.phone}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                      inquiry.status
                    )}`}
                  >
                    {inquiry.status.charAt(0).toUpperCase() +
                      inquiry.status.slice(1)}
                  </span>
                  {userRole === 'agent' && (
                    <select
                      value={inquiry.status}
                      onChange={(e) =>
                        updateInquiryStatus(inquiry.id, e.target.value)
                      }
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-blue"
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-700">{inquiry.message}</p>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>
                  {userRole === 'agent' ? (
                    <>
                      Property: {inquiry.properties.title} -{' '}
                      {inquiry.properties.location}
                    </>
                  ) : (
                    <>
                      Agent: {inquiry.agents.name} ({inquiry.agents.email})
                    </>
                  )}
                </span>
                <span>{formatDate(inquiry.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
