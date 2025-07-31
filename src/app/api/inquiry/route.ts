import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { propertyId, agentId, name, email, phone, message } =
      await request.json();

    // Validate required fields
    if (!propertyId || !agentId || !name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify property exists and agent is assigned
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id, agent_id, title')
      .eq('id', propertyId)
      .eq('agent_id', agentId)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Property not found or agent not assigned' },
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
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert([
          {
            email: user.email,
            role: 'registered',
          },
        ])
        .select('id')
        .single();

      if (createUserError) {
        return NextResponse.json(
          { error: 'Failed to create user record' },
          { status: 500 }
        );
      }
      userId = newUser.id;
    }

    // Create inquiry record
    const { data: inquiry, error: inquiryError } = await supabase
      .from('inquiries')
      .insert([
        {
          property_id: propertyId,
          agent_id: agentId,
          user_id: userId,
          name,
          email,
          phone,
          message,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (inquiryError) {
      console.error('Inquiry creation error:', inquiryError);
      return NextResponse.json(
        { error: 'Failed to create inquiry' },
        { status: 500 }
      );
    }

    // TODO: Send email notification when SendGrid is available
    // For now, just log the inquiry
    console.log('New inquiry created:', {
      inquiryId: inquiry.id,
      propertyId,
      agentId,
      userEmail: email,
      message: message.substring(0, 100) + '...',
    });

    return NextResponse.json({
      success: true,
      inquiryId: inquiry.id,
      message: 'Inquiry submitted successfully',
    });
  } catch (error) {
    console.error('Inquiry API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let query = supabase.from('inquiries').select(`
        *,
        properties (
          id,
          title,
          location
        ),
        agents (
          id,
          name,
          email
        ),
        users (
          id,
          email
        )
      `);

    if (role === 'agent') {
      // Get inquiries for properties owned by the agent
      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (agent) {
        query = query.eq('agent_id', agent.id);
      }
    } else {
      // Get inquiries made by the user
      const { data: userRecord } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userRecord) {
        query = query.eq('user_id', userRecord.id);
      }
    }

    const { data: inquiries, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch inquiries' },
        { status: 500 }
      );
    }

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error('Get inquiries error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
