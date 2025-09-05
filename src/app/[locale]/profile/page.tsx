import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ProfileForm from '@/components/ProfileForm';

export default async function ProfilePage() {
  const cookieStore = await cookies();

  // Check if Supabase environment variables are available
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.warn(
      'Supabase environment variables not found. Redirecting to signin.'
    );
    redirect('/auth/signin');
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      redirect('/auth/signin');
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-8 border-b border-gray-200">
              <h1 className="text-lg font-bold text-dark-charcoal">
                Profile Settings
              </h1>
              <p className="mt-2 text-muted">
                Manage your account settings and preferences.
              </p>
            </div>

            <div className="px-6 py-8">
              <ProfileForm user={user} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Profile page error:', error);
    redirect('/auth/signin');
  }
}
