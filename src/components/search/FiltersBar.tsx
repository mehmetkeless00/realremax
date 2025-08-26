'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { SearchFilters } from '@/repositories/propertyRepo';

type Props = { initialFilters: SearchFilters };

export default function FiltersBar({ initialFilters }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [type, setType] = useState<string | undefined>(initialFilters.type);
  const [location, setLocation] = useState<string>('');
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

  const hydratedOnceRef = useRef(false); // avoid double-apply in StrictMode

  function apply(next: Record<string, string | number | undefined>) {
    const q = new URLSearchParams(searchParams?.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === '' || v === null) q.delete(k);
      else q.set(k, String(v));
    });
    // reset page when filters change
    q.delete('page');
    router.push(`${pathname}?${q.toString()}`);
  }

  const applyLocationFilter = (loc: string) => {
    // REUSE existing logic here:
    apply({ location: loc });
  };

  const updateUrlParam = (loc: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (loc) params.set('region', loc);
    else params.delete('region');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const commitLocation = (loc: string) => {
    applyLocationFilter(loc);
    updateUrlParam(loc);
  };

  // Hydrate Location from URL on mount / when query changes
  useEffect(() => {
    if (hydratedOnceRef.current) return;
    const fromUrl =
      searchParams.get('region') ?? searchParams.get('location') ?? '';
    if (fromUrl && fromUrl !== location) {
      setLocation(fromUrl);
      commitLocation(fromUrl);
      hydratedOnceRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
            placeholder="Location"
            className="rounded-full border px-3 py-2 text-sm"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onBlur={() => commitLocation(location)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitLocation(location);
            }}
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
              commitLocation('');
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
