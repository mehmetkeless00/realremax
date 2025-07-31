### Task: Google Maps Integration

**Description & Context:**
Embed Google Maps using the Google Maps JavaScript API and Places Autocomplete. Use maps on property detail pages and in search filters. Add interactive markers and geolocation support for user experience.

**Technology Stack:** Next.js, TypeScript, Google Maps JS API, Tailwind CSS

**Folder/File Path Suggestions:**
- `/components/PropertyMap.tsx`
- `/components/SearchBar.tsx`
- `/lib/maps/`

**Dependencies:**
- Google Maps API key in `.env`
- Property detail and search page components

**Estimated Effort:** 5 hours

**Acceptance Criteria:**
- Maps render on property detail and search pages
- Places Autocomplete works in search filters
- Markers are interactive and support geolocation
- No API key leaks; all keys are environment-protected

**Code Example:**
```tsx
// components/PropertyMap.tsx
'use client';
import { useEffect, useRef } from 'react';

interface PropertyMapProps {
  lat: number;
  lng: number;
  price: string;
}

export default function PropertyMap({ lat, lng, price }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.google) return;
    const map = new window.google.maps.Map(mapRef.current!, {
      center: { lat, lng },
      zoom: 15,
    });
    new window.google.maps.Marker({
      position: { lat, lng },
      map,
      label: price,
    });
  }, [lat, lng, price]);

  return <div ref={mapRef} className="w-full h-96" />;
}
```
// Reference: See also `advanced-search-bar.md` and `property-detail-page.md` for integration points.