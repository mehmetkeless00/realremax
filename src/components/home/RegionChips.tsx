import Link from 'next/link';
import { regions } from '@/data/home';

export default function RegionChips() {
  return (
    <div>
      <h3 className="text-xl md:text-2xl font-bold text-fg mb-4">
        Most Searched Regions
      </h3>
      <div className="flex flex-wrap gap-3">
        {regions.map((r) => (
          <Link
            key={r}
            href={`/properties?region=${encodeURIComponent(r)}`}
            className="rounded-full border px-4 py-2 text-sm hover:border-primary hover:text-primary"
          >
            {r}
          </Link>
        ))}
      </div>
    </div>
  );
}
