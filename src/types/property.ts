import type { Database } from '@/lib/supabase';

// Base property types from database
export type Property = Database['public']['Tables']['properties']['Row'];
export type PropertyInsert =
  Database['public']['Tables']['properties']['Insert'];
export type PropertyUpdate =
  Database['public']['Tables']['properties']['Update'];

export type Listing = Database['public']['Tables']['listings']['Row'];
export type ListingInsert = Database['public']['Tables']['listings']['Insert'];
export type ListingUpdate = Database['public']['Tables']['listings']['Update'];

// Extended property type for UI with additional fields
export interface PropertyWithListing extends Property {
  listing?: Listing;
  agent?: {
    id: string;
    name: string;
    company: string;
    phone: string;
  };
  isFavorite?: boolean;
}

// Property card view types
export type PropertyCardView = 'grid' | 'list';

// Property card props
export interface PropertyCardProps {
  property: PropertyWithListing;
  view?: PropertyCardView;
  showFavorite?: boolean;
  onFavoriteToggle?: (propertyId: string, isFavorite: boolean) => void;
  className?: string;
}

// Property filters
export interface PropertyFilters {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  location?: string;
  listingType?: 'sale' | 'rent';
  status?: string;
}

// Property sort options
export interface PropertySort {
  field: 'price' | 'created_at' | 'bedrooms' | 'bathrooms' | 'size';
  direction: 'asc' | 'desc';
}

// Inquiry types
export interface Inquiry {
  id: string;
  property_id: string;
  agent_id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'pending' | 'contacted' | 'closed';
  created_at: string;
  updated_at: string;
  properties: {
    id: string;
    title: string;
    location: string;
  };
  agents: {
    id: string;
    name: string;
    email: string;
  };
  users: {
    id: string;
    email: string;
  };
}

export interface InquiryForm {
  propertyId: string;
  agentId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}
