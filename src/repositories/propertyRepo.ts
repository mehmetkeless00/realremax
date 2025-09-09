import { getServerClientRSC } from '@/server/supabase';
import type { Property } from '@/types/property';
import { toImageUrl } from '@/server/images';

export interface SearchFilters {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  location?: string;
  amenities?: string[];
}

type PropertyListRow = Property & {
  cover_path?: string | null;
  coverUrl?: string | null;
};

export async function searchProperties(
  filters: SearchFilters
): Promise<PropertyListRow[]> {
  try {
    const supabase = await getServerClientRSC();

    const selectCols = `
      id, slug, title, price, location, type, status,
      published_at, created_at,
      cover_raw:cover_image_url, og_image_url,
      cover_path:cover_image_path,
      images:property_images(*)
    `;
    let query = supabase
      .from('properties')
      .select(selectCols)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters.bedrooms !== undefined) {
      query = query.eq('bedrooms', filters.bedrooms);
    }

    if (filters.bathrooms !== undefined) {
      query = query.eq('bathrooms', filters.bathrooms);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.amenities && filters.amenities.length > 0) {
      // Push amenities filtering to DB to avoid selecting the column client-side
      query = query.contains('amenities', filters.amenities);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error('Failed to fetch properties');
    }

    if (!data || data.length === 0) {
      return [];
    }

    const withCovers: PropertyListRow[] = await Promise.all(
      (data ?? []).map(async (r) => {
        const rec = r as unknown as Record<string, unknown> & {
          images?: Record<string, unknown>[] | null;
          cover_path?: string | null;
          cover_raw?: string | null;
          og_image_url?: string | null;
        };

        const imgs = (rec.images ?? []) as Record<string, unknown>[];
        const extractPath = (img: Record<string, unknown>): string | null => {
          const v =
            (img['image_url'] as string | undefined) ||
            (img['url'] as string | undefined) ||
            (img['path'] as string | undefined) ||
            (img['file_path'] as string | undefined) ||
            (img['name'] as string | undefined) ||
            null;
          return v ?? null;
        };
        const isCover = (img: Record<string, unknown>): boolean =>
          Boolean(
            (img['is_cover'] as boolean | undefined) ||
              (img['cover'] as boolean | undefined) ||
              (img['isCover'] as boolean | undefined)
          );
        const getPos = (img: Record<string, unknown>): number => {
          const keys = [
            'position',
            'order',
            'sort',
            'index',
            'sort_index',
            'priority',
          ];
          for (const k of keys) {
            const v = img[k];
            if (typeof v === 'number' && Number.isFinite(v)) return v as number;
          }
          return 999;
        };

        const sorted = [...imgs].sort(
          (a, b) =>
            Number(isCover(b)) - Number(isCover(a)) || getPos(a) - getPos(b)
        );
        const fromImages = sorted.length > 0 ? extractPath(sorted[0]) : null;
        const coverRaw =
          rec.cover_raw ??
          rec.og_image_url ??
          fromImages ??
          rec.cover_path ??
          null;
        const coverUrl = await toImageUrl(coverRaw);

        // Avoid creating an unused `images` variable; include all props
        return { ...(rec as PropertyListRow), coverUrl } as PropertyListRow;
      })
    );

    return withCovers;
  } catch (error) {
    console.error('Search properties error:', error);
    throw new Error('Failed to search properties');
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const supabase = await getServerClientRSC();

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('Get property by ID error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get property by ID error:', error);
    return null;
  }
}
