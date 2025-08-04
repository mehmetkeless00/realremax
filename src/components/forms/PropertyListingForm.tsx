'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema, PropertyInput } from '@/lib/validation/propertySchema';
import { useUIStore } from '@/lib/store';
import FormField from './FormField';
import ErrorMessage from './ErrorMessage';

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
    resolver: zodResolver(propertySchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      location: '',
      type: 'apartment',
      bedrooms: 0,
      bathrooms: 0,
      size: 0,
      year_built: new Date().getFullYear(),
      status: 'active',
      listing_type: 'sale',
      amenities: [],
      address: '',
      city: '',
      postal_code: '',
      country: 'Netherlands',
      latitude: 0,
      longitude: 0,
      images: [],
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

      // Reset form
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
    reset();
    setSelectedAmenities([]);
    addToast({
      type: 'info',
      message: 'Form has been reset',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          List Your Property
        </h2>
        <p className="text-gray-600">
          Fill out the form below to list your property. All fields marked with
          * are required.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Property Title"
              name="title"
              type="text"
              placeholder="Enter property title"
              required
              register={register}
              error={errors.title}
            />

            <FormField
              label="Price"
              name="price"
              type="number"
              placeholder="Enter price"
              required
              min={1}
              max={10000000}
              step={1000}
              register={register}
              error={errors.price}
            />

            <FormField
              label="Location"
              name="location"
              type="text"
              placeholder="Enter location"
              required
              register={register}
              error={errors.location}
            />

            <FormField
              label="Property Type"
              name="type"
              type="select"
              required
              options={propertyTypes}
              register={register}
              error={errors.type}
            />

            <FormField
              label="Listing Type"
              name="listing_type"
              type="select"
              required
              options={listingTypes}
              register={register}
              error={errors.listing_type}
            />

            <FormField
              label="Status"
              name="status"
              type="select"
              required
              options={statusOptions}
              register={register}
              error={errors.status}
            />
          </div>

          <div className="mt-4">
            <FormField
              label="Description"
              name="description"
              type="textarea"
              placeholder="Describe your property..."
              rows={4}
              register={register}
              error={errors.description}
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Property Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Bedrooms"
              name="bedrooms"
              type="number"
              min={0}
              max={20}
              register={register}
              error={errors.bedrooms}
            />

            <FormField
              label="Bathrooms"
              name="bathrooms"
              type="number"
              min={0}
              max={10}
              step={0.5}
              register={register}
              error={errors.bathrooms}
            />

            <FormField
              label="Size (sq ft)"
              name="size"
              type="number"
              min={1}
              max={10000}
              register={register}
              error={errors.size}
            />

            <FormField
              label="Year Built"
              name="year_built"
              type="number"
              min={1800}
              max={new Date().getFullYear() + 1}
              register={register}
              error={errors.year_built}
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Address Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Address"
              name="address"
              type="text"
              placeholder="Enter full address"
              required
              register={register}
              error={errors.address}
            />

            <FormField
              label="City"
              name="city"
              type="text"
              placeholder="Enter city"
              required
              register={register}
              error={errors.city}
            />

            <FormField
              label="Postal Code"
              name="postal_code"
              type="text"
              placeholder="Enter postal code"
              required
              register={register}
              error={errors.postal_code}
            />

            <FormField
              label="Country"
              name="country"
              type="text"
              placeholder="Enter country"
              required
              register={register}
              error={errors.country}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField
              label="Latitude"
              name="latitude"
              type="number"
              min={-90}
              max={90}
              step={0.000001}
              register={register}
              error={errors.latitude}
            />

            <FormField
              label="Longitude"
              name="longitude"
              type="number"
              min={-180}
              max={180}
              step={0.000001}
              register={register}
              error={errors.longitude}
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Amenities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {amenitiesList.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center space-x-2 cursor-pointer"
              >
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <ErrorMessage error={errors.amenities as any} />
          )}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Form
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !isValid || !isDirty}
            className="px-6 py-2 bg-primary-blue text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              'List Property'
            )}
          </button>
        </div>

        {/* Form Status */}
        <div className="text-sm text-gray-600">
          <p>Form Status: {isDirty ? 'Modified' : 'Unchanged'}</p>
          <p>Validation: {isValid ? 'Valid' : 'Invalid'}</p>
          {Object.keys(errors).length > 0 && (
            <p className="text-red-600">
              Errors: {Object.keys(errors).length} field(s) have errors
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
