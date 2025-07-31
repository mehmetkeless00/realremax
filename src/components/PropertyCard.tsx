'use client';

import { useState } from 'react';
import Link from 'next/link';
import OptimizedImage from './OptimizedImage';
import { useUserStore } from '@/lib/store';
import { useUIStore } from '@/lib/store';
import { useFavoritesStore } from '@/lib/store/favoritesStore';
import type { PropertyCardProps } from '@/types/property';

export default function PropertyCard({
  property,
  view = 'grid',
  showFavorite = true,
  onFavoriteToggle,
  className = '',
}: PropertyCardProps) {
  const { user } = useUserStore();
  const { addToast } = useUIStore();
  const { favorites, toggleFavorite, isSyncing } = useFavoritesStore();
  const [imageError, setImageError] = useState(false);

  const isFavorite = favorites.includes(property.id);

  // Default image if property image fails to load
  const defaultImage = '/images/placeholder-property.svg';
  const propertyImage = property.images?.[0] || defaultImage;

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      addToast({
        type: 'warning',
        message: 'Please sign in to add properties to favorites',
      });
      return;
    }

    if (isSyncing) return; // Prevent multiple clicks while syncing

    try {
      await toggleFavorite(property.id);

      // Call parent callback if provided
      if (onFavoriteToggle) {
        onFavoriteToggle(property.id, !isFavorite);
      }

      // Show feedback
      addToast({
        type: 'success',
        message: isFavorite ? 'Removed from favorites' : 'Added to favorites!',
      });
    } catch (error) {
      console.error('Favorite toggle error:', error);
      addToast({
        type: 'error',
        message: 'Failed to update favorites. Please try again.',
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSize = (size: number | null) => {
    if (!size) return '';
    return `${size} sq ft`;
  };

  const getPropertyStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-red-100 text-red-800';
      case 'rented':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getListingTypeColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'bg-primary-red text-white';
      case 'rent':
        return 'bg-primary-blue text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (view === 'list') {
    return (
      <div
        className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 ${className}`}
      >
        <Link href={`/properties/${property.id}`}>
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative md:w-64 md:h-48 w-full h-48">
              <OptimizedImage
                src={imageError ? defaultImage : propertyImage}
                alt={property.title}
                width={400}
                height={300}
                className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                sizes="(max-width: 768px) 100vw, 256px"
                onError={() => setImageError(true)}
              />

              {/* Status Badge */}
              <div className="absolute top-2 left-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getPropertyStatusColor(
                    property.status
                  )}`}
                >
                  {property.status}
                </span>
              </div>

              {/* Listing Type Badge */}
              {property.listing && (
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getListingTypeColor(
                      property.listing.listing_type
                    )}`}
                  >
                    {property.listing.listing_type === 'sale'
                      ? 'For Sale'
                      : 'For Rent'}
                  </span>
                </div>
              )}

              {/* Favorite Button */}
              {showFavorite && (
                <button
                  onClick={handleFavoriteToggle}
                  disabled={isSyncing}
                  className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-all duration-200 ${
                    isFavorite
                      ? 'bg-primary-red text-white'
                      : 'bg-white text-gray-600 hover:text-primary-red'
                  } ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSyncing ? (
                    <svg
                      className="w-5 h-5 animate-spin"
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
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill={isFavorite ? 'currentColor' : 'none'}
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
                  )}
                </button>
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-dark-charcoal hover:text-primary-blue transition-colors">
                  {property.title}
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-blue">
                    {formatPrice(property.price)}
                  </div>
                  {property.listing && (
                    <div className="text-sm text-gray-500">
                      {property.listing.listing_type === 'rent' ? '/month' : ''}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-600 mb-4 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {property.location}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                {property.bedrooms && (
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                      />
                    </svg>
                    {property.bedrooms} bed
                  </span>
                )}
                {property.bathrooms && (
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                      />
                    </svg>
                    {property.bathrooms} bath
                  </span>
                )}
                {property.size && (
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                    {formatSize(property.size)}
                  </span>
                )}
              </div>

              {property.description && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {property.description}
                </p>
              )}

              {property.agent && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {property.agent.name.charAt(0)}
                    </div>
                    <div className="ml-2">
                      <div className="text-sm font-medium text-dark-charcoal">
                        {property.agent.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {property.agent.company}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Grid View (default)
  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden ${className}`}
    >
      <Link href={`/properties/${property.id}`}>
        <div className="relative">
          <OptimizedImage
            src={imageError ? defaultImage : propertyImage}
            alt={property.title}
            width={400}
            height={192}
            className="w-full h-48 object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />

          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getPropertyStatusColor(
                property.status
              )}`}
            >
              {property.status}
            </span>
          </div>

          {/* Listing Type Badge */}
          {property.listing && (
            <div className="absolute top-2 right-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getListingTypeColor(
                  property.listing.listing_type
                )}`}
              >
                {property.listing.listing_type === 'sale'
                  ? 'For Sale'
                  : 'For Rent'}
              </span>
            </div>
          )}

          {/* Favorite Button */}
          {showFavorite && (
            <button
              onClick={handleFavoriteToggle}
              disabled={isSyncing}
              className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-all duration-200 ${
                isFavorite
                  ? 'bg-primary-red text-white'
                  : 'bg-white text-gray-600 hover:text-primary-red'
              } ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSyncing ? (
                <svg
                  className="w-5 h-5 animate-spin"
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
              ) : (
                <svg
                  className="w-5 h-5"
                  fill={isFavorite ? 'currentColor' : 'none'}
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
              )}
            </button>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-dark-charcoal hover:text-primary-blue transition-colors line-clamp-1">
              {property.title}
            </h3>
            <div className="text-right">
              <div className="text-xl font-bold text-primary-blue">
                {formatPrice(property.price)}
              </div>
              {property.listing && (
                <div className="text-xs text-gray-500">
                  {property.listing.listing_type === 'rent' ? '/month' : ''}
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-3 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="line-clamp-1">{property.location}</span>
          </p>

          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex space-x-3">
              {property.bedrooms && (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                    />
                  </svg>
                  {property.bedrooms}
                </span>
              )}
              {property.bathrooms && (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                    />
                  </svg>
                  {property.bathrooms}
                </span>
              )}
            </div>
            {property.size && (
              <span className="text-gray-500">{formatSize(property.size)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
