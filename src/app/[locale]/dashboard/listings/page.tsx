'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/lib/store';
import { useUIStore } from '@/lib/store';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PropertyListingForm from '@/components/PropertyListingForm';

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  year_built: string;
  status: string;
  listing_type: string;
  amenities: string[];
  address: string;
  city: string;
  postal_code: string;
  country: string;
  latitude: string;
  longitude: string;
}

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  year_built?: number;
  status: 'draft' | 'published' | 'archived';
  listing_type?: string;
  amenities?: string[];
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  published_at?: string;
}

export default function ListingsPage() {
  const { user } = useUserStore();
  const { addToast } = useUIStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadProperties = useCallback(async () => {
    try {
      const response = await fetch('/api/listings');
      if (!response.ok) throw new Error('Failed to load properties');
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Load properties error:', error);
      addToast({ type: 'error', message: 'Failed to load properties' });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (
      user?.user_metadata?.role !== 'agent' &&
      user?.user_metadata?.role !== 'admin'
    ) {
      addToast({
        type: 'error',
        message: 'Access denied. Agent or Admin role required.',
      });
      return;
    }

    // Check if user is admin
    setIsAdmin(user?.user_metadata?.role === 'admin');
    loadProperties();
  }, [user, addToast, loadProperties]);

  const handleFormSubmit = async (formData: PropertyFormData) => {
    setFormLoading(true);

    try {
      const url = '/api/listings';
      const method = editingProperty ? 'PUT' : 'POST';
      const body = editingProperty
        ? { id: editingProperty.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save property');

      addToast({
        type: 'success',
        message: `Property ${editingProperty ? 'updated' : 'created'} successfully`,
      });
      setShowForm(false);
      setEditingProperty(null);
      loadProperties();
    } catch (error) {
      console.error('Save property error:', error);
      addToast({ type: 'error', message: 'Failed to save property' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const response = await fetch(`/api/listings?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete property');

      addToast({ type: 'success', message: 'Property deleted successfully' });
      loadProperties();
    } catch (error) {
      console.error('Delete property error:', error);
      addToast({ type: 'error', message: 'Failed to delete property' });
    }
  };

  const handlePublishToggle = async (property: Property) => {
    const newStatus = property.status === 'published' ? 'draft' : 'published';
    const action = newStatus === 'published' ? 'publish' : 'unpublish';

    try {
      const response = await fetch('/api/listings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: property.id, status: newStatus }),
      });

      if (!response.ok) throw new Error(`Failed to ${action} property`);

      addToast({
        type: 'success',
        message: `Property ${action}ed successfully`,
      });
      loadProperties();
    } catch (error) {
      console.error(`${action} property error:`, error);
      addToast({ type: 'error', message: `Failed to ${action} property` });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProperty(null);
  };

  const filteredProperties = properties.filter((property) => {
    if (statusFilter === 'all') return true;
    return property.status === statusFilter;
  });

  if (
    user?.user_metadata?.role !== 'agent' &&
    user?.user_metadata?.role !== 'admin'
  ) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-fg mb-4">Access Denied</h1>
            <p className="text-muted mb-6">
              You need agent or admin privileges to access this page.
            </p>
            <Button asChild variant="secondary" size="md">
              <Link href="/dashboard">
                <span>Back to Dashboard</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-fg mb-4">
            {isAdmin ? 'All Property Listings' : 'My Property Listings'}
          </h1>
          <Button
            onClick={() => setShowForm(true)}
            variant="secondary"
            size="md"
          >
            Add Property
          </Button>
        </div>

        {/* Admin Filters */}
        {isAdmin && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-fg mb-3">
              Admin Filters
            </h3>
            <div className="flex gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-fg mb-1">
                  Status Filter
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="text-sm text-muted">
                Showing {filteredProperties.length} of {properties.length}{' '}
                properties
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="mb-8">
            <PropertyListingForm
              property={editingProperty}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              loading={formLoading}
            />
          </div>
        )}

        {loading && !showForm ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
            <p className="mt-2 text-muted">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="mb-4">
              <svg
                className="w-12 h-12 mx-auto text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-fg mb-2">
              No Listings Found
            </h3>
            <p className="text-muted mb-6">
              {statusFilter !== 'all'
                ? `No properties with status "${statusFilter}" found.`
                : "You haven't created any property listings yet."}
            </p>
            <Button
              onClick={() => setShowForm(true)}
              variant="secondary"
              size="md"
            >
              Add Your First Property
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-fg">
                      {property.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        property.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : property.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : property.status === 'archived'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-muted/20 text-fg'
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>

                  <p className="text-muted text-sm mb-2">{property.location}</p>
                  <p className="text-primary-blue font-bold text-lg mb-2">
                    ${property.price.toLocaleString()}
                  </p>

                  <div className="flex gap-4 text-sm text-muted mb-4">
                    {property.bedrooms && <span>{property.bedrooms} beds</span>}
                    {property.bathrooms && (
                      <span>{property.bathrooms} baths</span>
                    )}
                    {property.size && <span>{property.size}m²</span>}
                  </div>

                  {property.amenities && property.amenities.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-muted mb-1">Amenities:</p>
                      <div className="flex flex-wrap gap-1">
                        {property.amenities.slice(0, 3).map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-1 bg-muted/20 text-xs text-fg rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                        {property.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-muted/20 text-xs text-fg rounded">
                            +{property.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Admin Publish/Unpublish Button */}
                  {isAdmin && (
                    <div className="mb-4">
                      <Button
                        onClick={() => handlePublishToggle(property)}
                        variant={
                          property.status === 'published'
                            ? 'outline'
                            : 'primary'
                        }
                        size="sm"
                        className="w-full"
                      >
                        {property.status === 'published'
                          ? 'Unpublish'
                          : 'Publish'}
                      </Button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(property)}
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(property.id)}
                      variant="danger"
                      size="sm"
                      className="flex-1"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
