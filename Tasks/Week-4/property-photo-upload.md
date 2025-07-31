### Task: Implement Property Photo Upload

**Description**: Enable photo uploads to Supabase Buckets with automatic optimization and validation.

**PDR Reference**: Supabase Buckets

**Dependencies**: Property Listing CRUD

**Estimated Effort**: 6 hours

**Acceptance Criteria**:
- Supports drag-and-drop uploads.
- Validates file type (JPEG/PNG) and size (<5MB).
- Stores images in Supabase Buckets.
- Returns public URLs for property images.

**Sample Code**:
```ts
// lib/supabaseStorage.ts
import { createServerClient } from '@supabase/ssr';

export async function uploadImage(file: File, propertyId: string) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: () => {} }
  );

  const { data, error } = await supabase.storage
    .from('property-images')
    .upload(`${propertyId}/${file.name}`, file, {
      contentType: file.type,
      cacheControl: '3600',
    });

  if (error) throw new Error(error.message);
  return supabase.storage.from('property-images').getPublicUrl(`${propertyId}/${file.name}`).data.publicUrl;
}
```