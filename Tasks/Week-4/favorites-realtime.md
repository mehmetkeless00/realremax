### Task: Favorites Real-time Sync

**Description & Context:**
Subscribe to Supabase Realtime for changes to the favorites table. Update Zustand state across tabs/devices for a seamless user experience.

**Technology Stack:** Supabase Realtime, Zustand, Next.js, TypeScript

**Folder/File Path Suggestions:**

- `/lib/store/favoritesStore.ts`
- `/lib/realtime/`

**Dependencies:**

- Supabase Realtime enabled on favorites table
- Zustand favorites store

**Estimated Effort:** 3 hours

**Acceptance Criteria:**

- Favorites update in real-time across tabs/devices
- Zustand state reflects Supabase changes
- No manual refresh required

**Code Example:**

```ts
// lib/realtime/favoritesRealtime.ts
import { createClient } from '@supabase/supabase-js';
import { useFavoritesStore } from '@/lib/store/favoritesStore';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function subscribeToFavorites(userId: string) {
  return supabase
    .channel('public:favorites')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'favorites',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        // Update Zustand store with new favorites
        useFavoritesStore.getState().syncFavoritesFromServer();
      }
    )
    .subscribe();
}
```

// Reference: Use with `favorites-feature.md` and Zustand store.
