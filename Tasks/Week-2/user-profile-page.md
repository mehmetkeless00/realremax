### Task: Create User Profile Page

**Description**: Build a user profile page for registered users to manage personal information, preferences, and notification settings.

**PDR Reference**: Input Elements, Buttons (Section 4.5.1)

**Dependencies**: Global Header, Supabase Auth

**Estimated Effort**: 8 hours

**Acceptance Criteria**:
- Users can view/edit name, email, and preferences.
- Notification settings include email alert frequency.
- Page is accessible only to authenticated users.
- Responsive design with Tailwind CSS.

**Sample Code**:
```tsx
// app/profile/page.tsx
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';

export default async function ProfilePage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: () => {} }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-gotham font-bold text-primary-dark-blue">Profile Settings</h1>
      <ProfileForm user={user} />
    </div>
  );
}
```
```tsx
// components/ProfileForm.tsx
'use client';
import { useState } from 'react';
import { useSupabase } from '@/lib/supabase';

export default function ProfileForm({ user }: { user: any }) {
  const [name, setName] = useState(user.user_metadata.name || '');
  const supabase = useSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ data: { name } });
    if (error) console.error(error);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-arial">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
      </div>
      <button type="submit" className="button-primary">Save Changes</button>
    </form>
  );
}
```