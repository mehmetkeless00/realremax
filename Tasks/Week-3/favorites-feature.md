### Task: Favorites Feature (Property Save)

**Description**: Implement a feature allowing users to save properties as favorites, using Zustand for local state and Supabase for persistence.

**Subtasks:**

- Add `favoritesStore` to `/lib/store/`
- Create UI for toggling favorite on property cards
- Sync favorites with Supabase for authenticated users
- Show saved state on property cards

**Folder/File Path Suggestions:**

- `/lib/store/favoritesStore.ts`
- `/components/PropertyCard.tsx`

**Acceptance Criteria:**

- Users can add/remove properties from favorites
- Favorites persist for logged-in users
- UI reflects favorite state instantly

**Estimated Effort:** 4 hours

**Example:**

```ts
// lib/store/favoritesStore.ts
import { create } from 'zustand';

interface FavoritesState {
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  toggleFavorite: (id) => {
    const { favorites } = get();
    set({
      favorites: favorites.includes(id)
        ? favorites.filter((fid) => fid !== id)
        : [...favorites, id],
    });
  },
}));
```

```tsx
// components/PropertyCard.tsx (snippet)
import { useFavoritesStore } from '@/lib/store/favoritesStore';

export default function PropertyCard({ property }: { property: any }) {
  const { favorites, toggleFavorite } = useFavoritesStore();
  const isFavorite = favorites.includes(property.id);
  return (
    <button onClick={() => toggleFavorite(property.id)}>
      {isFavorite ? '★' : '☆'}
    </button>
  );
}
```
