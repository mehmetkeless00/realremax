// src/server/db/properties.ts
import 'server-only';

import { getServerClientRSC } from '@/server/supabase';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase';
import {
  PROPERTY_BUCKET,
  toPublicImageUrl,
  normalizeAmenities,
  normalizePhotoArray,
  dedupe,
} from '@/lib/images.shared';
import { toImageUrl } from '@/server/images';

type DB = Database['public']['Tables'];
export type PropertyRow = DB['properties']['Row'];

async function getDBClient() {
  return getServerClientRSC();
}

// Shared projection using DB computed column → cover_raw
const SELECT_COLS = `
  id, slug, title, price, location, type, status, bedrooms, bathrooms, size,
  published_at, created_at,
  cover_raw:cover_image_url
`;

// helper: only published/active/approved and status not null
function applyPublishedFilter(q: any) {
  return q
    .or('status.ilike.published,status.ilike.active,status.ilike.approved')
    .not('status', 'is', null);
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

async function fetchPropertyImagesRaw(propertyId: string) {
  const supabase = await getDBClient();
  const { data, error } = await supabase
    .from('property_images')
    .select('*')
    .eq('property_id', propertyId);

  if (error && (error as { code?: string })?.code !== '42P01') {
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

/** Bir klasörü listele ve bulunan dosyalar için public URL üret (anon client ile) */
async function listSignedUnder(prefix: string): Promise<string[]> {
  const pub = getPublicStorage();

  const { data, error } = await pub.storage.from(PROPERTY_BUCKET).list(prefix, {
    limit: 1000,
    sortBy: { column: 'updated_at', order: 'desc' },
  });

  if (error) {
    if (process.env.NODE_ENV === 'development')
      console.warn('[img] list FAIL', prefix, error.message);
    return [];
  }

  const files = (data ?? []).filter((e) => {
    const entry = e as { name?: string; type?: string };
    return !!entry?.name && entry?.type !== 'folder';
  });
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

/** Bucket içinde BFS ile klasörleri dolaş; basename eşleşmesi bulunca yol döndür. */
async function findPathByBasename(
  basename: string,
  seeds: string[]
): Promise<string | null> {
  const pub = getPublicStorage();
  const seen = new Set<string>();
  const queue: string[] = [];

  // aynıları at, boş kökü en sona koy
  for (const s of Array.from(new Set(seeds.filter(Boolean)))) queue.push(s);
  queue.push(''); // root da tara

  while (queue.length) {
    const prefix = queue.shift()!;
    if (seen.has(prefix)) continue;
    seen.add(prefix);

    const { data, error } = await pub.storage
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
      const entry = e as { name?: string; type?: string };
      if (entry?.type === 'folder') {
        const next = `${prefix ? prefix.replace(/\/+$/, '') + '/' : ''}${entry.name}`;
        queue.push(next);
      } else if (entry?.name === basename) {
        const full = `${prefix ? prefix.replace(/\/+$/, '') + '/' : ''}${entry.name}`;
        return full;
      }
    }
  }
  return null;
}

/** Path adaylarını sırayla dene → anon ile public URL; bulunamazsa BFS ile ara; en son public fallback */
async function buildRenderableUrls(
  propertyId: string,
  ownerId: string | null,
  rows: Record<string, unknown>[]
): Promise<string[]> {
  const pub = getPublicStorage();
  const out: string[] = [];

  const rawPaths: string[] = rows
    .map((r: Record<string, unknown>) => {
      const rr = r as Record<string, unknown>;
      return (
        (rr['storage_path'] as string | undefined) ??
        (rr['path'] as string | undefined) ??
        (rr['file_path'] as string | undefined) ??
        (rr['url'] as string | undefined) ??
        (rr['image_url'] as string | undefined) ??
        (rr['name'] as string | undefined) ??
        ''
      );
    })
    .filter(Boolean);

  for (const raw of rawPaths) {
    const candidates = makePathCandidates(propertyId, ownerId, raw);
    const firstNonFolder = candidates.find((c) => !c.endsWith('/'));
    const basename = firstNonFolder
      ? firstNonFolder.split('/').pop() || ''
      : '';

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
  const ownerId = (p as Record<string, unknown>)?.['owner_id'] as
    | string
    | null
    | undefined;
  const photosFromImages = await buildRenderableUrls(
    p.id,
    ownerId ?? null,
    rows
  );

  const photosFromArray = normalizePhotoArray(
    (p as Record<string, unknown>)?.['photos'] as (string | null)[] | null,
    (p as Record<string, unknown>)?.['og_image_url'] as string | null
  );
  const photos = dedupe([...photosFromImages, ...photosFromArray]).slice(0, 24);

  const amenities = normalizeAmenities(
    (p as Record<string, unknown>)?.['amenities'],
    (p as Record<string, unknown>)?.['features']
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
  const propType = (base as unknown as { extras?: { propertyType?: string } })
    ?.extras?.propertyType;
  if (propType) q = q.contains('extras', { propertyType: propType });

  const { data } = await q
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data ?? []) as PropertyRow[];
}

/** Most Recent list with guaranteed coverUrl */
export async function listMostRecent(limit = 12) {
  const supabase = await getDBClient();
  const { data: rows, error } = await supabase
    .from('properties')
    .select(SELECT_COLS)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  const out = await Promise.all(
    (rows ?? []).map(async (r) => {
      const rec = r as Record<string, unknown> & { cover_raw?: string | null };
      const coverUrl = await toImageUrl(rec.cover_raw ?? null);
      return { ...rec, coverUrl } as Record<string, unknown>;
    })
  );

  return out;
}

/** Tolerant extractors for flexible schemas */
function extractImageUrl(
  img: Record<string, unknown> | null | undefined
): string | null {
  if (!img) return null;
  const val =
    (img['image_url'] as string | undefined) ||
    (img['url'] as string | undefined) ||
    (img['path'] as string | undefined) ||
    (img['file_path'] as string | undefined) ||
    (img['name'] as string | undefined) ||
    null;
  return val ?? null;
}

function extractPositionGeneric(
  img: Record<string, unknown> | null | undefined
): number {
  if (!img) return 999;
  const keys = ['position', 'order', 'sort', 'index', 'sort_index', 'priority'];
  for (const k of keys) {
    const v = img[k];
    if (typeof v === 'number' && Number.isFinite(v)) return v as number;
  }
  return 999;
}

function isCoverGeneric(
  img: Record<string, unknown> | null | undefined
): boolean {
  if (!img) return false;
  return Boolean(
    (img['is_cover'] as boolean | undefined) ??
      (img['cover'] as boolean | undefined) ??
      (img['isCover'] as boolean | undefined)
  );
}

/** Shared list fetcher for Home and Buy/Rent basic lists */
export async function listRecentProperties(limit = 12) {
  const supabase = await getDBClient();
  let q = supabase.from('properties').select(SELECT_COLS);
  q = applyPublishedFilter(q)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  const { data: rows, error } = await q;
  if (error) throw new Error(error.message ?? 'failed to load properties');

  const mapped = await Promise.all(
    (rows ?? []).map(async (r) => {
      const rec = r as Record<string, unknown> & { cover_raw?: string | null };
      const coverRaw = (rec['cover_raw'] as string | null) || null;
      const coverUrl = await toImageUrl(coverRaw);
      return { ...rec, coverUrl } as Record<string, unknown>;
    })
  );

  return mapped;
}

/** Simple search with the same projection; adapt filters as needed */
export async function searchPropertiesRepo(
  filters: Record<string, unknown>,
  limit = 24
) {
  const supabase = await getDBClient();
  let q = supabase.from('properties').select(SELECT_COLS);
  q = applyPublishedFilter(q);

  if (typeof filters?.location === 'string' && filters.location) {
    q = q.ilike('location', `%${filters.location}%`);
  }
  if (typeof filters?.type === 'string' && filters.type) {
    q = q.eq('type', filters.type);
  }
  if (typeof filters?.minPrice === 'number') {
    q = q.gte('price', Number(filters.minPrice));
  }
  if (typeof filters?.maxPrice === 'number') {
    q = q.lte('price', Number(filters.maxPrice));
  }
  if (typeof filters?.beds === 'number') {
    q = q.gte('bedrooms', Number(filters.beds));
  }
  if (typeof filters?.baths === 'number') {
    q = q.gte('bathrooms', Number(filters.baths));
  }

  q = q
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  const { data, error } = await q;
  if (error) throw new Error(error.message ?? 'failed to search properties');

  const mapped = await Promise.all(
    (data ?? []).map(async (r) => {
      const rec = r as Record<string, unknown> & { cover_raw?: string | null };
      return {
        ...rec,
        coverUrl: await toImageUrl(rec.cover_raw ?? null),
      } as Record<string, unknown>;
    })
  );

  return mapped;
}
