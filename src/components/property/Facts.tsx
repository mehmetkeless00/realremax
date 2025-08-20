import { formatArea, formatEnergyRating } from '@/lib/format';

type FactsProps = {
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  netArea?: number;
  grossArea?: number;
  yearBuilt?: number;
  energyRating?: string;
};

export default function Facts({
  type,
  bedrooms,
  bathrooms,
  netArea,

  energyRating,
}: FactsProps) {
  const facts = [
    { label: 'Type', value: type },
    { label: 'Bedrooms', value: bedrooms ? `${bedrooms}` : 'N/A' },
    { label: 'Bathrooms', value: bathrooms ? `${bathrooms}` : 'N/A' },
    { label: 'Net m²', value: netArea ? formatArea(netArea) : 'N/A' },
    {
      label: 'Energy rating',
      value: energyRating ? formatEnergyRating(energyRating) : 'N/A',
    },
  ];

  return (
    <div className="rounded-2xl bg-white border shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-fg mb-4">Key Facts</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {facts.map((fact) => (
          <div key={fact.label} className="text-center">
            <div className="text-sm text-muted-foreground mb-1">
              {fact.label}
            </div>
            <div className="font-medium text-fg">{fact.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
