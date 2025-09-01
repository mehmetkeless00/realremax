'use client';

import { supabase } from '@/lib/supabase';
import type { PropertyImage } from '@/types/property';
import { toPublicImageUrl } from '@/lib/images.shared'; // paylaşılan saf helper

const BUCKET = process.env.NEXT_PUBLIC_PROPERTY_BUCKET || 'property-photos';
const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export type UploadResult =
  | { success: true; data: PropertyImage }
  | { success: false; error: string };

export async function uploadImage(
  file: File,
  userId: string,
  propertyId: string,
  position = 0
): Promise<UploadResult> {
  try {
    const filename = `${Date.now()}-${position}-${file.name.replace(/\s+/g, '-')}`;
    const storagePath = `${propertyId}/${filename}`; // araya fazladan klasör koyma

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, { upsert: true, contentType: file.type });
    if (upErr) return { success: false, error: upErr.message };

    const { data: pub } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);
    const publicUrl =
      pub?.publicUrl ||
      `${BASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;

    const insert = {
      property_id: propertyId,
      storage_path: storagePath,
      public_url: publicUrl,
      position,
    };
    const { data, error } = await supabase
      .from('property_images')
      .insert(insert)
      .select('id, property_id, storage_path, public_url, position, created_at')
      .single();

    if (error || !data)
      return { success: false, error: error?.message || 'DB insert failed' };

    return {
      success: true,
      data: {
        id: data.id,
        property_id: data.property_id,
        storage_path: data.storage_path,
        public_url: data.public_url,
        position: data.position ?? 0,
        created_at: data.created_at ?? null,
      },
    };
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'unknown error';
    return { success: false, error: errorMessage };
  }
}

export async function fetchPropertyImages(propertyId: string) {
  const { data, error } = await supabase
    .from('property_images')
    .select('*') // güvenli seçim
    .eq('property_id', propertyId);

  if (error)
    return { success: false as const, error: error.message, data: null };

  const normalized = (data ?? []).map((r) => ({
    ...r,
    public_url:
      r.public_url ||
      toPublicImageUrl(
        r.storage_path ||
          r.path ||
          r.file_path ||
          r.url ||
          r.image_url ||
          r.name
      ) ||
      '',
  }));

  return { success: true as const, data: normalized };
}

// DİKKAT: Buradan normalizeAmenities vb. ŞEYLERİ **RE-EXPORT ETME**.
// Server import ederse tekrar client boundary hatası verir.
