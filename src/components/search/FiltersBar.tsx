'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import type { SearchFilters } from '@/repositories/propertyRepo';

type Props = { initialFilters: SearchFilters };

export default function FiltersBar({ initialFilters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [mode, setMode] = useState<'buy' | 'rent'>(initialFilters.mode);
  const [type, setType] = useState<string | undefined>(initialFilters.type);
  const [city, setCity] = useState<string>(initialFilters.city ?? '');
  const [priceMin, setPriceMin] = useState<string>(
    initialFilters.price_min?.toString() ?? ''
  );
  const [priceMax, setPriceMax] = useState<string>(
    initialFilters.price_max?.toString() ?? ''
  );
  const [beds, setBeds] = useState<string>(
    initialFilters.beds_min?.toString() ?? ''
  );
  const [sort, setSort] = useState<string>(initialFilters.sort ?? 'recent');
  const [recentDays, setRecentDays] = useState<string>(
    initialFilters.recent_days?.toString() ?? ''
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
    <div className="sticky top-16 z-10 bg-white/70 backdrop-blur border-b py-3">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode pill */}
          <div className="inline-flex rounded-full border overflow-hidden">
            {(['buy', 'rent'] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  apply({ mode: m });
                }}
                className={`px-4 py-2 text-sm ${mode === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-blue-50'}`}
              >
                {m === 'buy' ? 'Buy' : 'Rent'}
              </button>
            ))}
          </div>

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
            <option value="store">Store</option>
            <option value="office">Office</option>
          </select>

          {/* City */}
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onBlur={() => apply({ city })}
            placeholder="City"
            className="rounded-full border px-3 py-2 text-sm"
          />

          {/* Price */}
          <input
            inputMode="numeric"
            placeholder="Min €"
            className="w-24 rounded-full border px-3 py-2 text-sm"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            onBlur={() => apply({ price_min: priceMin })}
          />
          <input
            inputMode="numeric"
            placeholder="Max €"
            className="w-24 rounded-full border px-3 py-2 text-sm"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            onBlur={() => apply({ price_max: priceMax })}
          />

          {/* Bedrooms */}
          <select
            value={beds}
            onChange={(e) => {
              setBeds(e.target.value);
              apply({ beds_min: e.target.value });
            }}
            className="rounded-full border px-3 py-2 text-sm"
          >
            <option value="">Bedrooms</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>

          {/* Recent days */}
          <select
            value={recentDays}
            onChange={(e) => {
              setRecentDays(e.target.value);
              apply({ recent_days: e.target.value });
            }}
            className="rounded-full border px-3 py-2 text-sm"
          >
            <option value="">Any time</option>
            <option value="7">Published last 7 days</option>
            <option value="30">Published last 30 days</option>
            <option value="90">Published last 90 days</option>
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              apply({ sort: e.target.value });
            }}
            className="ml-auto rounded-full border px-3 py-2 text-sm"
          >
            <option value="recent">Most recent</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
          </select>

          {/* Save search placeholder (non-functional) */}
          {/* <Button disabled variant="secondary" className="rounded-full">Save search</Button> */}
        </div>
      </div>
    </div>
  );
}
