### Task: Implement Basic Property Search

**Description**: Build a Supabase-based search API for properties with filters for price, location, type, and specs.

**PDR Reference**: properties table

**Dependencies**: Property listing CRUD

**Estimated Effort**: 8 hours

**Acceptance Criteria**:

- Search by price range, location, property type, bedrooms, bathrooms, size.
- Returns paginated results.
- Response time <500ms for typical queries.

**Sample Code**:

```ts
// app/api/search/route.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const priceMin = searchParams.get('priceMin');
  const priceMax = searchParams.get('priceMax');
  const location = searchParams.get('location');

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: () => {} }
  );

  let query = supabase.from('properties').select('*');
  if (priceMin) query = query.gte('price', priceMin);
  if (priceMax) query = query.lte('price', priceMax);
  if (location) query = query.ilike('location', `%${location}%`);

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
```
