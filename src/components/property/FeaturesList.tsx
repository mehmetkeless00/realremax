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
        {amenities.map((amenity) => (
          <div key={amenity} className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-fg">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
