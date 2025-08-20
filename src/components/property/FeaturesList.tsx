import { iconForAmenity } from '@/components/icons/amenity-icons';

type FeaturesListProps = {
  amenities: string[];
};

export default function FeaturesList({ amenities }: FeaturesListProps) {
  if (!amenities.length) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-fg mb-4">
        Features & Amenities
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {amenities.map((amenity) => {
          const Icon = iconForAmenity(amenity);
          return (
            <div key={amenity} className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary shrink-0" />
              <span className="text-fg">{amenity}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
