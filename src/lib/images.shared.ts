// src/lib/images.shared.ts
// Bu dosyada "use client" YOK — hem server hem client import edebilir.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
export const PROPERTY_BUCKET = process.env.NEXT_PUBLIC_PROPERTY_BUCKET || 'property-photos';

export function toPublicImageUrl(pathOrUrl?: string | null): string | null {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const cleaned = String(pathOrUrl)
    .replace(/^\/+/, '')
    .replace(/^storage\/v1\/object\/public\/[^/]+\//, '')
    .replace(new RegExp(`^${PROPERTY_BUCKET}\\/`), '');

  return `${SUPABASE_URL}/storage/v1/object/public/${PROPERTY_BUCKET}/${cleaned}`;
}

export function dedupe(arr: (string | null | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of arr) {
    if (!x) continue;
    const v = String(x);
    if (!seen.has(v)) { seen.add(v); out.push(v); }
  }
  return out;
}

export function normalizePhotoArray(
  photos?: (string | null)[] | null,
  og?: string | null,
): string[] {
  const out: string[] = [];
  if (Array.isArray(photos)) {
    for (const p of photos) {
      const u = toPublicImageUrl(p ?? undefined);
      if (u) out.push(u);
    }
  }
  const ogUrl = toPublicImageUrl(og ?? undefined);
  if (!out.length && ogUrl) out.push(ogUrl);
  return dedupe(out);
}

export function normalizeAmenities(amenities?: unknown, featuresFallback?: unknown): string[] {
  if (Array.isArray(amenities)) return amenities.filter(Boolean) as string[];
  if (typeof amenities === 'string') {
    try { const j = JSON.parse(amenities); if (Array.isArray(j)) return j.filter(Boolean); }
    catch { return amenities.split(',').map(s => s.trim()).filter(Boolean); }
  }
  if (Array.isArray(featuresFallback)) return (featuresFallback as string[]).filter(Boolean);
  if (typeof featuresFallback === 'string') {
    try { const j = JSON.parse(featuresFallback); if (Array.isArray(j)) return j.filter(Boolean); }
    catch { return featuresFallback.split(',').map(s => s.trim()).filter(Boolean); }
  }
  return [];
}
