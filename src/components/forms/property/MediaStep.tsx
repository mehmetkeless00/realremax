'use client';

import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import PhotoUpload from '@/components/PhotoUpload';

interface MediaStepProps {
  onBack: () => void;
  onSubmit: () => void;
  loading?: boolean;
}

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
  'Internet',
  'Cable TV',
  'Dishwasher',
  'Washing Machine',
  'Central Heating',
];

export default function MediaStep({
  onBack,
  onSubmit,
  loading = false,
}: MediaStepProps) {
  const form = useFormContext();

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Amenities & Media
        </h3>
        <p className="text-sm text-gray-600">
          Select property amenities and upload photos.
        </p>
      </div>

      {/* Amenities */}
      <div>
        <FormLabel className="text-base font-medium">Amenities</FormLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
          {AMENITIES.map((amenity) => (
            <FormField
              key={amenity}
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(amenity)}
                      onCheckedChange={(checked) => {
                        const currentAmenities = field.value || [];
                        if (checked) {
                          field.onChange([...currentAmenities, amenity]);
                        } else {
                          field.onChange(
                            currentAmenities.filter(
                              (a: string) => a !== amenity
                            )
                          );
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    {amenity}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormMessage />
      </div>

      {/* Photo Upload */}
      <div>
        <FormField
          control={form.control}
          name="photos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Photos</FormLabel>
              <FormControl>
                <PhotoUpload
                  value={field.value}
                  onChange={field.onChange}
                  onRemove={(url) => {
                    const filteredPhotos =
                      field.value?.filter((photo: string) => photo !== url) ||
                      [];
                    field.onChange(filteredPhotos);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Save Property'}
        </Button>
      </div>
    </div>
  );
}
