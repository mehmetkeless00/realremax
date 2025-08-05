'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema, PropertyInput } from '@/lib/validation/propertySchema';
import { ValidatedFormField, TextField, NumberField, SelectField, TextAreaField } from './ValidatedFormField';
import { useUIStore } from '@/lib/store';

const propertyTypeOptions = [
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

const listingTypeOptions = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' },
];

interface ValidatedPropertyFormProps {
  initialData?: Partial<PropertyInput>;
  onSubmit: (data: PropertyInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function ValidatedPropertyForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Create Property',
  cancelLabel = 'Cancel',
  loading = false,
}: ValidatedPropertyFormProps) {
  const { addToast } = useUIStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
  } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
    mode: 'onBlur',
    defaultValues: {
      status: 'active',
      listing_type: 'sale',
      ...initialData,
    },
  });

  const watchedValues = watch();

  const handleFormSubmit = async (data: PropertyInput) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      addToast({
        type: 'success',
        message: 'Property created successfully!',
      });
      reset();
    } catch (error) {
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to create property',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
        reset();
        onCancel?.();
      }
    } else {
      onCancel?.();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Property Information</h2>
        <p className="text-gray-600 mt-1">Fill in the details below to create a new property listing.</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Title"
              name="title"
              placeholder="Enter property title"
              register={register}
              error={errors.title}
              required
              maxLength={100}
              showCharacterCount
            />

            <NumberField
              label="Price"
              name="price"
              placeholder="Enter price"
              register={register}
              error={errors.price}
              required
              min={1}
              step={1000}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Location"
              name="location"
              placeholder="Enter location"
              register={register}
              error={errors.location}
              required
            />

            <SelectField
              label="Property Type"
              name="type"
              register={register}
              error={errors.type}
              options={propertyTypeOptions}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Listing Type"
              name="listing_type"
              register={register}
              error={errors.listing_type}
              options={listingTypeOptions}
              required
            />

            <SelectField
              label="Status"
              name="status"
              register={register}
              error={errors.status}
              options={statusOptions}
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Property Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumberField
              label="Bedrooms"
              name="bedrooms"
              placeholder="Number of bedrooms"
              register={register}
              error={errors.bedrooms}
              min={0}
              max={20}
            />

            <NumberField
              label="Bathrooms"
              name="bathrooms"
              placeholder="Number of bathrooms"
              register={register}
              error={errors.bathrooms}
              min={0}
              max={20}
            />

            <NumberField
              label="Size (sq ft)"
              name="size"
              placeholder="Property size"
              register={register}
              error={errors.size}
              min={1}
              max={10000}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberField
              label="Year Built"
              name="year_built"
              placeholder="Year built"
              register={register}
              error={errors.year_built}
              min={1900}
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Address Information</h3>
          
          <TextField
            label="Address"
            name="address"
            placeholder="Enter full address"
            register={register}
            error={errors.address}
            maxLength={200}
            showCharacterCount
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextField
              label="City"
              name="city"
              placeholder="Enter city"
              register={register}
              error={errors.city}
              maxLength={50}
            />

            <TextField
              label="Postal Code"
              name="postal_code"
              placeholder="Enter postal code"
              register={register}
              error={errors.postal_code}
              pattern="^[A-Z0-9\s-]{3,10}$"
            />

            <TextField
              label="Country"
              name="country"
              placeholder="Enter country"
              register={register}
              error={errors.country}
              maxLength={50}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Description</h3>
          
          <TextAreaField
            label="Description"
            name="description"
            placeholder="Describe the property..."
            register={register}
            error={errors.description}
            rows={4}
            maxLength={1000}
            showCharacterCount
            helpText="Provide a detailed description of the property, including features and amenities."
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue transition-colors"
            disabled={isSubmitting || loading}
          >
            {cancelLabel}
          </button>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue transition-colors"
              disabled={isSubmitting || loading || !isDirty}
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={!isValid || isSubmitting || loading}
              className="px-6 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting || loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Debug Information (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Debug Information</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Form Valid: {isValid ? 'Yes' : 'No'}</p>
            <p>Form Dirty: {isDirty ? 'Yes' : 'No'}</p>
            <p>Error Count: {Object.keys(errors).length}</p>
            <details className="mt-2">
              <summary className="cursor-pointer font-medium">Current Values</summary>
              <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
                {JSON.stringify(watchedValues, null, 2)}
              </pre>
            </details>
            {Object.keys(errors).length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer font-medium text-red-600">Errors</summary>
                <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-auto text-red-600">
                  {JSON.stringify(errors, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 