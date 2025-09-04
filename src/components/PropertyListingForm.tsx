'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useUIStore } from '@/lib/store';
import PhotoUpload from './PhotoUpload';
import { Button } from '@/components/ui/button';

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
  photos: string[];
}

interface PropertyListingFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  property?: any; // For editing existing property (can be Property or PropertyFormData)
  onSubmit: (data: PropertyFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'condo', label: 'Condo' },
  { value: 'studio', label: 'Studio' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'loft', label: 'Loft' },
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
  'Security System',
  'Storage',
  'Terrace',
  'Fireplace',
  'Built-in Wardrobes',
];

export default function PropertyListingForm({
  property,
  onSubmit,
  onCancel,
  loading = false,
}: PropertyListingFormProps) {
  const { addToast } = useUIStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: '',
    location: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    size: '',
    year_built: '',
    status: 'pending',
    listing_type: 'sale',
    amenities: [],
    address: '',
    city: '',
    postal_code: '',
    country: 'Turkey',
    latitude: '',
    longitude: '',
    photos: [],
  });

  // Load property data when editing
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        price: property.price?.toString() || '',
        location: property.location || '',
        type: property.type || '',
        bedrooms: property.bedrooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        size: property.size?.toString() || '',
        year_built: property.year_built?.toString() || '',
        status: property.status || 'pending',
        listing_type: property.listing_type || 'sale',
        amenities: property.amenities || [],
        address: property.address || '',
        city: property.city || '',
        postal_code: property.postal_code || '',
        country: property.country || 'Turkey',
        latitude: property.latitude?.toString() || '',
        longitude: property.longitude?.toString() || '',
        photos: property.photos || [],
      });
    }
  }, [property]);

  const handleInputChange = (
    field: keyof PropertyFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handlePhotoUpload = (photos: string[]) => {
    setFormData((prev) => ({
      ...prev,
      photos,
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (
          !formData.title ||
          !formData.price ||
          !formData.location ||
          !formData.type
        ) {
          addToast({
            type: 'error',
            message: 'Please fill in all required fields in Basic Information',
          });
          return false;
        }
        break;
      case 2:
        if (!formData.address || !formData.city) {
          addToast({
            type: 'error',
            message: 'Please fill in address and city',
          });
          return false;
        }
        break;
      case 3:
        // Amenities are optional, so no validation needed
        break;
      case 4:
        // Photos are optional, so no validation needed
        break;
      case 5:
        // Review step, no validation needed
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      await onSubmit(formData);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-fg">Basic Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-fg mb-1">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="Enter property title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-fg mb-1">
            Price *
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="Enter price"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-fg mb-1">
            Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="Enter location"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-fg mb-1">
            Property Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            required
          >
            <option value="">Select Property Type</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-fg mb-1">
            Listing Type *
          </label>
          <select
            value={formData.listing_type}
            onChange={(e) => handleInputChange('listing_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            required
          >
            {LISTING_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status field - shown when editing existing property */}
        {property && (
          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-fg mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          placeholder="Describe the property..."
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-fg">Property Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-fg mb-1">
            Bedrooms
          </label>
          <input
            type="number"
            value={formData.bedrooms}
            onChange={(e) => handleInputChange('bedrooms', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="Number of bedrooms"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-fg mb-1">
            Bathrooms
          </label>
          <input
            type="number"
            value={formData.bathrooms}
            onChange={(e) => handleInputChange('bathrooms', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="Number of bathrooms"
            min="0"
            step="0.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-fg mb-1">
            Size (m²)
          </label>
          <input
            type="number"
            value={formData.size}
            onChange={(e) => handleInputChange('size', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="Property size in square meters"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-fg mb-1">
            Year Built
          </label>
          <input
            type="number"
            value={formData.year_built}
            onChange={(e) => handleInputChange('year_built', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            placeholder="Year built"
            min="1800"
            max={new Date().getFullYear()}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-fg">Address Information</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              Address *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder="Street address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              City *
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder="City"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              Postal Code
            </label>
            <input
              type="text"
              value={formData.postal_code}
              onChange={(e) => handleInputChange('postal_code', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder="Postal code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder="Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              Latitude
            </label>
            <input
              type="number"
              value={formData.latitude}
              onChange={(e) => handleInputChange('latitude', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder="Latitude"
              step="any"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              Longitude
            </label>
            <input
              type="number"
              value={formData.longitude}
              onChange={(e) => handleInputChange('longitude', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder="Longitude"
              step="any"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-fg">Amenities & Features</h3>

      <div>
        <label className="block text-sm font-medium text-fg mb-3">
          Select Available Amenities
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {AMENITIES.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="rounded border-gray-300 text-primary-blue focus:ring-primary-blue"
              />
              <span className="text-sm text-fg">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {formData.amenities.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-fg mb-2">
            Selected Amenities:
          </h4>
          <div className="flex flex-wrap gap-2">
            {formData.amenities.map((amenity) => (
              <span
                key={amenity}
                className="px-2 py-1 bg-primary-blue text-white text-xs rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-fg mb-4">Property Photos</h3>
        <p className="text-sm text-muted mb-6">
          Upload photos of your property. You can drag and drop images here or
          click to browse.
        </p>

        <PhotoUpload
          propertyId={property?.id}
          onUploadComplete={handlePhotoUpload}
          existingPhotos={formData.photos}
          maxFiles={10}
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-fg">Review & Submit</h3>

      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-fg mb-3">Basic Information</h4>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-medium text-gray-700">Title:</dt>
                <dd className="text-gray-900">{formData.title}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Price:</dt>
                <dd className="text-gray-900">
                  ${parseFloat(formData.price || '0').toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Type:</dt>
                <dd className="text-gray-900">
                  {PROPERTY_TYPES.find((t) => t.value === formData.type)?.label}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Listing Type:</dt>
                <dd className="text-gray-900">
                  {
                    LISTING_TYPES.find((t) => t.value === formData.listing_type)
                      ?.label
                  }
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Status:</dt>
                <dd className="text-gray-900">
                  {
                    STATUS_OPTIONS.find((s) => s.value === formData.status)
                      ?.label
                  }
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 className="font-medium text-fg mb-3">Property Details</h4>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-medium text-gray-700">Location:</dt>
                <dd className="text-gray-900">{formData.location}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Address:</dt>
                <dd className="text-gray-900">{formData.address}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">City:</dt>
                <dd className="text-gray-900">{formData.city}</dd>
              </div>
              {formData.bedrooms && (
                <div>
                  <dt className="font-medium text-gray-700">Bedrooms:</dt>
                  <dd className="text-gray-900">{formData.bedrooms}</dd>
                </div>
              )}
              {formData.bathrooms && (
                <div>
                  <dt className="font-medium text-gray-700">Bathrooms:</dt>
                  <dd className="text-gray-900">{formData.bathrooms}</dd>
                </div>
              )}
              {formData.size && (
                <div>
                  <dt className="font-medium text-gray-700">Size:</dt>
                  <dd className="text-gray-900">{formData.size} m²</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {formData.amenities.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-fg mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="px-2 py-1 bg-primary-blue text-white text-xs rounded-full"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {formData.description && (
          <div className="mt-6">
            <h4 className="font-medium text-fg mb-2">Description</h4>
            <p className="text-sm text-gray-700">{formData.description}</p>
          </div>
        )}

        {formData.photos.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-fg mb-2">
              Photos ({formData.photos.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {formData.photos.slice(0, 4).map((photo, index) => (
                <Image
                  key={index}
                  src={photo}
                  alt={`Property photo ${index + 1}`}
                  width={150}
                  height={80}
                  className="w-full h-16 object-cover rounded"
                />
              ))}
              {formData.photos.length > 4 && (
                <div className="w-full h-16 bg-muted/20 rounded flex items-center justify-center text-sm text-muted">
                  +{formData.photos.length - 4} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-dark-charcoal">
            {property ? 'Edit Property' : 'Add New Property'}
          </h2>
          <span className="text-sm text-muted">Step {currentStep} of 5</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-blue h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted">
          <span>Basic Info</span>
          <span>Details</span>
          <span>Amenities</span>
          <span>Photos</span>
          <span>Review</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          {/* Previous Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="min-w-[110px]"
          >
            Previous
          </Button>

          {/* Cancel Button */}
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="min-w-[110px]"
          >
            Cancel
          </Button>

          {/* Next/Submit Button */}
          {currentStep < 5 ? (
            <Button
              type="button"
              onClick={handleNext}
              size="lg"
              className="min-w-[120px] bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600/60 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="min-w-[120px] bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600/60 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Saving...'
                : property
                  ? 'Update Property'
                  : 'Create Property'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
