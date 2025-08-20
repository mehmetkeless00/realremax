import { formatEnergyRating } from '@/lib/format';
import { factIcons } from '@/components/icons/amenity-icons';

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
  grossArea,
  yearBuilt,
  energyRating,
}: FactsProps) {
  const rows = [
    { key: 'type', label: 'Type', value: type },
    { key: 'bedrooms', label: 'Bedrooms', value: bedrooms },
    { key: 'bathrooms', label: 'Bathrooms', value: bathrooms },
    {
      key: 'area',
      label: 'Net m²',
      value: netArea ? `${netArea} m²` : undefined,
    },
    {
      key: 'grossArea',
      label: 'Gross m²',
      value: grossArea ? `${grossArea} m²` : undefined,
    },
    {
      key: 'yearBuilt',
      label: 'Year Built',
      value: yearBuilt ? `${yearBuilt}` : undefined,
    },
    {
      key: 'energy',
      label: 'Energy',
      value: energyRating ? formatEnergyRating(energyRating) : undefined,
    },
  ].filter((r) => r.value !== undefined && r.value !== null && r.value !== '');

  if (rows.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white border shadow-sm p-6">
      <h3 className="text-lg font-semibold text-fg mb-4">Key Facts</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {rows.map((r) => {
          const Icon =
            (
              factIcons as Record<
                string,
                React.ComponentType<{ className?: string }>
              >
            )[r.key] || factIcons.type;
          return (
            <div key={r.key} className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">{r.label}</div>
                <div className="text-sm font-medium">{r.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
