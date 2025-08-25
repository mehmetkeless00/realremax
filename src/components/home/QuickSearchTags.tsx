import Link from 'next/link';

const quickTags = [
  'Condo/Apartment',
  'House',
  'Land',
  'Store',
  'Office',
  'Warehouse',
] as const;

export default function QuickSearchTags() {
  return (
    <div>
      <h3 className="text-xl md:text-2xl font-bold text-fg mb-4">
        Most common searches
      </h3>
      <div className="flex flex-wrap gap-3">
        {quickTags.map((t) => (
          <Link
            key={t}
            href={`/properties?type=${encodeURIComponent(t)}`}
            className="rounded-full border px-4 py-2 text-sm hover:border-primary hover:text-primary"
          >
            {t}
          </Link>
        ))}
      </div>
    </div>
  );
}
