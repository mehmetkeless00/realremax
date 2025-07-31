### Task: Build Property Detail Page

**Description**: Create a property detail page with gallery, specs, agent info, and inquiry form.

**PDR Reference**: Property Gallery, Property Info (Section 6.2)

**Dependencies**: Property Card, Listing Form

**Estimated Effort**: 10 hours

**Acceptance Criteria**:
- Displays hero image, thumbnail carousel, and specs table.
- Includes agent contact card and inquiry form.
- Responsive layout with 70% gallery, 30% info split.
- Accessible with ARIA labels.

**Sample Code**:
```tsx
// app/property/[id]/page.tsx
import { createServerClient } from '@supabase/ssr';
import Image from 'next/image';

export default async function PropertyDetail({ params }: { params: { id: string } }) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: () => {} }
  );
  const { data: property } = await supabase.from('properties').select('*').eq('id', params.id).single();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-7/12">
          <Image src={property.image} alt={property.title} width={800} height={450} className="rounded-lg" />
        </div>
        <div className="md:w-5/12 p-4">
          <h1 className="text-2xl font-gotham text-primary-blue">{property.price}</h1>
          <p>{property.location}</p>
          <form className="space-y-4 mt-4">
            <input type="text" placeholder="Your Name" className="input-field" />
            <button type="submit" className="button-primary">Contact Agent</button>
          </form>
        </div>
      </div>
    </div>
  );
}
```