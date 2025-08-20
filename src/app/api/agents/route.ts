import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    // Tüm agent'ları getir
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
      console.error('Agents API error:', agentsError);
      return NextResponse.json(
        { error: 'Failed to fetch agents' },
        { status: 500 }
      );
    }

    return NextResponse.json(agents || []);
  } catch (error) {
    console.error('Agents API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
