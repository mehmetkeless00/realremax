'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createPropertySchema,
  type CreateProperty,
} from '@/lib/schemas/property';
import { Form } from '@/components/ui/form';
import AddressStep from '@/components/forms/property/AddressStep';
import PriceStep from '@/components/forms/property/PriceStep';
import MediaStep from '@/components/forms/property/MediaStep';
import { useUIStore } from '@/lib/store';

interface PropertyListingFormRefactoredProps {
  property?: CreateProperty;
  onSubmit: (data: CreateProperty) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const STEPS = [
  { id: 1, title: 'Address', component: AddressStep },
  { id: 2, title: 'Details', component: PriceStep },
  { id: 3, title: 'Media', component: MediaStep },
];

export default function PropertyListingFormRefactored({
  property,
  onSubmit,
  onCancel,
  loading = false,
}: PropertyListingFormRefactoredProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { addToast } = useUIStore();

  const form = useForm<CreateProperty>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      title: property?.title || '',
      description: property?.description || '',
      price: property?.price || 0,
      currency: property?.currency || 'EUR',
      type: property?.type || 'apartment',
      operation: property?.operation || 'buy',
      status: property?.status || 'active',
      address: property?.address || '',
      city: property?.city || '',
      district: property?.district || '',
      postal_code: property?.postal_code || '',
      country: property?.country || 'Turkey',
      latitude: property?.latitude,
      longitude: property?.longitude,
      bedrooms: property?.bedrooms,
      bathrooms: property?.bathrooms,
      size: property?.size,
      year_built: property?.year_built,
      energy_rating: property?.energy_rating,
      amenities: property?.amenities || [],
      photos: property?.photos || [],
      agent_id: property?.agent_id,
    },
  });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: CreateProperty) => {
    try {
      await onSubmit(data);
      addToast({
        type: 'success',
        message: 'Property saved successfully!',
      });
    } catch (error) {
      console.error('Submit error:', error);
      addToast({
        type: 'error',
        message: 'Failed to save property. Please try again.',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.id}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          {STEPS.map((step) => (
            <span key={step.id}>{step.title}</span>
          ))}
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {currentStep === 1 && (
            <AddressStep onNext={handleNext} isFirstStep={true} />
          )}

          {currentStep === 2 && (
            <PriceStep onNext={handleNext} onBack={handleBack} />
          )}

          {currentStep === 3 && (
            <MediaStep
              onBack={handleBack}
              onSubmit={() => form.handleSubmit(handleSubmit)()}
              loading={loading}
            />
          )}
        </form>
      </Form>

      {/* Cancel Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
