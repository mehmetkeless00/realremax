// src/server/db/properties.ts
'use server';
import 'server-only';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

import { createClient } from '@supabase/supabase-js';
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

/** Public (anon) storage client: read-only operations (list/getPublicUrl) */
function getPublicStorage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Public (anon) storage client: read-only operations (list/getPublicUrl) */
function getPublicStorage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
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
  } catch { }

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
/** Bir klasörü listele ve bulunan dosyalar için public URL üret (anon client ile) */
async function listSignedUnder(prefix: string): Promise<string[]> {
  const pub = getPublicStorage();

  const { data, error } = await pub.storage
    .from(PROPERTY_BUCKET)
    .list(prefix, { limit: 1000, sortBy: { column: 'updated_at', order: 'desc' } });

  if (error) {
    if (process.env.NODE_ENV === 'development') console.warn('[img] list FAIL', prefix, error.message);
    return [];
  }

  const files = (data ?? []).filter((e: any) => e?.name && e?.type !== 'folder');
  const out: string[] = [];
  for (const f of files) {
    const full = `${prefix ? prefix.replace(/\/+$/, '') + '/' : ''}${f.name}`;
    const { data: pubUrl } = pub.storage
      .from(PROPERTY_BUCKET)
      .getPublicUrl(full);
    if (pubUrl?.publicUrl) out.push(pubUrl.publicUrl);
  }
  return out;
}



/** Path adaylarını sırayla dene → anon ile public URL; bulunamazsa BFS ile ara; en son public fallback */

async function buildRenderableUrls(
  propertyId: string,
  ownerId: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[]
): Promise<string[]> {


  for (const raw of rawPaths) {
    const candidates = makePathCandidates(propertyId, ownerId, raw);
    const basename =
      candidates
        .find((c) => !c.endsWith('/'))
        ?.split('/')
        .pop() || '';

    let picked: string | null = null;

    // 1) Bilinen adaylar → public URL üret
    for (const rel of candidates) {
      const { data: pubUrl } = pub.storage
        .from(PROPERTY_BUCKET)
        .getPublicUrl(rel);

      if (pubUrl?.publicUrl) {
        picked = pubUrl.publicUrl;
        break;
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
        const { data: pubUrl } = pub.storage
          .from(PROPERTY_BUCKET)
          .getPublicUrl(maybePath);
        if (pubUrl?.publicUrl) picked = pubUrl.publicUrl;
      }
    }

    // 3) Son çare: public fallback (bucket public ise)
    if (!picked) {
      const fallback = toPublicImageUrl(candidates[0] ?? raw);
      if (fallback) picked = fallback;
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
    .eq('status', 'active')
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
