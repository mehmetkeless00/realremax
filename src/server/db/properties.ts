'use server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export interface Property {
  id: string;
  title: string;
  description: string | null;
  price: number;
  location: string;
  type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size: number | null;
  year_built: number | null;
  agent_id: string | null;
  status: 'draft' | 'published' | 'archived';
  listing_type: string;
  amenities: string[] | null;
  photos: string[] | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  slug: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
}

export async function getPropertyBySlug(
  slug: string
): Promise<Property | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getSimilarProperties(
  property: Property,
  limit: number = 3
): Promise<Property[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'published')
    .eq('type', property.type)
    .neq('id', property.id)
    .limit(limit);

  if (error) {
    return [];
  }

  return data || [];
}
