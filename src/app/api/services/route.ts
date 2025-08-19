import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active');

    // Return demo data immediately for now
    const demoServices = [
      {
        id: '1',
        name: 'Property Valuation',
        description:
          'Professional property valuation service to determine the fair market value of your property',
        category: 'Valuation',
        price: 299.99,
        duration: '2-3 days',
        icon: 'calculator',
        features: [
          'Detailed market analysis',
          'Professional report',
          'Comparable sales data',
          'Market trends analysis',
        ],
        is_active: true,
        sort_order: 1,
      },
      {
        id: '2',
        name: 'Property Management',
        description:
          'Complete property management service including tenant screening, rent collection, and maintenance',
        category: 'Management',
        price: 199.99,
        duration: 'Monthly',
        icon: 'home',
        features: [
          'Tenant screening',
          'Rent collection',
          'Maintenance coordination',
          'Financial reporting',
        ],
        is_active: true,
        sort_order: 2,
      },
      {
        id: '3',
        name: 'Legal Services',
        description:
          'Legal consultation and document preparation for real estate transactions',
        category: 'Legal',
        price: 150.0,
        duration: '1-2 days',
        icon: 'scale',
        features: [
          'Contract review',
          'Legal consultation',
          'Document preparation',
          'Transaction support',
        ],
        is_active: true,
        sort_order: 3,
      },
      {
        id: '4',
        name: 'Mortgage Services',
        description:
          'Mortgage consultation and application assistance for property purchases',
        category: 'Financial',
        price: null,
        duration: 'Varies',
        icon: 'credit-card',
        features: [
          'Mortgage consultation',
          'Application assistance',
          'Rate comparison',
          'Documentation support',
        ],
        is_active: true,
        sort_order: 4,
      },
      {
        id: '5',
        name: 'Insurance Services',
        description: 'Property insurance consultation and policy management',
        category: 'Insurance',
        price: null,
        duration: '1 day',
        icon: 'shield-check',
        features: [
          'Policy comparison',
          'Coverage analysis',
          'Claims assistance',
          'Policy management',
        ],
        is_active: true,
        sort_order: 5,
      },
      {
        id: '6',
        name: 'Moving Services',
        description: 'Professional moving and relocation services',
        category: 'Relocation',
        price: 499.99,
        duration: '1 day',
        icon: 'truck',
        features: [
          'Packing services',
          'Moving coordination',
          'Furniture protection',
          'Delivery confirmation',
        ],
        is_active: true,
        sort_order: 6,
      },
    ];

    // Apply filters to demo data
    let filteredServices = demoServices;

    if (category) {
      filteredServices = filteredServices.filter(
        (service) => service.category === category
      );
    }

    if (active !== null) {
      filteredServices = filteredServices.filter(
        (service) => service.is_active === (active === 'true')
      );
    }

    return NextResponse.json(filteredServices);
  } catch (error) {
    console.error('Services API catch error:', error);

    // Return demo data as fallback when connection fails
    const demoServices = [
      {
        id: '1',
        name: 'Property Valuation',
        description:
          'Professional property valuation service to determine the fair market value of your property',
        category: 'Valuation',
        price: 299.99,
        duration: '2-3 days',
        icon: 'calculator',
        features: [
          'Detailed market analysis',
          'Professional report',
          'Comparable sales data',
          'Market trends analysis',
        ],
        is_active: true,
        sort_order: 1,
      },
      {
        id: '2',
        name: 'Property Management',
        description:
          'Complete property management service including tenant screening, rent collection, and maintenance',
        category: 'Management',
        price: 199.99,
        duration: 'Monthly',
        icon: 'home',
        features: [
          'Tenant screening',
          'Rent collection',
          'Maintenance coordination',
          'Financial reporting',
        ],
        is_active: true,
        sort_order: 2,
      },
      {
        id: '3',
        name: 'Legal Services',
        description:
          'Legal consultation and document preparation for real estate transactions',
        category: 'Legal',
        price: 150.0,
        duration: '1-2 days',
        icon: 'scale',
        features: [
          'Contract review',
          'Legal consultation',
          'Document preparation',
          'Transaction support',
        ],
        is_active: true,
        sort_order: 3,
      },
    ];

    return NextResponse.json(demoServices);
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
