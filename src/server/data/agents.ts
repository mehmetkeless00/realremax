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

    const { data: agents, error } = await supabase
      .from('agents')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.warn('Supabase query failed, falling back to mock data:', error);
      return getAgentsMock();
    }

    return agents || [];
  } catch (error) {
    console.warn('Agents query failed, falling back to mock data:', error);
    return getAgentsMock();
  }
}

function getAgentsMock(): Agent[] {
  return [
    {
      id: '1',
      name: 'John Doe',
      phone: '+1 555-0123',
      company: 'Remax Elite',
      license_number: 'RE123456',
      created_at: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '+1 555-0124',
      company: 'Remax Premier',
      license_number: 'RE123457',
      created_at: '2024-01-10T14:30:00Z',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      phone: '+1 555-0125',
      company: 'Remax Elite',
      license_number: 'RE123458',
      created_at: '2024-01-05T09:15:00Z',
    },
  ];
}
