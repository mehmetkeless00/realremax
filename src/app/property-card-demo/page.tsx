'use client';

import { useState, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { useFavoritesStore } from '@/lib/store/favoritesStore';
import type { PropertyWithListing } from '@/types/property';

// Sample data for testing
const sampleProperties: PropertyWithListing[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    description:
      'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views.',
    price: 450000,
    location: 'Downtown, City Center',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    year_built: 2018,
    agent_id: 'agent-1',
    status: 'active',
    listing_type: 'sale',
    amenities: ['Balcony', 'Elevator', 'Parking'],
    address: '123 Main St',
    city: 'Istanbul',
    postal_code: '34000',
    country: 'Turkey',
    latitude: 41.0082,
    longitude: 28.9784,
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
    status: 'active',
    listing_type: 'sale',
    amenities: ['Garden', 'Pool', 'Garage'],
    address: '456 Elm St',
    city: 'Ankara',
    postal_code: '06000',
    country: 'Turkey',
    latitude: 39.9334,
    longitude: 32.8597,
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
  {
    id: '3',
    title: 'Cozy Studio for Rent',
    description:
      'Perfect studio apartment for young professionals, fully furnished.',
    price: 1800,
    location: 'University District',
    type: 'studio',
    bedrooms: 0,
    bathrooms: 1,
    size: 550,
    year_built: 2020,
    agent_id: 'agent-3',
    status: 'active',
    listing_type: 'rent',
    amenities: ['Furnished', 'WiFi', 'Utilities Included'],
    address: '789 College Ave',
    city: 'Izmir',
    postal_code: '35000',
    country: 'Turkey',
    latitude: 38.4192,
    longitude: 27.1287,
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z',
    listing: {
      id: 'listing-3',
      property_id: '3',
      agent_id: 'agent-3',
      listing_type: 'rent',
      price: 1800,
      status: 'active',
      created_at: '2024-01-13T10:00:00Z',
      updated_at: '2024-01-13T10:00:00Z',
    },
    agent: {
      id: 'agent-3',
      name: 'Mike Wilson',
      company: 'Remax Urban',
      phone: '+1-555-0789',
    },
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop',
    ],
  },
  {
    id: '4',
    title: 'Waterfront Condo',
    description:
      'Luxurious waterfront condo with marina access and private balcony.',
    price: 650000,
    location: 'Harbor Bay',
    type: 'condo',
    bedrooms: 3,
    bathrooms: 2,
    size: 1800,
    year_built: 2015,
    agent_id: 'agent-1',
    status: 'pending',
    listing_type: 'sale',
    amenities: ['Marina Access', 'Balcony', 'Gym', 'Pool'],
    address: '321 Harbor Dr',
    city: 'Antalya',
    postal_code: '07000',
    country: 'Turkey',
    latitude: 36.8969,
    longitude: 30.7133,
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
    listing: {
      id: 'listing-4',
      property_id: '4',
      agent_id: 'agent-1',
      listing_type: 'sale',
      price: 650000,
      status: 'pending',
      created_at: '2024-01-12T10:00:00Z',
      updated_at: '2024-01-12T10:00:00Z',
    },
    agent: {
      id: 'agent-1',
      name: 'John Smith',
      company: 'Remax Elite',
      phone: '+1-555-0123',
    },
    photos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=300&fit=crop',
    ],
  },
];

export default function PropertyCardDemo() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFavorites, setShowFavorites] = useState(true);
  const { favorites, loadFavorites } = useFavoritesStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleFavoriteToggle = (propertyId: string, isFavorite: boolean) => {
    console.log(
      `Property ${propertyId} ${isFavorite ? 'added to' : 'removed from'} favorites`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-lg font-bold text-dark-charcoal mb-4">
            Property Card Component Demo
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

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-fg">Favorites:</span>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showFavorites}
                  onChange={(e) => setShowFavorites(e.target.checked)}
                  className="rounded border-gray-300 text-primary-blue focus:ring-primary-blue"
                />
                <span className="ml-2 text-sm text-fg">
                  Show favorite buttons
                </span>
              </label>
            </div>

            <div className="text-sm text-muted">
              {favorites.length}{' '}
              {favorites.length === 1 ? 'property' : 'properties'} in favorites
            </div>
          </div>
        </div>

        {/* Property Cards */}
        <div
          className={
            view === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-6'
          }
        >
          {sampleProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              view={view}
              showFavorite={showFavorites}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xs font-semibold text-dark-charcoal mb-4">
            Component Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-fg mb-2">Grid View</h3>
              <ul className="text-sm text-muted space-y-1">
                <li>• Compact card layout</li>
                <li>• Image with status badges</li>
                <li>• Price and basic info</li>
                <li>• Favorite button</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-fg mb-2">List View</h3>
              <ul className="text-sm text-muted space-y-1">
                <li>• Horizontal layout</li>
                <li>• Detailed property information</li>
                <li>• Agent information</li>
                <li>• Full description</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
