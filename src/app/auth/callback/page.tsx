'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { createUser } from '@/lib/database';

export default function AuthCallback() {
  const router = useRouter();
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          setMessage('Authentication failed. Please try again.');
          setTimeout(() => router.push('/auth/signin'), 3000);
          return;
        }

        if (data.session?.user) {
          const user = data.session.user;

          // Check if user exists in our users table
          try {
            const { data: existingUser } = await supabase
              .from('users')
              .select('*')
              .eq('id', user.id)
              .single();

            if (!existingUser) {
              // Create user record if it doesn't exist
              await createUser(user.email!, 'registered');
            }
          } catch (dbError) {
            console.error('Database error:', dbError);
            // Continue anyway - user can be created later
          }

          setMessage('Authentication successful! Redirecting...');
          setTimeout(() => router.push('/dashboard'), 1500);
        } else {
          setMessage('No session found. Redirecting to sign in...');
          setTimeout(() => router.push('/auth/signin'), 2000);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setMessage('An unexpected error occurred. Please try again.');
        setTimeout(() => router.push('/auth/signin'), 3000);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Authentication
          </h2>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>

        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
        </div>
      </div>
    </div>
  );
}
