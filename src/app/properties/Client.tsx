'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Initial = { items: any[]; total: number; page: number; pageSize: number };

export default function Client({ initial }: { initial: Initial }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // URL -> state
  const derived = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const urlsp = new URLSearchParams(sp as any);
    const sort = (urlsp.get('sort') ?? 'relevance') as
      | 'relevance'
      | 'date_desc'
      | 'price_asc'
      | 'price_desc'
      | 'area_desc';
    const page = Math.max(1, parseInt(urlsp.get('page') || '1'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: Record<string, any> = {};
    urlsp.forEach((v, k) => {
      if (['sort', 'page'].includes(k)) return;
      if (['type', 'features', 'energy'].includes(k))
        filters[k] = v.split(',').filter(Boolean);
      else if (
        [
          'price_min',
          'price_max',
          'beds_min',
          'baths_min',
          'area_min',
          'area_max',
          'published',
        ].includes(k)
      )
        filters[k] = Number(v);
      else if (
        [
          'price_reduced',
          'virtual_tour',
          'exclusive',
          'open_house',
          'new_to_market',
        ].includes(k)
      )
        filters[k] = v === 'true';
      else filters[k] = v;
    });
    return { sort, page, filters };
  }, [sp]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [filters, setFilters] = useState<Record<string, any>>(derived.filters);
  const [sort, setSort] = useState(derived.sort);
  const [page, setPage] = useState(derived.page);

  const [items, setItems] = useState(initial.items);
  const [total, setTotal] = useState(initial.total);
  const pageSize = initial.pageSize || 24;
  const [loading, setLoading] = useState(false);

  // state -> URL
  useEffect(() => {
    const urlsp = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) return;
      urlsp.set(k, Array.isArray(v) ? v.join(',') : String(v));
    });
    if (sort !== 'relevance') urlsp.set('sort', sort);
    if (page > 1) urlsp.set('page', String(page));
    router.replace(
      `${pathname}${urlsp.toString() ? `?${urlsp.toString()}` : ''}`,
      { scroll: false }
    );
  }, [filters, sort, page, pathname, router]);

  // fetch when state changes
  useEffect(() => {
    const urlsp = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) return;
      urlsp.set(k, Array.isArray(v) ? v.join(',') : String(v));
    });
    if (sort !== 'relevance') urlsp.set('sort', sort);
    if (page > 1) urlsp.set('page', String(page));
    const qs = urlsp.toString();

    const ctrl = new AbortController();
    setLoading(true);
    fetch(`/api/listings${qs ? `?${qs}` : ''}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((json) => {
        setItems(json.items || []);
        setTotal(json.total || 0);
      })
      .catch((err) => console.error(' listings fetch error:', err))
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [filters, sort, page]);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Properties</h1>
        <div className="flex items-center gap-2">
          <select
            className="border rounded px-2 py-1"
            value={sort}
            onChange={(e) => {
              setPage(1);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setSort(e.target.value as any);
            }}
          >
            <option value="relevance">Most Relevant</option>
            <option value="date_desc">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="area_desc">Largest Area</option>
          </select>
        </div>
      </div>

      {/* Quick example control to prove URL sync works */}
      <div className="mb-4 flex gap-2">
        {[
          'apartment',
          'house',
          'villa',
          'studio',
          'duplex',
          'commercial',
          'other',
        ].map((t) => {
          const arr = filters.type ?? [];
          const active = arr.includes(t);
          return (
            <button
              key={t}
              className={`px-3 py-1 border rounded-full text-sm ${
                active ? 'bg-blue-600 text-white border-blue-600' : ''
              }`}
              onClick={() => {
                const next = active
                  ? arr.filter((x: string) => x !== t)
                  : [...arr, t];
                setPage(1);
                setFilters((f) => ({ ...f, type: next }));
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <>
          <div className="text-gray-600 mb-2">
            {total.toLocaleString()} results
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {items.map((it: any) => (
              <div
                key={it.id}
                className="bg-white rounded shadow overflow-hidden"
              >
                <div className="h-44 bg-gray-200">
                  {it.images?.[0] && (
                    <img
                      className="w-full h-44 object-cover"
                      src={it.images[0]}
                      alt={it.title}
                    />
                  )}
                </div>
                <div className="p-3">
                  <div className="font-semibold">{it.title}</div>
                  <div className="text-sm text-gray-600">
                    {[it.location?.parish, it.location?.district]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                  <div className="text-blue-600 font-bold text-lg mt-1">
                    {new Intl.NumberFormat('en-EN', {
                      style: 'currency',
                      currency: 'EUR',
                      maximumFractionDigits: 0,
                    }).format(it.price_eur || 0)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {it.beds ?? 0} bd · {it.baths ?? 0} ba · {it.area_m2 ?? 0}{' '}
                    m²
                  </div>
                </div>
              </div>
            ))}
          </div>

          {Math.ceil(total / pageSize) > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="px-3 py-1 border rounded"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                &lt;
              </button>
              <span className="text-sm">
                Page {page} / {Math.max(1, Math.ceil(total / pageSize))}
              </span>
              <button
                className="px-3 py-1 border rounded"
                disabled={page >= Math.ceil(total / pageSize)}
                onClick={() => setPage((p) => p + 1)}
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
