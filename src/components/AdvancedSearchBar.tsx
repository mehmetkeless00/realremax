'use client';

import { useState, useEffect, useRef } from 'react';
import { useUIStore } from '@/lib/store';

interface AdvancedSearchBarProps {
  onSearch: (
    params: Record<string, string | string[] | number | undefined>
  ) => void;
  loading?: boolean;
  className?: string;
}

interface SearchFilters
  extends Record<string, string | number | string[] | undefined> {
  location?: string;
  type?: string;
  priceMin?: string;
  priceMax?: string;
  sizeMin?: string;
  sizeMax?: string;
  bedrooms?: string;
  bathrooms?: string;
  yearBuilt?: string;
  amenities?: string[];
}

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'condo', label: 'Condo' },
  { value: 'studio', label: 'Studio' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' },
];

const LISTING_TYPES = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
];

const AMENITIES = [
  'Balcony',
  'Garden',
  'Pool',
  'Gym',
  'Parking',
  'Elevator',
  'Air Conditioning',
  'Heating',
  'Furnished',
  'Pet Friendly',
];

export default function AdvancedSearchBar({
  onSearch,
  loading,
  className = '',
}: AdvancedSearchBarProps) {
  const { addToast } = useUIStore();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    type: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    sizeMin: '',
    sizeMax: '',
    status: 'active',
    listingType: '',
    amenities: [],
    yearBuilt: '',
    parking: '',
  });

  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Sample location suggestions (in real app, this would come from API)
  const sampleLocations = [
    'Istanbul, Turkey',
    'Ankara, Turkey',
    'Izmir, Turkey',
    'Bursa, Turkey',
    'Antalya, Turkey',
    'Adana, Turkey',
    'Konya, Turkey',
    'Gaziantep, Turkey',
    'Mersin, Turkey',
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationChange = (value: string) => {
    setFilters((prev) => ({ ...prev, location: value }));

    if (value.length > 2) {
      const filtered = sampleLocations.filter((loc) =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setFilters((prev) => ({ ...prev, location: suggestion }));
    setShowSuggestions(false);
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: (prev.amenities || []).includes(amenity)
        ? (prev.amenities || []).filter((a) => a !== amenity)
        : [...(prev.amenities || []), amenity],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate price range
    if (
      filters.priceMin &&
      filters.priceMax &&
      parseFloat(filters.priceMin) > parseFloat(filters.priceMax)
    ) {
      addToast({
        type: 'error',
        message: 'Minimum price cannot be greater than maximum price',
      });
      return;
    }

    // Validate size range
    if (
      filters.sizeMin &&
      filters.sizeMax &&
      parseFloat(filters.sizeMin) > parseFloat(filters.sizeMax)
    ) {
      addToast({
        type: 'error',
        message: 'Minimum size cannot be greater than maximum size',
      });
      return;
    }

    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      location: '',
      type: '',
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      sizeMin: '',
      sizeMax: '',
      status: 'active',
      listingType: '',
      amenities: [],
      yearBuilt: '',
      parking: '',
    });
    addToast({ type: 'info', message: 'Search filters reset' });
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) =>
      value !== '' &&
      value !== 'active' &&
      (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      <form onSubmit={handleSubmit} className="p-6">
        {/* Basic Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Location with Autocomplete */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder="Enter location..."
            />
            {showSuggestions && locationSuggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
              >
                {locationSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            >
              <option value="">Any Type</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Listing Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Listing Type
            </label>
            <select
              value={filters.listingType}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, listingType: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            >
              <option value="">Any</option>
              {LISTING_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-primary-blue hover:text-blue-700 font-medium flex items-center gap-2"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            Advanced Filters
            {activeFiltersCount > 0 && (
              <span className="bg-primary-red text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t border-gray-200 pt-4 space-y-6">
            {/* Price Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceMin: e.target.value,
                      }))
                    }
                    placeholder="Min"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceMax: e.target.value,
                      }))
                    }
                    placeholder="Max"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  />
                </div>
              </div>

              {/* Size Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size Range (m²)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.sizeMin}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sizeMin: e.target.value,
                      }))
                    }
                    placeholder="Min"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={filters.sizeMax}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sizeMax: e.target.value,
                      }))
                    }
                    placeholder="Max"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Bedrooms, Bathrooms, Year Built */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      bedrooms: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      bathrooms: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year Built
                </label>
                <input
                  type="number"
                  value={filters.yearBuilt}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      yearBuilt: e.target.value,
                    }))
                  }
                  placeholder="Min year"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {AMENITIES.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(filters.amenities || []).includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded border-gray-300 text-primary-blue focus:ring-primary-blue"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
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
                Search Properties
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
