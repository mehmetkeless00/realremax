### Task: Implement Supabase Auth for Email and Social Login

**Description**: Set up Supabase Auth for email/password and Google/Facebook social logins, including email verification.

**PDR Reference**: Supabase Auth

**Dependencies**: Supabase project setup

**Estimated Effort**: 8 hours

**Acceptance Criteria**:
- Users can register/login with email/password or Google/Facebook.
- Email verification is required for account activation.
- JWT tokens are issued and stored securely.
- User roles (visitor, registered, agent) are assigned.

**Sample Code**:
```ts
// lib/supabaseAuth.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function signUpWithEmail(email: string, password: string, role: 'user' | 'agent') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role } },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw new Error(error.message);
  return data;
}
```