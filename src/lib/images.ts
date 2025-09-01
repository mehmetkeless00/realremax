const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;

/** Tek bir path/URL'yi Supabase public URL'e çevirir. */
export function toPublicImageUrl(pathOrUrl?: string | null): string | null {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  // Farklı path varyasyonlarını temizle
  const cleaned = String(pathOrUrl)
    .replace(/^\/+/, '')
    .replace(/^storage\/v1\/object\/public\/property-photos\//, '')
    .replace(/^property-photos\//, '');

  return `${SUPABASE_URL}/storage/v1/object/public/property-photos/${cleaned}`;
}

/** Dizideki foto kaynaklarını normalize eder; og fallback ekler. */
export function normalizePhotoArray(
  photos?: (string | null)[] | null,
  og?: string | null
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

/** property_images satırlarından URL listesi üretir ve sıralar. */
export function fromImageRows(
  rows?: Array<{
    url?: string | null;
    image_url?: string | null;
    public_url?: string | null;
    file_url?: string | null;
    path?: string | null;
    file_path?: string | null;
    storage_path?: string | null;
    name?: string | null;
    position?: number | null;
    sort_order?: number | null;
    order?: number | null;
  }> | null
): string[] {
  if (!Array.isArray(rows)) return [];

  const sorted = [...rows].sort((a, b) => {
    const aPos = a?.position ?? a?.sort_order ?? a?.order ?? 0;
    const bPos = b?.position ?? b?.sort_order ?? b?.order ?? 0;
    return Number(aPos) - Number(bPos);
  });

  const out: string[] = [];
  for (const r of sorted) {
    const candidates = [
      r?.url,
      r?.image_url,
      r?.public_url,
      r?.file_url,
      r?.path,
      r?.file_path,
      r?.storage_path,
      r?.name, // bazen "property-photos/xxx.jpg" olarak tutulur
    ].filter(Boolean) as string[];

    for (const c of candidates) {
      const u = toPublicImageUrl(c);
      if (u) out.push(u);
    }
  }
  return dedupe(out);
}

/** Dizi içindeki tekrarları kaldırır. */
export function dedupe(arr: (string | null | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of arr) {
    if (!x) continue;
    const v = String(x);
    if (!seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}

/** Özellik/amenities normalize: array | csv | json | null */
export function normalizeAmenities(
  amenities?: unknown,
  featuresFallback?: unknown
): string[] {
  if (Array.isArray(amenities)) return amenities.filter(Boolean) as string[];

  if (typeof amenities === 'string') {
    try {
      const parsed = JSON.parse(amenities);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      return amenities
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  if (Array.isArray(featuresFallback))
    return (featuresFallback as unknown[]).filter(Boolean) as string[];
  if (typeof featuresFallback === 'string') {
    try {
      const parsed = JSON.parse(featuresFallback);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      return featuresFallback
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
}
