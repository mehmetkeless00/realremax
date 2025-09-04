// src/app/buy/listings/residential/query.ts
import { FilterState, Sort } from './schema';

const ARRAY_KEYS = new Set(['type', 'features', 'energy']);
const BOOL_KEYS = new Set([
  'price_reduced',
  'virtual_tour',
  'exclusive',
  'open_house',
  'new_to_market',
]);

export function parseSearchParams(sp: URLSearchParams): {
  filters: FilterState;
  sort: Sort;
  page: number;
} {
  const filters: FilterState = {};
  let sort: Sort = 'relevance';
  let page = 1;

  sp.forEach((v, k) => {
    if (k === 'sort') sort = (v as Sort) || 'relevance';
    else if (k === 'page') page = Math.max(1, parseInt(v) || 1);
    else if (ARRAY_KEYS.has(k))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (filters as any)[k] = v
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    else if (BOOL_KEYS.has(k))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (filters as any)[k] = v === 'true';
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (filters as any)[k] = Number(v);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    else (filters as any)[k] = v;
  });

  return { filters, sort, page };
}

export function stringifyFilters(f: FilterState, sort: Sort, page: number) {
  const sp = new URLSearchParams();

  Object.entries(f).forEach(([k, v]) => {
    if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) return;
    if (Array.isArray(v)) sp.set(k, v.join(','));
    else sp.set(k, String(v));
  });

  if (sort !== 'relevance') sp.set('sort', sort);
  if (page > 1) sp.set('page', String(page));

  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}
