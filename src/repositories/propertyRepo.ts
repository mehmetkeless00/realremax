import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Property } from '@/types/property';

export interface SearchFilters {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  location?: string;
  amenities?: string[];
}

export async function searchProperties(
  filters: SearchFilters
): Promise<Property[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters.bedrooms !== undefined) {
      query = query.eq('bedrooms', filters.bedrooms);
    }

    if (filters.bathrooms !== undefined) {
      query = query.eq('bathrooms', filters.bathrooms);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error('Failed to fetch properties');
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Filter by amenities if specified
    let filteredProperties = data;
    if (filters.amenities && filters.amenities.length > 0) {
      filteredProperties = data.filter((property) => {
        if (!property.amenities) return false;
        return filters.amenities!.some((amenity) =>
          property.amenities!.includes(amenity)
        );
      });
    }

    return filteredProperties;
  } catch (error) {
    console.error('Search properties error:', error);
    throw new Error('Failed to search properties');
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Get property by ID error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get property by ID error:', error);
    return null;
  }
}
