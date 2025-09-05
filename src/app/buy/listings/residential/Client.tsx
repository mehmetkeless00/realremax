'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { stringifyFilters, parseSearchParams } from './query';
import { FilterState, PropertyItem, Sort } from './schema';
import Filters from './Filters';
import List from './List';
import MapView from './Map';

type Initial = {
  items: PropertyItem[];
  total: number;
  page: number;
  pageSize: number;
};

export default function Client({ initial }: { initial: Initial }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const {
    filters: initialFilters,
    sort: initialSort,
    page: initialPage,
  } = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _sp = new URLSearchParams(sp as any);
    return parseSearchParams(_sp);
  }, [sp]);

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<Sort>(initialSort);
  const [page, setPage] = useState<number>(initialPage);
  const [view, setView] = useState<'list' | 'map'>('list');

  const [items, setItems] = useState<PropertyItem[]>(initial.items);
  const [total, setTotal] = useState<number>(initial.total);
  const pageSize = initial.pageSize || 24;
  const [loading, setLoading] = useState(false);
  const [, setActiveId] = useState<string | null>(null);

  // Keep URL in sync when local state changes
  useEffect(() => {
    const qs = stringifyFilters(filters, sort, page);
    router.replace(`${pathname}${qs}`, { scroll: false });
  }, [filters, sort, page, pathname, router]);

  // Refetch on URL changes
  useEffect(() => {
    const abort = new AbortController();
    const qs = stringifyFilters(filters, sort, page);
    setLoading(true);
    fetch(`/api/listings${qs}`, { signal: abort.signal })
      .then((r) => r.json())
      .then((json) => {
        setItems(json.items);
        setTotal(json.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => abort.abort();
  }, [filters, sort, page]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setFilter = (k: keyof FilterState, v: any) => {
    setPage(1);
    setFilters((prev) => {
      const copy = { ...prev };
      if (v == null || v === '' || (Array.isArray(v) && v.length === 0))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (copy as any)[k];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      else (copy as any)[k] = v;
      return copy;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Buy Residential Properties</h1>
          <p className="text-gray-600 mt-1">
            <span>{total.toLocaleString()}</span> listings for sale
          </p>
        </div>

        <div className="flex items-center gap-4">
          <select
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value as Sort);
            }}
          >
            <option value="relevance">Most Relevant</option>
            <option value="date_desc">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="area_desc">Largest Area</option>
          </select>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              className={`px-3 py-1 text-sm rounded-md ${
                view === 'list' ? 'bg-white shadow-sm' : ''
              }`}
              onClick={() => setView('list')}
            >
              List
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${
                view === 'map' ? 'bg-white shadow-sm' : ''
              }`}
              onClick={() => setView('map')}
            >
              Map
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className="w-80 bg-white rounded-lg shadow-sm h-fit sticky top-6 hidden md:block">
          <Filters
            filters={filters}
            setFilter={setFilter}
            clearAll={() => {
              setFilters({});
              setPage(1);
            }}
          />
        </aside>

        <div className="flex-1">
          {view === 'list' ? (
            <List
              items={items}
              loading={loading}
              page={page}
              pageSize={pageSize}
              total={total}
              onPage={setPage}
              onHover={setActiveId}
            />
          ) : (
            <MapView
              items={items}
              onHover={setActiveId}
              onSearchInArea={(bbox) => setFilter('loc_bbox', bbox)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
