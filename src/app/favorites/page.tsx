'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/store';
import { useFavoritesStore } from '@/lib/store/favoritesStore';
import { useUIStore } from '@/lib/store';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { PropertyWithListing } from '@/types/property';

export default function FavoritesPage() {
  const { user } = useUserStore();
  const { favorites, loadFavorites, isLoading } = useFavoritesStore();
  const { addToast } = useUIStore();
  const [favoriteProperties, setFavoriteProperties] = useState<
    PropertyWithListing[]
  >([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user, loadFavorites]);

  useEffect(() => {
    // Load favorite properties data
    const loadFavoriteProperties = async () => {
      if (favorites.length === 0) {
        setFavoriteProperties([]);
        return;
      }

      try {
        // This would typically fetch from your API
        // For now, we'll use sample data
        const sampleProperties: PropertyWithListing[] = [
          {
            id: '1',
            title: 'Modern Downtown Apartment',
            description:
              'Beautiful 2-bedroom apartment with modern amenities and city views.',
            price: 450000,
            location: 'Downtown, City Center',
            type: 'apartment',
            bedrooms: 2,
            bathrooms: 2,
            size: 1200,
            year_built: 2018,
            agent_id: 'agent-1',
            status: 'published',
            listing_type: 'sale',
            amenities: ['Balcony', 'Elevator', 'Parking'],
            address: '123 Main St',
            city: 'Istanbul',
            postal_code: '34000',
            country: 'Turkey',
            latitude: 41.0082,
            longitude: 28.9784,
            slug: 'modern-downtown-apartment',
            meta_title: 'Modern Downtown Apartment for Sale',
            meta_description:
              'Beautiful 2-bedroom apartment with modern amenities and city views.',
            og_image_url:
              'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=300&fit=crop',
            published_at: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z',
            listing: {
              id: 'listing-1',
              property_id: '1',
              agent_id: 'agent-1',
              listing_type: 'sale',
              price: 450000,
              status: 'active',
              created_at: '2024-01-15T10:00:00Z',
              updated_at: '2024-01-15T10:00:00Z',
            },
            agent: {
              id: 'agent-1',
              name: 'John Smith',
              company: 'Remax Elite',
              phone: '+1-555-0123',
            },
            photos: [
              'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=300&fit=crop',
            ],
          },
          {
            id: '2',
            title: 'Luxury Family Home',
            description:
              'Spacious 4-bedroom family home with large backyard and modern amenities.',
            price: 850000,
            location: 'Suburban Heights',
            type: 'house',
            bedrooms: 4,
            bathrooms: 3,
            size: 2800,
            year_built: 2012,
            agent_id: 'agent-2',
            status: 'published',
            listing_type: 'sale',
            amenities: ['Garden', 'Pool', 'Garage'],
            address: '456 Elm St',
            city: 'Ankara',
            postal_code: '06000',
            country: 'Turkey',
            latitude: 39.9334,
            longitude: 32.8597,
            slug: 'luxury-family-home',
            meta_title: 'Luxury Family Home for Sale',
            meta_description:
              'Spacious 4-bedroom family home with large backyard and modern amenities.',
            og_image_url:
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&h=300&fit=crop',
            published_at: '2024-01-14T10:00:00Z',
            created_at: '2024-01-14T10:00:00Z',
            updated_at: '2024-01-14T10:00:00Z',
            listing: {
              id: 'listing-2',
              property_id: '2',
              agent_id: 'agent-2',
              listing_type: 'sale',
              price: 850000,
              status: 'active',
              created_at: '2024-01-14T10:00:00Z',
              updated_at: '2024-01-14T10:00:00Z',
            },
            agent: {
              id: 'agent-2',
              name: 'Sarah Johnson',
              company: 'Remax Premier',
              phone: '+1-555-0456',
            },
            photos: [
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&h=300&fit=crop',
            ],
          },
        ];

        // Filter to only show properties that are in favorites
        const filteredProperties = sampleProperties.filter((property) =>
          favorites.includes(property.id)
        );

        setFavoriteProperties(filteredProperties);
      } catch (error) {
        console.error('Error loading favorite properties:', error);
        addToast({
          type: 'error',
          message: 'Failed to load favorite properties',
        });
      }
    };

    loadFavoriteProperties();
  }, [favorites, addToast]);

  const handleFavoriteToggle = (propertyId: string, isFavorite: boolean) => {
    // This will be handled by the PropertyCard component
    console.log(
      `Property ${propertyId} ${isFavorite ? 'added to' : 'removed from'} favorites`
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <svg
                className="w-16 h-16 mx-auto text-muted mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-dark-charcoal mb-4">
                Sign In Required
              </h2>
              <p className="text-gray-600 mb-6">
                Please sign in to view and manage your favorite properties.
              </p>
              <Button asChild variant="secondary" size="lg">
                <Link href="/auth/signin">
                  <span>Sign In</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-lg font-bold text-dark-charcoal mb-4">
            My Favorites
          </h1>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-fg">View:</span>
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  view === 'grid'
                    ? 'bg-primary-blue text-white'
                    : 'bg-muted/20 text-fg hover:bg-muted/40'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  view === 'list'
                    ? 'bg-primary-blue text-white'
                    : 'bg-muted/20 text-fg hover:bg-muted/40'
                }`}
              >
                List
              </button>
            </div>

            <div className="text-sm text-muted">
              {favorites.length}{' '}
              {favorites.length === 1 ? 'property' : 'properties'} saved
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
            <p className="mt-2 text-muted">Loading your favorites...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && favorites.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-12 h-12 mx-auto text-muted mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="text-sm font-semibold text-dark-charcoal mb-2">
              No favorites yet
            </h3>
            <p className="text-muted mb-6">
              You haven&apos;t added any properties to your favorites yet.
            </p>
            <Button asChild variant="secondary" size="lg">
              <Link href="/properties">
                <span>Browse Properties</span>
              </Link>
            </Button>
          </div>
        )}

        {/* Property Cards */}
        {!isLoading && favoriteProperties.length > 0 && (
          <div
            className={
              view === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-6'
            }
          >
            {favoriteProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                view={view}
                showFavorite={true}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
