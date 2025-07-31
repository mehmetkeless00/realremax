### Task: Implement Property Listing CRUD

**Description**: Create Supabase API endpoints for creating, reading, updating, and deleting property listings, restricted to agents.

**PDR Reference**: properties table, RLS

**Dependencies**: Supabase schema, RLS policies

**Estimated Effort**: 8 hours

**Acceptance Criteria**:
- Agents can create, update, delete listings.
- Listings include title, description, price, location, type, specs.
- Only the assigned agent can modify their listings.
- Data is validated server-side.

**Sample Code**:
```ts
// app/api/listings/route.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: () => {} }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata.role !== 'agent') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { title, description, price, location, type, bedrooms, bathrooms, size } = await request.json();
  const { data, error } = await supabase
    .from('properties')
    .insert([{ title, description, price, location, type, bedrooms, bathrooms, size, agent_id: user.id }])
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
```