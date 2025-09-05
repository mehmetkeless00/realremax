import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer();
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = 24;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let q = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .is('deleted_at', null);

  // op -> transaction_type
  const op = searchParams.get('op');
  if (op === 'buy') q = q.in('transaction_type', ['sale']);
  else if (op === 'rent')
    q = q.in('transaction_type', ['rent', 'lease', 'short-term-rent']);

  // type (property_type or fallback type)
  const typeCsv = searchParams.get('type');
  if (typeCsv) {
    const parts = typeCsv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length)
      q = q.or(
        parts.map((p) => `property_type.eq.${p},type.eq.${p}`).join(',')
      );
  }

  // price
  const priceMin = searchParams.get('price_min');
  if (priceMin) q = q.gte('price', Number(priceMin));
  const priceMax = searchParams.get('price_max');
  if (priceMax) q = q.lte('price', Number(priceMax));

  // beds / baths
  const bedsMin = searchParams.get('beds_min');
  if (bedsMin) q = q.gte('bedrooms', Number(bedsMin));
  const bathsMin = searchParams.get('baths_min');
  if (bathsMin) q = q.gte('bathrooms', Number(bathsMin));

  // area (usable_area_m2 or internal_area_sqm)
  const areaMin = searchParams.get('area_min');
  if (areaMin)
    q = q.or(`usable_area_m2.gte.${areaMin},internal_area_sqm.gte.${areaMin}`);
  const areaMax = searchParams.get('area_max');
  if (areaMax)
    q = q.or(`usable_area_m2.lte.${areaMax},internal_area_sqm.lte.${areaMax}`);

  // features[]
  const featuresCsv = searchParams.get('features');
  if (featuresCsv)
    q = q.contains(
      'features',
      featuresCsv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    );

  // energy_class
  const energyCsv = searchParams.get('energy');
  if (energyCsv)
    q = q.in(
      'energy_class',
      energyCsv.split(',').map((s) => s.trim())
    );

  // loc: "city|district" or "district"
  const loc = searchParams.get('loc');
  if (loc) {
    if (loc.includes('|')) {
      const [city, district] = loc.split('|');
      q = q.ilike('city', city).ilike('district', district);
    } else {
      q = q.ilike('district', loc);
    }
  }

  // bbox: west,south,east,north
  const bbox = searchParams.get('loc_bbox');
  if (bbox) {
    const [w, s, e, n] = bbox.split(',').map(Number);
    if ([w, s, e, n].every(Number.isFinite)) {
      q = q.gte('lng', w).lte('lng', e).gte('lat', s).lte('lat', n);
    }
  }

  // published=X days
  const published = searchParams.get('published');
  if (published) {
    const days = Number(published);
    const iso = new Date(Date.now() - days * 86400000).toISOString();
    q = q.gte('published_at', iso);
  }

  // tag flags: price_reduced, virtual_tour, exclusive, open_house, new_to_market
  (
    [
      'price_reduced',
      'virtual_tour',
      'exclusive',
      'open_house',
      'new_to_market',
    ] as const
  ).forEach((flag) => {
    if (searchParams.get(flag) === 'true') q = q.contains('tags', [flag]);
  });

  // q: multi-column ILIKE
  const s = searchParams.get('q');
  if (s) {
    const like = `%${s}%`;
    q = q.or(
      [
        `title.ilike.${like}`,
        `location.ilike.${like}`,
        `full_address.ilike.${like}`,
        `city.ilike.${like}`,
        `district.ilike.${like}`,
        `reference_code.ilike.${like}`,
      ].join(',')
    );
  }

  // sorting
  const sort = searchParams.get('sort') || 'relevance';
  if (sort === 'date_desc') {
    q = q
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false });
  } else if (sort === 'price_asc') {
    q = q.order('price', { ascending: true, nullsFirst: true });
  } else if (sort === 'price_desc') {
    q = q.order('price', { ascending: false });
  } else if (sort === 'area_desc') {
    q = q
      .order('usable_area_m2', { ascending: false, nullsFirst: true })
      .order('internal_area_sqm', { ascending: false, nullsFirst: true });
  } else {
    q = q.order('created_at', { ascending: false });
  }

  const { data, count, error } = await q.range(from, to);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = (data ?? []).map((row: any) => {
    const tags: string[] = row.tags ?? [];
    return {
      id: row.id,
      title: row.title,
      operation: row.transaction_type === 'sale' ? 'buy' : 'rent',
      type: row.property_type ?? row.type ?? 'other',
      price_eur: Number(row.price ?? 0),
      beds: row.bedrooms ?? 0,
      baths: row.bathrooms ?? 0,
      area_m2: row.usable_area_m2 ?? row.internal_area_sqm ?? null,
      energy: row.energy_class ?? null,
      features: row.features ?? [],
      location: {
        country: row.country ?? 'PT',
        district: row.district ?? '',
        city: row.city ?? '',
        parish: row.area ?? '',
      },
      published_at: row.published_at ?? row.created_at ?? null,
      price_reduced: tags.includes('price_reduced'),
      virtual_tour: tags.includes('virtual_tour'),
      exclusive: tags.includes('exclusive'),
      open_house: tags.includes('open_house'),
      new_to_market: tags.includes('new_to_market'),
      images: [row.cover_image_url].filter(Boolean),
      lat: row.lat ?? row.latitude ?? null,
      lng: row.lng ?? row.longitude ?? null,
      slug: row.slug ?? null,
    };
  });

  return NextResponse.json({ items, total: count ?? 0, page, pageSize: limit });
}
