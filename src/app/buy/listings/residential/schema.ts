// src/app/buy/listings/residential/schema.ts
export type Sort =
  | 'relevance'
  | 'date_desc'
  | 'price_asc'
  | 'price_desc'
  | 'area_desc';

export type FilterState = {
  op?: 'buy' | 'rent';
  type?: string[];
  price_min?: number;
  price_max?: number;
  beds_min?: number;
  baths_min?: number;
  area_min?: number;
  area_max?: number;
  features?: string[];
  energy?: ('A+' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F')[];
  loc?: string; // "city|district" or "district"
  loc_bbox?: string; // "west,south,east,north"
  published?: number; // days
  price_reduced?: boolean;
  virtual_tour?: boolean;
  exclusive?: boolean;
  open_house?: boolean;
  new_to_market?: boolean;
  q?: string;
};

export type PropertyItem = {
  id: string;
  title: string;
  operation: 'buy' | 'rent';
  type: string;
  price_eur: number;
  beds: number;
  baths: number;
  area_m2: number | null;
  energy: string | null;
  features: string[];
  location: {
    country: string;
    district: string;
    city: string;
    parish: string;
  };
  published_at: string | null;
  price_reduced: boolean;
  virtual_tour: boolean;
  exclusive: boolean;
  open_house: boolean;
  new_to_market: boolean;
  images: string[];
  lat?: number | null;
  lng?: number | null;
  slug?: string | null;
};
