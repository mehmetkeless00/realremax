import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export interface Agent {
  id: string;
  name: string;
  phone: string;
  company: string;
  license_number: string;
  created_at: string;
}

export async function getAgents(): Promise<Agent[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select(
        `
        id,
        name,
        phone,
        company,
        license_number,
        created_at
      `
      )
      .order('name', { ascending: true });

    if (agentsError) {
      console.error('Agents fetch error:', agentsError);
      throw new Error('Failed to fetch agents');
    }

    return agents || [];
  } catch (error) {
    console.error('Agents fetch error:', error);
    throw new Error('Failed to fetch agents');
  }
}
