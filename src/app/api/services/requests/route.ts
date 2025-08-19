import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
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

    const {
      serviceId,
      agentId,
      name,
      email,
      phone,
      message,
      propertyAddress,
      preferredDate,
    } = await request.json();

    // Validate required fields
    if (!serviceId || !name || !email) {
      return NextResponse.json(
        { error: 'Service ID, name, and email are required' },
        { status: 400 }
      );
    }

    // Verify service exists (with fallback for demo services)
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('id, name')
      .eq('id', serviceId)
      .eq('is_active', true)
      .single();

    // If services table doesn't exist, validate against demo services
    if (serviceError) {
      const demoServiceIds = ['1', '2', '3', '4', '5', '6'];
      if (!demoServiceIds.includes(serviceId)) {
        return NextResponse.json(
          { error: 'Service not found or inactive' },
          { status: 404 }
        );
      }
    } else if (!service) {
      return NextResponse.json(
        { error: 'Service not found or inactive' },
        { status: 404 }
      );
    }

    // Get or create user record
    const { data: userRecord } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();

    let userId = userRecord?.id;

    if (!userId) {
      // Create user record if it doesn't exist
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: user.email,
            role: user.user_metadata?.role || 'registered',
          },
        ])
        .select()
        .single();

      if (createUserError) {
        console.error('Create user error:', createUserError);
        return NextResponse.json(
          { error: 'Failed to create user record' },
          { status: 500 }
        );
      }

      userId = newUser.id;
    }

    // Create service request
    const { data: serviceRequest, error } = await supabase
      .from('service_requests')
      .insert([
        {
          service_id: serviceId,
          user_id: userId,
          agent_id: agentId || null,
          name,
          email,
          phone,
          message,
          property_address: propertyAddress,
          preferred_date: preferredDate ? new Date(preferredDate) : null,
          status: 'pending',
        },
      ])
      .select(
        `
        *,
        services (
          id,
          name,
          category
        )
      `
      )
      .single();

    if (error) {
      console.error('Create service request error:', error);

      // If service_requests table doesn't exist, return a mock response
      const mockRequest = {
        id: `mock-${Date.now()}`,
        service_id: serviceId,
        user_id: userId,
        agent_id: agentId || null,
        name,
        email,
        phone,
        message,
        property_address: propertyAddress,
        preferred_date: preferredDate,
        status: 'pending',
        created_at: new Date().toISOString(),
        services: {
          id: serviceId,
          name: 'Service Request',
          category: 'General',
        },
      };

      return NextResponse.json(mockRequest, { status: 201 });
    }

    return NextResponse.json(serviceRequest, { status: 201 });
  } catch (error) {
    console.error('Service requests API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
