### Task: Zustand Stores Setup

**Description**: Set up global state management using Zustand for the Remax Unified Platform. Define modular stores for user, UI, and property state.

**Subtasks:**
- Install Zustand and create `/lib/store/` directory
- Implement `userStore`, `uiStore`, and `propertyStore` as separate files
- Provide TypeScript types for each store
- Add example usage in a component

**Folder/File Path Suggestions:**
- `/lib/store/userStore.ts`
- `/lib/store/uiStore.ts`
- `/lib/store/propertyStore.ts`

**Acceptance Criteria:**
- Stores are modular, typed, and reusable
- State can be updated and read from any component
- No prop drilling for global state

**Estimated Effort:** 3 hours

**Example:**
```ts
// lib/store/userStore.ts
import { create } from 'zustand';

interface UserState {
  user: { id: string; name: string } | null;
  setUser: (user: UserState['user']) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```
```tsx
// Example usage in a component
import { useUserStore } from '@/lib/store/userStore';

export default function ProfileName() {
  const user = useUserStore((s) => s.user);
  return <span>{user?.name}</span>;
}
```