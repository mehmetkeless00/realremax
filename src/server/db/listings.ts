'use server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export type PropertyStatus = 'draft' | 'published' | 'archived';

export interface CreateListingData {
  title: string;
  description?: string;
  price?: number;
  location?: string;
  type?: string;
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  status?: PropertyStatus;
}

export interface UpdateListingData {
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  type?: string;
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  status?: PropertyStatus;
}

export async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
}

export async function getUserAndRole() {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user, isAdmin: user?.user_metadata?.role === 'admin' };
}

export async function listListings() {
  const { supabase, user, isAdmin } = await getUserAndRole();
  if (!user) throw new Error('Unauthorized');
  let q = supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });
  if (!isAdmin) q = q.eq('agent_id', user.id);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createListing(body: CreateListingData) {
  const { supabase, user, isAdmin } = await getUserAndRole();
  if (!user) throw new Error('Unauthorized');
  const payload = {
    title: String(body.title ?? '').trim(),
    description: body.description ?? null,
    price: body.price != null ? Number(body.price) : null,
    location: body.location ?? null,
    type: body.type ?? 'other',
    slug: body.slug ?? null,
    meta_title: body.meta_title ?? null,
    meta_description: body.meta_description ?? null,
    og_image_url: body.og_image_url ?? null,
    status: isAdmin ? (body.status ?? 'draft') : 'draft',
    published_at: null,
    // agent_id: let DB default set auth.uid() via RLS migration
  };
  if (!payload.title || !payload.type) {
    throw new Error('Missing required fields');
  }
  const { data, error } = await supabase
    .from('properties')
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateListing(id: string, body: UpdateListingData) {
  const { supabase, user, isAdmin } = await getUserAndRole();
  if (!user) throw new Error('Unauthorized');

  const patch: Record<string, unknown> = {
    title: body.title ?? undefined,
    description: body.description ?? undefined,
    price: body.price !== undefined ? Number(body.price) : undefined,
    location: body.location ?? undefined,
    type: body.type ?? undefined,
    slug: body.slug ?? undefined,
    meta_title: body.meta_title ?? undefined,
    meta_description: body.meta_description ?? undefined,
    og_image_url: body.og_image_url ?? undefined,
  };

  if (isAdmin && body.status === 'published') {
    patch.status = 'published';
    patch.published_at = new Date().toISOString();
  } else if (isAdmin && body.status === 'draft') {
    patch.status = 'draft';
    patch.published_at = null;
  } else if (!isAdmin && body.status) {
    patch.status = 'draft';
    patch.published_at = null;
  }

  const { data, error } = await supabase
    .from('properties')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteListing(id: string) {
  const { supabase, user } = await getUserAndRole();
  if (!user) throw new Error('Unauthorized');

  // Check if property exists and user has permission
  const { data: existingProperty } = await supabase
    .from('properties')
    .select('agent_id')
    .eq('id', id)
    .single();

  if (
    !existingProperty ||
    (existingProperty.agent_id !== user.id &&
      user.user_metadata?.role !== 'admin')
  ) {
    throw new Error('Property not found or unauthorized');
  }

  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return { message: 'Property deleted successfully' };
}

/** Public/homepage feed: published only, newest first */
export async function listPublishedListings(limit = 12) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}
