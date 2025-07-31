### Task: Build Property Card Component

**Description**: Create a reusable property card component for grid/list views with image, price, location, specs, and favorite button.

**PDR Reference**: Property Card (Section 4.3.1)

**Dependencies**: Global Header

**Estimated Effort**: 6 hours

**Acceptance Criteria**:

- Displays image, price, location, bedrooms, bathrooms, size.
- Favorite button toggles state for authenticated users.
- Responsive design with hover effects.
- Links to property detail page.

**Sample Code**:

```tsx
// components/PropertyCard.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function PropertyCard({ property }: { property: any }) {
  const [isFavorite, setFavorite] = useState(false);

  return (
    <div className="property-card bg-white rounded-lg shadow-md hover:shadow-lg transition">
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <button
          className={`absolute top-2 right-2 text-2xl ${isFavorite ? 'text-primary-red' : 'text-white'}`}
          onClick={() => setFavorite(!isFavorite)}
        >
          a9
        </button>
      </div>
      <div className="p-4">
        <Link href={`/property/${property.id}`}>
          <h3 className="text-lg font-gotham text-primary-blue">
            {property.price}
          </h3>
          <p className="text-sm text-dark-charcoal">{property.location}</p>
          <div className="flex space-x-2 text-sm text-dark-charcoal">
            <span>{property.bedrooms} bed</span>
            <span>{property.bathrooms} bath</span>
            <span>{property.size}m b2</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
```
