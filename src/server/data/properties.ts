import { searchProperties } from '@/repositories/propertyRepo';

interface PropertyFilters {
  mode: 'rent' | 'buy';
  type?: string;
  city?: string;
  district?: string;
  price_min?: number;
  price_max?: number;
  beds_min?: number;
  sort: 'recent' | 'price_asc' | 'price_desc';
  page: number;
  per: number;
  recent_days?: number;
}

export async function getProperties(filters: PropertyFilters) {
  return await searchProperties(filters);
}
