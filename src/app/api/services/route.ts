import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) {
      return NextResponse.json({ error: 'Missing SUPABASE env' }, { status: 500 });
    }

    const supa = createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supa
      .from('services')
      .select('id, slug, title, short_description, icon, order_index, status')
      .eq('status', 'active')
      .order('order_index', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message, code: (error as any).code },
        { status: 500 }
      );
    }

    return NextResponse.json({ services: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'unknown' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(url, anon, { auth: { persistSession: false } });

    // Check if user is authenticated and has admin role
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, allow only authenticated users to create services
    // In production, you might want to check for admin role
    const {
      name,
      description,
      category,
      price,
      duration,
      icon,
      features,
      is_active = true,
      sort_order = 0,
    } = await request.json();

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      );
    }

    // Create service
    const { data: service, error } = await supabase
      .from('services')
      .insert([
        {
          name,
          description,
          category,
          price: price ? parseFloat(price) : null,
          duration,
          icon,
          features: features || [],
          is_active,
          sort_order: sort_order ? parseInt(sort_order) : 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Create service error:', error);
      return NextResponse.json(
        { error: 'Failed to create service' },
        { status: 500 }
      );
    }

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Services API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
