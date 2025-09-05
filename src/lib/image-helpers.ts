// src/lib/image-helpers.ts
// Server & client ortak saf yardımcılar (RSC'te güvenle çağrılabilir)

export function isRenderableSrc(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

export function isSupabaseOrSigned(u: string) {
  return u.includes('.supabase.co/') || u.includes('token=');
}

/** Kapak görseli seçim sırası: photos[0] → cover_url → og/meta → image/image_url */
export function getCoverUrl(p: any): string | null {
  const candidates = [
    p?.photos?.[0],
    p?.cover_url,
    p?.og_image_url,
    p?.meta_image_url,
    p?.image,
    p?.image_url,
  ];
  for (const c of candidates) {
    if (isRenderableSrc(c)) return String(c);
  }
  return null;
}
