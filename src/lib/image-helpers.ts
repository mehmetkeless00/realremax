// src/lib/image-helpers.ts
// Server & client ortak saf yardımcılar (RSC'te güvenle çağrılabilir)

export function isRenderableSrc(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

export function isSupabaseOrSigned(u: string) {
  return u.includes('.supabase.co/') || u.includes('token=');
}

/** Kapak görseli seçim sırası: photos[0] → cover_url → og/meta → image/image_url */
export function getCoverUrl(p: unknown): string | null {
  const get = (k: string) => (p as Record<string, unknown>)[k] as unknown;
  const candidates = [
    (get('photos') as unknown[] | undefined)?.[0],
    get('cover_url'),
    get('og_image_url'),
    get('meta_image_url'),
    get('image'),
    get('image_url'),
  ];
  for (const c of candidates) {
    if (isRenderableSrc(c)) return String(c);
  }
  return null;
}
