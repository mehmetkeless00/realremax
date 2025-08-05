/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema, PropertyInput } from '@/lib/validation/propertySchema';
import { useUIStore } from '@/lib/store';

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
];

const listingTypes = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' },
];

const amenitiesList = [
  'Balcony',
  'Parking',
  'Garden',
  'Pool',
  'Gym',
  'Security',
  'Elevator',
  'Air Conditioning',
  'Heating',
  'Furnished',
  'Pet Friendly',
  'Wheelchair Accessible',
];

export default function PropertyListingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const { addToast } = useUIStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    setValue,
  } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema) as any,
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      price: 1,
      location: '',
      type: 'apartment',
      listing_type: 'sale',
      status: 'active',
      bedrooms: 0,
      bathrooms: 0,
      size: 1,
      year_built: new Date().getFullYear(),
      amenities: [],
      address: '',
      city: '',
      postal_code: '',
      country: 'Netherlands',
      latitude: 0,
      longitude: 0,
      photos: [],
    },
  });

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];

    setSelectedAmenities(newAmenities);
    setValue('amenities', newAmenities, { shouldValidate: true });
  };

  const onSubmit = async (data: PropertyInput) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Form data:', data);
      addToast({
        type: 'success',
        message: 'Property listed successfully!',
      });

      reset();
      setSelectedAmenities([]);
    } catch (error) {
      console.error('Error submitting form:', error);
      addToast({
        type: 'error',
        message: 'Failed to list property. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form?')) {
      reset();
      setSelectedAmenities([]);
      addToast({
        type: 'info',
        message: 'Form has been reset.',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        List Your Property
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Title *
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="Enter property title"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              placeholder="Enter price"
              min="1"
              max="10000000"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              {...register('location')}
              type="text"
              placeholder="Enter location"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type *
            </label>
            <select
              {...register('type')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select property type</option>
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Type *
            </label>
            <select
              {...register('listing_type')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
                errors.listing_type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select listing type</option>
              {listingTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.listing_type && (
              <p className="mt-1 text-sm text-red-600">
                {errors.listing_type.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              {...register('status')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
                errors.status ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select status</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Describe your property..."
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <input
              {...register('bedrooms', { valueAsNumber: true })}
              type="number"
              min="0"
              max="20"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
                errors.bedrooms ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.bedrooms && (
              <p className="mt-1 text-sm text-red-600">
                {errors.bedrooms.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bathrooms
            </label>
            <input
              {...register('bathrooms', { valueAsNumber: true })}
              type="number"
              min="0"
              max="20"
              step="0.5"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
                errors.bathrooms ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.bathrooms && (
              <p className="mt-1 text-sm text-red-600">
                {errors.bathrooms.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size (sq ft)
            </label>
            <input
              {...register('size', { valueAsNumber: true })}
              type="number"
              min="1"
              max="10000"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
                errors.size ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.size && (
              <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year Built
            </label>
            <input
              {...register('year_built', { valueAsNumber: true })}
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
                errors.year_built ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.year_built && (
              <p className="mt-1 text-sm text-red-600">
                {errors.year_built.message}
              </p>
            )}
          </div>
        </div>

        {/* Address Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              {...register('address')}
              type="text"
              placeholder="Enter address"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              {...register('city')}
              type="text"
              placeholder="Enter city"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              {...register('postal_code')}
              type="text"
              placeholder="Enter postal code"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
                errors.postal_code ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.postal_code && (
              <p className="mt-1 text-sm text-red-600">
                {errors.postal_code.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              {...register('country')}
              type="text"
              placeholder="Enter country"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
                errors.country ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">
                {errors.country.message}
              </p>
            )}
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude
            </label>
            <input
              {...register('latitude', { valueAsNumber: true })}
              type="number"
              step="any"
              placeholder="Enter latitude"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
                errors.latitude ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.latitude && (
              <p className="mt-1 text-sm text-red-600">
                {errors.latitude.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude
            </label>
            <input
              {...register('longitude', { valueAsNumber: true })}
              type="number"
              step="any"
              placeholder="Enter longitude"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm ${
                errors.longitude ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.longitude && (
              <p className="mt-1 text-sm text-red-600">
                {errors.longitude.message}
              </p>
            )}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {amenitiesList.map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="rounded border-gray-300 text-primary-blue focus:ring-primary-blue"
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
          {errors.amenities && (
            <p className="mt-1 text-sm text-red-600">
              {errors.amenities.message}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-blue border border-transparent rounded-md hover:bg-primary-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Listing Property...' : 'List Property'}
          </button>
        </div>

        {/* Debug Information (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Debug Info:
            </h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Form is dirty: {isDirty ? 'Yes' : 'No'}</p>
              <p>Form is valid: {isValid ? 'Yes' : 'No'}</p>
              <p>Errors: {Object.keys(errors).length}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
