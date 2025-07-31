### Task: Build Advanced Search Bar

**Description**: Create an advanced search bar with location autocomplete, property type dropdown, price range slider, and filter panel.

**PDR Reference**: Advanced Search Bar (Section 4.4.1)

**Dependencies**: Property Card, Basic Property Search

**Estimated Effort**: 10 hours

**Acceptance Criteria**:
- Location autocomplete uses Google Maps Places API.
- Price range slider supports manual input.
- Dropdown for property types (buy, rent, commercial).
- Expandable panel for advanced filters.
- Displays search result count.

**Sample Code**:
```tsx
// components/SearchBar.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [location, setLocation] = useState('');
  const router = useRouter();

  useEffect(() => {
    const autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('location-input') as HTMLInputElement
    );
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      setLocation(place.formatted_address || '');
    });
  }, []);

  const handleSearch = () => {
    router.push(`/search?location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <input
        id="location-input"
        type="text"
        placeholder="Enter location"
        className="input-field"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button onClick={handleSearch} className="button-primary mt-2">Search</button>
    </div>
  );
}
```