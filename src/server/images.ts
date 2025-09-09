// src/server/images.ts
import 'server-only';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const PROPERTY_BUCKET = 'property-photos';

const supa = createClient(url, anon, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** Remove leading "public/" or bucket name so getPublicUrl works reliably. */
export function normalizeStoragePath(raw?: string | null): string | null {
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;

  let p = raw.trim().replace(/^\/+/, '');
  p = p.replace(/^storage\/v1\/object\/public\//, '');
  p = p.replace(/^public\//, '');

  const bucketPrefix = `${PROPERTY_BUCKET}/`;
  if (p.startsWith(bucketPrefix)) p = p.slice(bucketPrefix.length);

  return p;
}

/** Return a public URL from a DB path (handles absolute URLs too). */
export function toPublicUrl(path?: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = normalizeStoragePath(path);
  if (!normalized) return null;
  const { data } = supa.storage.from(PROPERTY_BUCKET).getPublicUrl(normalized);
  return data.publicUrl ?? null;
}

/** Try public URL first; if not available (private bucket), create a signed URL. */
export async function toImageUrl(raw?: string | null): Promise<string | null> {
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  const key = normalizeStoragePath(raw);
  if (!key) return null;
  const pubRes = supa.storage.from(PROPERTY_BUCKET).getPublicUrl(key);
  const pub = pubRes.data.publicUrl;
  if (pub) return pub;
  const { data: signed } = await supa.storage
    .from(PROPERTY_BUCKET)
    .createSignedUrl(key, 3600);
  return signed?.signedUrl ?? null;
}
