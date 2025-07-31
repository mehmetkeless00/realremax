### Task: Password Management and Recovery

**Description**: Implement password reset and change functionality using Supabase Auth.

**PDR Reference**: Supabase Auth password management

**Dependencies**: Supabase Auth setup

**Estimated Effort**: 5 hours

**Acceptance Criteria**:
- Users can request password reset via email.
- Password change is available in profile settings.
- Password strength validation enforces minimum requirements.

**Sample Code**:
```ts
// lib/supabaseAuth.ts
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw new Error(error.message);
}
```
```tsx
// app/reset-password/page.tsx
'use client';
import { useSupabase } from '@/lib/supabase';
import { useState } from 'react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const supabase = useSupabase();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) console.error(error);
  };

  return (
    <form onSubmit={handleReset} className="space-y-4">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <button type="submit" className="button-primary">Reset Password</button>
    </form>
  );
}
```