import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let query = supabase
      .from('service_requests')
      .select(
        `
        *,
        services (
          id,
          name,
          category
        ),
        agents (
          id,
          name,
          company
        ),
        users (
          id,
          email
        )
      `
      )
      .order('created_at', { ascending: false });

    if (role === 'agent') {
      // Get service requests assigned to the agent
      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (agent) {
        query = query.eq('agent_id', agent.id);
      }
    } else {
      // Get service requests made by the user
      const { data: userRecord } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userRecord) {
        query = query.eq('user_id', userRecord.id);
      }
    }

    const { data: requests, error } = await query;

    if (error) {
      console.error('Service requests API error:', error);

      // If service_requests table doesn't exist, return empty array
      return NextResponse.json({ requests: [] });
    }

    return NextResponse.json({ requests: requests || [] });
  } catch (error) {
    console.error('Service requests API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, customerName, customerEmail, customerPhone, message } =
      body;

    // Validate required fields
    if (!serviceId || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    // Verify service exists
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('id, name')
      .eq('id', serviceId)
      .eq('status', 'active')
      .single();

    if (serviceError || !service) {
      return NextResponse.json(
        { error: 'Service not found or inactive' },
        { status: 404 }
      );
    }

    // Create service request
    const { data: serviceRequest, error: requestError } = await supabase
      .from('service_requests')
      .insert({
        service_id: serviceId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        message: message || null,
        status: 'pending',
      })
      .select()
      .single();

    if (requestError) {
      console.error('Service request creation error:', requestError);
      return NextResponse.json(
        { error: 'Failed to create service request' },
        { status: 500 }
      );
    }

    return NextResponse.json(serviceRequest, { status: 201 });
  } catch (error) {
    console.error('Service request API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
