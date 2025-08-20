import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Return demo data for now
    const demoProperties = [
      {
        id: '1',
        title: 'Modern Apartment in City Center',
        description: 'Beautiful 2-bedroom apartment with modern amenities',
        price: 250000,
        location: 'Istanbul, Turkey',
        type: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        size: 120,
        year_built: 2020,
        status: 'active',
        listing_type: 'sale',
        amenities: ['Parking', 'Gym', 'Pool'],
        address: '123 Main Street',
        city: 'Istanbul',
        postal_code: '34000',
        country: 'Turkey',
        latitude: 41.0082,
        longitude: 28.9784,
        created_at: '2024-01-15T10:00:00Z',
        agent_id: 'demo-agent-1',
      },
      {
        id: '2',
        title: 'Luxury Villa with Garden',
        description: 'Spacious 4-bedroom villa with private garden',
        price: 850000,
        location: 'Antalya, Turkey',
        type: 'villa',
        bedrooms: 4,
        bathrooms: 3,
        size: 280,
        year_built: 2018,
        status: 'active',
        listing_type: 'sale',
        amenities: ['Garden', 'Pool', 'Security'],
        address: '456 Villa Road',
        city: 'Antalya',
        postal_code: '07000',
        country: 'Turkey',
        latitude: 36.8969,
        longitude: 30.7133,
        created_at: '2024-01-10T14:30:00Z',
        agent_id: 'demo-agent-1',
      },
      {
        id: '3',
        title: 'Cozy Studio for Rent',
        description: 'Perfect studio apartment for young professionals',
        price: 2500,
        location: 'Ankara, Turkey',
        type: 'studio',
        bedrooms: 1,
        bathrooms: 1,
        size: 45,
        year_built: 2022,
        status: 'active',
        listing_type: 'rent',
        amenities: ['Furnished', 'Internet', 'Utilities included'],
        address: '789 Studio Lane',
        city: 'Ankara',
        postal_code: '06000',
        country: 'Turkey',
        latitude: 39.9334,
        longitude: 32.8597,
        created_at: '2024-01-05T09:15:00Z',
        agent_id: 'demo-agent-1',
      },
    ];

    return NextResponse.json(demoProperties);
  } catch (error) {
    console.error('Listings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Next.js cookies API'si için await kullan
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  // Kullanıcıyı al
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== 'agent') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // İstekten property verilerini al
  const {
    title,
    description,
    price,
    location,
    type,
    bedrooms,
    bathrooms,
    size,
    year_built,
    status,
    listing_type,
    amenities,
    address,
    city,
    postal_code,
    country,
    latitude,
    longitude,
    photos,
  } = await request.json();

  // Basit validasyon
  if (!title || !price || !location || !type) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Property ekle
  const { data, error } = await supabase
    .from('properties')
    .insert([
      {
        title,
        description,
        price,
        location,
        type,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseFloat(bathrooms) : null,
        size: size ? parseInt(size) : null,
        year_built: year_built ? parseInt(year_built) : null,
        status: status || 'active',
        listing_type: listing_type || 'sale',
        amenities: amenities || [],
        address: address || '',
        city: city || '',
        postal_code: postal_code || '',
        country: country || 'Turkey',
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        photos: photos || [],
        agent_id: user.id,
      },
    ])
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== 'agent') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id, ...updateData } = await request.json();
  if (!id) {
    return NextResponse.json(
      { error: 'Property ID is required' },
      { status: 400 }
    );
  }

  // Property'nin agent'a ait olduğunu kontrol et
  const { data: existingProperty } = await supabase
    .from('properties')
    .select('agent_id')
    .eq('id', id)
    .single();

  if (!existingProperty || existingProperty.agent_id !== user.id) {
    return NextResponse.json(
      { error: 'Property not found or unauthorized' },
      { status: 404 }
    );
  }

  // Data type conversions
  const processedData = {
    ...updateData,
    bedrooms: updateData.bedrooms ? parseInt(updateData.bedrooms) : null,
    bathrooms: updateData.bathrooms ? parseFloat(updateData.bathrooms) : null,
    size: updateData.size ? parseInt(updateData.size) : null,
    year_built: updateData.year_built ? parseInt(updateData.year_built) : null,
    latitude: updateData.latitude ? parseFloat(updateData.latitude) : null,
    longitude: updateData.longitude ? parseFloat(updateData.longitude) : null,
    photos: updateData.photos || [],
  };

  // Property'yi güncelle
  const { data, error } = await supabase
    .from('properties')
    .update(processedData)
    .eq('id', id)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== 'agent') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Property ID is required' },
      { status: 400 }
    );
  }

  // Property'nin agent'a ait olduğunu kontrol et
  const { data: existingProperty } = await supabase
    .from('properties')
    .select('agent_id')
    .eq('id', id)
    .single();

  if (!existingProperty || existingProperty.agent_id !== user.id) {
    return NextResponse.json(
      { error: 'Property not found or unauthorized' },
      { status: 404 }
    );
  }

  // Property'yi sil
  const { error } = await supabase.from('properties').delete().eq('id', id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: 'Property deleted successfully' });
}
