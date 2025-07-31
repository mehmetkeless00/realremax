import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Filtre parametrelerini al
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const bedrooms = searchParams.get('bedrooms');
    const bathrooms = searchParams.get('bathrooms');
    const sizeMin = searchParams.get('sizeMin');
    const sizeMax = searchParams.get('sizeMax');
    const status = searchParams.get('status');
    const yearBuilt = searchParams.get('yearBuilt');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Supabase client
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    // Sorgu oluştur
    let query = supabase.from('properties').select('*', { count: 'exact' });

    if (priceMin) query = query.gte('price', priceMin);
    if (priceMax) query = query.lte('price', priceMax);
    if (location) query = query.ilike('location', `%${location}%`);
    if (type) query = query.eq('type', type);
    if (bedrooms) query = query.gte('bedrooms', bedrooms);
    if (bathrooms) query = query.gte('bathrooms', bathrooms);
    if (sizeMin) query = query.gte('size', sizeMin);
    if (sizeMax) query = query.lte('size', sizeMax);
    if (status) query = query.eq('status', status);
    if (yearBuilt) query = query.gte('year_built', yearBuilt);

    // Note: Amenities filtering would require a separate amenities table
    // For now, we'll skip amenities filtering in the API

    // Sayfalama
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Sorguyu çalıştır
    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
