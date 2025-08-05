'use client';

import React from 'react';
import { ValidatedPropertyForm } from '@/components/forms/ValidatedPropertyForm';
import { PropertyInput } from '@/lib/validation/propertySchema';

export default function FormValidationDemoPage() {
  const handleSubmit = async (data: PropertyInput) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log('Form submitted with data:', data);
    
    // Simulate success
    return Promise.resolve();
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Form Validation Demo
            </h1>
            <p className="text-gray-600">
              This page demonstrates the Zod + React Hook Form validation system with comprehensive form validation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <ValidatedPropertyForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                submitLabel="Create Property"
                cancelLabel="Cancel"
              />
            </div>

            {/* Documentation */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Features Demonstrated
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Zod schema validation
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Real-time validation
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Inline error messages
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    TypeScript integration
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Character counting
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Form state management
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Loading states
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Accessibility features
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Validation Rules
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <strong>Title:</strong> 3-100 characters, required
                  </div>
                  <div>
                    <strong>Price:</strong> Greater than 0, required
                  </div>
                  <div>
                    <strong>Location:</strong> 2-100 characters, required
                  </div>
                  <div>
                    <strong>Description:</strong> 10-1000 characters, optional
                  </div>
                  <div>
                    <strong>Bedrooms/Bathrooms:</strong> 0-20, optional
                  </div>
                  <div>
                    <strong>Size:</strong> 1-10,000 sq ft, optional
                  </div>
                  <div>
                    <strong>Year Built:</strong> 1900-current year, optional
                  </div>
                  <div>
                    <strong>Postal Code:</strong> Valid format, optional
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Try These Tests
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <strong>Empty Form:</strong> Submit without filling required fields
                  </div>
                  <div>
                    <strong>Invalid Price:</strong> Enter 0 or negative numbers
                  </div>
                  <div>
                    <strong>Short Title:</strong> Enter less than 3 characters
                  </div>
                  <div>
                    <strong>Invalid Email:</strong> Test email validation
                  </div>
                  <div>
                    <strong>Future Year:</strong> Enter year after current year
                  </div>
                  <div>
                    <strong>Character Limits:</strong> Test max length validations
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 