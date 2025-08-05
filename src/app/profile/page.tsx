import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ProfileForm from '@/components/ProfileForm';
import { BreadcrumbStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Profile | RealRemax',
  description:
    'Update your profile information and preferences. Manage your account settings and personal details.',
  keywords: [
    'profile',
    'account settings',
    'user profile',
    'personal information',
    'account management',
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfilePage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/signin');
  }

  const breadcrumbData = {
    items: [
      { name: 'Home', url: 'https://realremax-kvpi.vercel.app' },
      { name: 'Profile', url: 'https://realremax-kvpi.vercel.app/profile' },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <BreadcrumbStructuredData data={breadcrumbData} />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-dark-charcoal">
              Profile Settings
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your personal information and preferences
            </p>
          </div>

          <div className="px-6 py-8">
            <ProfileForm user={user} />
          </div>
        </div>
      </div>
    </main>
  );
}
