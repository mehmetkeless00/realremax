import { supabase } from '@/lib/supabase';
import { PROPERTIES, Property } from '@/data/mock-properties';

export type SearchFilters = {
  mode: 'buy' | 'rent';
  type?: string;
  city?: string;
  district?: string;
  price_min?: number;
  price_max?: number;
  beds_min?: number;
  sort?: 'recent' | 'price_asc' | 'price_desc';
  page?: number;
  per?: number;
  recent_days?: number;
};

// Add environment variable support for forcing mock data
const useMock = process.env.NEXT_PUBLIC_USE_MOCK_LISTINGS === 'true';

export async function searchProperties(f: SearchFilters) {
  // Force mock if environment variable is set
  if (useMock) {
    console.log('Using mock data (NEXT_PUBLIC_USE_MOCK_LISTINGS=true)');
    return searchPropertiesMock(f);
  }

  const per = f.per ?? 12;
  const page = f.page ?? 1;
  const offset = (page - 1) * per;

  try {
    // Try Supabase first
    let query = supabase.from('properties').select('*', { count: 'exact' });

    // Apply filters
    if (f.mode) {
      // Tolerate 'sale' vs 'buy' differences
      if (f.mode === 'buy') {
        query = query.in('listing_type', ['buy', 'sale']);
      } else {
        query = query.eq('listing_type', f.mode);
      }
    }
    if (f.type) {
      query = query.eq('type', f.type);
    }
    if (f.city) {
      query = query.ilike('city', `%${f.city}%`);
    }
    if (f.district) {
      query = query.ilike('location', `%${f.district}%`);
    }
    if (f.price_min !== undefined) {
      query = query.gte('price', f.price_min);
    }
    if (f.price_max !== undefined) {
      query = query.lte('price', f.price_max);
    }
    if (f.beds_min !== undefined) {
      query = query.gte('bedrooms', f.beds_min);
    }
    if (f.recent_days !== undefined) {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - f.recent_days);
      query = query.gte('created_at', recentDate.toISOString());
    }

    // Apply sorting
    switch (f.sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'recent':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    // Apply pagination
    query = query.range(offset, offset + per - 1);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Fallback if no data returned (empty table, RLS blocking, or no matches)
    if (!data || (Array.isArray(data) && data.length === 0) || !count) {
      console.warn('Supabase returned 0 rows; falling back to mock data');
      return searchPropertiesMock(f);
    }

    // Transform Supabase data to match our Property type
    const items =
      data?.map((item) => ({
        id: item.id,
        slug: `${item.type}-${item.city?.toLowerCase()}-${item.id}`,
        title: item.title,
        type: item.type as Property['type'],
        operation: item.listing_type as Property['operation'],
        price: item.price,
        currency: 'EUR' as const,
        location: {
          address: item.address || '',
          city: item.city || '',
          district: item.location || '',
          lat: item.latitude || undefined,
          lng: item.longitude || undefined,
        },
        bedrooms: item.bedrooms || undefined,
        bathrooms: item.bathrooms || undefined,
        netArea: item.size || undefined,
        yearBuilt: item.year_built || undefined,
        description: item.description || '',
        amenities: item.amenities || [],
        images: (item.photos || []).map((src: string) => ({ src, alt: '' })),
        agent: { name: 'Agent', email: '', phone: '' }, // Placeholder
        tags: [],
      })) || [];

    return { items, count: count || 0 };
  } catch (error) {
    console.warn('Supabase query failed, falling back to mock data:', error);

    // Fallback to mock data
    return searchPropertiesMock(f);
  }
}

function searchPropertiesMock(f: SearchFilters) {
  const per = f.per ?? 12;
  const page = f.page ?? 1;
  const offset = (page - 1) * per;

  // Filter mock properties
  const filtered = PROPERTIES.filter((property) => {
    // Mode filter
    if (property.operation !== f.mode) return false;

    // Type filter
    if (f.type && property.type !== f.type) return false;

    // City filter
    if (
      f.city &&
      !property.location.city.toLowerCase().includes(f.city.toLowerCase())
    )
      return false;

    // District filter
    if (
      f.district &&
      !property.location.district
        ?.toLowerCase()
        .includes(f.district.toLowerCase())
    )
      return false;

    // Price filters
    if (f.price_min !== undefined && property.price < f.price_min) return false;
    if (f.price_max !== undefined && property.price > f.price_max) return false;

    // Bedrooms filter
    if (f.beds_min !== undefined && (property.bedrooms || 0) < f.beds_min)
      return false;

    return true;
  });

  // Sort
  switch (f.sort) {
    case 'price_asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'recent':
    default:
      // Mock data doesn't have timestamps, so keep original order
      break;
  }

  // Paginate
  const items = filtered.slice(offset, offset + per);
  const count = filtered.length;

  return { items, count };
}
