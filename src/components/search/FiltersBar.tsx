'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import type { SearchFilters } from '@/repositories/propertyRepo';

type Props = { initialFilters: SearchFilters };

export default function FiltersBar({ initialFilters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [type, setType] = useState<string | undefined>(initialFilters.type);
  const [location, setLocation] = useState<string>(
    initialFilters.location ?? ''
  );
  const [priceMin, setPriceMin] = useState<string>(
    initialFilters.minPrice?.toString() ?? ''
  );
  const [priceMax, setPriceMax] = useState<string>(
    initialFilters.maxPrice?.toString() ?? ''
  );
  const [bedrooms, setBedrooms] = useState<string>(
    initialFilters.bedrooms?.toString() ?? ''
  );
  const [bathrooms, setBathrooms] = useState<string>(
    initialFilters.bathrooms?.toString() ?? ''
  );

  function apply(next: Record<string, string | number | undefined>) {
    const q = new URLSearchParams(params?.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === '' || v === null) q.delete(k);
      else q.set(k, String(v));
    });
    // reset page when filters change
    q.delete('page');
    router.push(`${pathname}?${q.toString()}`);
  }

  return (
    <div className="sticky top-16 z-10 bg-white/70 backdrop-blur border-b border-b-gray-200 py-3">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {/* Type */}
          <select
            value={type ?? ''}
            onChange={(e) => {
              const v = e.target.value || undefined;
              setType(v);
              apply({ type: v });
            }}
            className="rounded-full border px-3 py-2 text-sm"
          >
            <option value="">Type</option>
            <option value="apartment">Residential / Apartment</option>
            <option value="house">House</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
            <option value="other">Other</option>
          </select>

          {/* Location */}
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onBlur={() => apply({ location })}
            placeholder="Location"
            className="rounded-full border px-3 py-2 text-sm"
          />

          {/* Price */}
          <input
            inputMode="numeric"
            placeholder="Min €"
            className="w-24 rounded-full border px-3 py-2 text-sm"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            onBlur={() =>
              apply({ minPrice: priceMin ? Number(priceMin) : undefined })
            }
          />
          <input
            inputMode="numeric"
            placeholder="Max €"
            className="w-24 rounded-full border px-3 py-2 text-sm"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            onBlur={() =>
              apply({ maxPrice: priceMax ? Number(priceMax) : undefined })
            }
          />

          {/* Bedrooms */}
          <select
            value={bedrooms}
            onChange={(e) => {
              const v = e.target.value || '';
              setBedrooms(v);
              apply({ bedrooms: v ? Number(v) : undefined });
            }}
            className="rounded-full border px-3 py-2 text-sm"
          >
            <option value="">Beds</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>

          {/* Bathrooms */}
          <select
            value={bathrooms}
            onChange={(e) => {
              const v = e.target.value || '';
              setBathrooms(v);
              apply({ bathrooms: v ? Number(v) : undefined });
            }}
            className="rounded-full border px-3 py-2 text-sm"
          >
            <option value="">Baths</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>

          {/* Clear filters */}
          <button
            onClick={() => {
              setType(undefined);
              setLocation('');
              setPriceMin('');
              setPriceMax('');
              setBedrooms('');
              setBathrooms('');
              router.push(pathname);
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
