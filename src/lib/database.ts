import { supabase } from './supabase';

// User functions
export async function createUser(
  email: string,
  role: 'visitor' | 'registered' | 'agent' = 'visitor'
) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, role }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserRole(
  id: string,
  role: 'visitor' | 'registered' | 'agent'
) {
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Agent functions
export async function createAgent(
  userId: string,
  name: string,
  phone: string,
  licenseNumber: string,
  company: string
) {
  const { data, error } = await supabase
    .from('agents')
    .insert([
      {
        user_id: userId,
        name,
        phone,
        license_number: licenseNumber,
        company,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAgentByUserId(userId: string) {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Property functions
export async function createProperty(
  title: string,
  price: number,
  location: string,
  type: string,
  agentId?: string,
  description?: string,
  bedrooms?: number,
  bathrooms?: number,
  size?: number
) {
  const { data, error } = await supabase
    .from('properties')
    .insert([
      {
        title,
        description,
        price,
        location,
        type,
        bedrooms,
        bathrooms,
        size,
        agent_id: agentId,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProperties(filters?: {
  status?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}) {
  let query = supabase.from('properties').select('*');

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  if (filters?.minPrice) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters?.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Listing functions
export async function createListing(
  propertyId: string,
  agentId: string,
  listingType: 'sale' | 'rent',
  price: number
) {
  const { data, error } = await supabase
    .from('listings')
    .insert([
      {
        property_id: propertyId,
        agent_id: agentId,
        listing_type: listingType,
        price,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getListings(filters?: {
  status?: string;
  listingType?: 'sale' | 'rent';
  agentId?: string;
}) {
  let query = supabase.from('listings').select('*');

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.listingType) {
    query = query.eq('listing_type', filters.listingType);
  }
  if (filters?.agentId) {
    query = query.eq('agent_id', filters.agentId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
