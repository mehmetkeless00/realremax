// src/server/db/properties.ts
'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase';
import {
  PROPERTY_BUCKET,
  toPublicImageUrl,
  normalizeAmenities,
  normalizePhotoArray,
  dedupe,
} from '@/lib/images.shared';

type DB = Database['public']['Tables'];
export type PropertyRow = DB['properties']['Row'];

async function getDBClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
}

/** Storage için SERVICE_ROLE (yalnız server) */
function getAdminStorage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL'
    );
  }
  return createAdminClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'X-Client-Info': 'remax-server' } },
  });
}

async function fetchPropertyImagesRaw(propertyId: string) {
  const supabase = await getDBClient();
  const { data, error } = await supabase
    .from('property_images')
    .select('*')
    .eq('property_id', propertyId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (error && (error as any)?.code !== '42P01') {
    console.warn('property_images error:', error);
  }
  return data ?? [];
}

/** raw (url/path) → bucket içi relatif path adayları */
function makePathCandidates(
  propertyId: string,
  ownerId: string | null,
  raw?: string | null
): string[] {
  if (!raw) return [];
  let p = String(raw);

  // public URL ve bucket öneklerini temizle
  p = p
    .replace(/^https?:\/\/[^/]+\/storage\/v1\/object\/public\/[^/]+\//, '')
    .replace(new RegExp(`^${PROPERTY_BUCKET}\\/`), '')
    .replace(/^public\//, '')
    .replace(/^\/+/, '');

  try {
    p = decodeURIComponent(p);
  } catch {}

  const seg = p.split('/').filter(Boolean);
  const basename = seg.at(-1) ?? '';
  const penultimate = seg.length >= 2 ? seg.at(-2)! : '';

  const out = new Set<string>();
  if (p) out.add(p);
  if (seg.length > 1) out.add(seg.slice(1).join('/'));
  if (seg.length > 2) out.add(seg.slice(2).join('/'));
  if (basename) out.add(basename);
  if (propertyId && basename) out.add(`${propertyId}/${basename}`);
  if (propertyId && penultimate && basename)
    out.add(`${propertyId}/${penultimate}/${basename}`);
  if (ownerId && basename) out.add(`${ownerId}/${basename}`);
  if (ownerId && propertyId && basename)
    out.add(`${ownerId}/${propertyId}/${basename}`);
  if (ownerId && penultimate && basename)
    out.add(`${ownerId}/${penultimate}/${basename}`);

  return Array.from(out);
}

/** Bucket içinde BFS ile klasörleri dolaş; basename eşleşmesi bulunca yol döndür. */
async function findPathByBasename(
  basename: string,
  seeds: string[]
): Promise<string | null> {
  const admin = getAdminStorage();
  const seen = new Set<string>();
  const queue: string[] = [];

  // aynıları at, boş kökü en sona koy
  for (const s of Array.from(new Set(seeds.filter(Boolean)))) queue.push(s);
  queue.push(''); // root da tara

  while (queue.length) {
    const prefix = queue.shift()!;
    if (seen.has(prefix)) continue;
    seen.add(prefix);

    const { data, error } = await admin.storage
      .from(PROPERTY_BUCKET)
      .list(prefix, {
        limit: 1000,
        sortBy: { column: 'updated_at', order: 'desc' },
      });

    if (error) {
      if (process.env.NODE_ENV === 'development')
        console.warn('[img] bfs list FAIL', prefix, error.message);
      continue;
    }

    for (const e of data ?? []) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((e as any).type === 'folder') {
        const next = `${prefix ? prefix.replace(/\/+$/, '') + '/' : ''}${e.name}`;
        queue.push(next);
      } else if (e.name === basename) {
        const full = `${prefix ? prefix.replace(/\/+$/, '') + '/' : ''}${e.name}`;
        return full;
      }
    }
  }
  return null;
}

/** Path adaylarını sırayla dene → SERVICE_ROLE ile signed; olmazsa BFS ile ara; en son public */
async function buildRenderableUrls(
  propertyId: string,
  ownerId: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[]
): Promise<string[]> {
  const admin = getAdminStorage();
  const out: string[] = [];

  const rawPaths: string[] = rows
    .map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (r: any) =>
        r?.storage_path ??
        r?.path ??
        r?.file_path ??
        r?.url ??
        r?.image_url ??
        r?.name ??
        ''
    )
    .filter(Boolean);

  for (const raw of rawPaths) {
    const candidates = makePathCandidates(propertyId, ownerId, raw);
    const basename =
      candidates
        .find((c) => !c.endsWith('/'))
        ?.split('/')
        .pop() || '';

    let picked: string | null = null;

    // 1) Bilinen adaylar
    for (const rel of candidates) {
      const { data: signed, error } = await admin.storage
        .from(PROPERTY_BUCKET)
        .createSignedUrl(rel, 60 * 60 * 24 * 7);
      if (signed?.signedUrl) {
        picked = signed.signedUrl;
        break;
      }
      if (process.env.NODE_ENV === 'development') {
        console.warn('[img] signed FAIL (admin)', {
          rel,
          raw,
          reason: error?.message,
        });
      }
    }

    // 2) Bulunamadıysa BFS ile ara (propertyId / ownerId / ownerId+propertyId / root)
    if (!picked && basename) {
      const maybePath = await findPathByBasename(basename, [
        propertyId,
        ownerId ?? '',
        ownerId ? `${ownerId}/${propertyId}` : '',
      ]);
      if (maybePath) {
        const { data: signed } = await admin.storage
          .from(PROPERTY_BUCKET)
          .createSignedUrl(maybePath, 60 * 60 * 24 * 7);
        if (signed?.signedUrl) picked = signed.signedUrl;
      }
    }

    // 3) Son çare: public fallback (bucket public ise)
    if (!picked) {
      const pub = toPublicImageUrl(candidates[0] ?? raw);
      if (pub) picked = pub;
    }

    if (picked) out.push(picked);
    else if (process.env.NODE_ENV === 'development') {
      console.warn('[img] no URL for raw=', raw, 'candidates=', candidates);
    }
  }

  return dedupe(out).slice(0, 24);
}

export async function getPropertyBySlug(slug: string) {
  const supabase = await getDBClient();

  const { data: p } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!p) return null;

  const rows = await fetchPropertyImagesRaw(p.id);
  const photosFromImages = await buildRenderableUrls(
    p.id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p as any).owner_id ?? null,
    rows
  );

  const photosFromArray = normalizePhotoArray(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p as any).photos,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p as any).og_image_url
  );
  const photos = dedupe([...photosFromImages, ...photosFromArray]).slice(0, 24);

  const amenities = normalizeAmenities(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p as any).amenities,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p as any).features
  );

  return { ...p, photos, amenities };
}

/** (opsiyonel) Benzer ilanlar */
export async function getSimilarProperties(
  base: PropertyRow,
  limit = 6
): Promise<PropertyRow[]> {
  const supabase = await getDBClient();

  let q = supabase
    .from('properties')
    .select('*')
    .eq('status', 'published')
    .neq('id', base.id);

  if (base.type) q = q.eq('type', base.type);
  if (base.location) {
    const city = String(base.location).split(',')[0].trim();
    if (city) q = q.ilike('location', `%${city}%`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const propType = (base as any)?.extras?.propertyType;
  if (propType) q = q.contains('extras', { propertyType: propType });

  const { data } = await q
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data ?? []) as PropertyRow[];
}
