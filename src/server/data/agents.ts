import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  license_number: string;
  photo_url?: string;
  bio?: string;
  specialties?: string[];
  languages?: string[];
  experience_years?: number;
  created_at: string;
  updated_at: string;
}

export async function getAgents(): Promise<Agent[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Agents query error:', error);
      throw new Error('Failed to fetch agents');
    }

    return data || [];
  } catch (error) {
    console.error('Get agents error:', error);
    throw new Error('Failed to fetch agents');
  }
}

export async function getAgentById(id: string): Promise<Agent | null> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Get agent by ID error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get agent by ID error:', error);
    return null;
  }
}
