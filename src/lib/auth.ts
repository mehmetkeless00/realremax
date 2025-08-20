import { supabase } from './supabase';
import { updateUserRole } from './database';

export interface AuthUser {
  id: string;
  email: string;
  role: 'visitor' | 'registered' | 'agent';
}

// Reset authentication state
export async function resetAuth() {
  try {
    // Clear all auth data
    await supabase.auth.signOut();

    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user-storage');
      sessionStorage.clear();
    }

    return { success: true };
  } catch (error) {
    console.error('Reset auth error:', error);
    return { success: false, error };
  }
}

// Email/Password Authentication
export async function signUpWithEmail(
  email: string,
  password: string,
  role: 'registered' | 'agent' = 'registered'
) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      throw new Error(authError.message);
    }

    // Supabase auth zaten kullanıcıyı oluşturuyor, ayrıca createUser çağırmaya gerek yok
    // RLS policies kullanıcı verilerini otomatik olarak yönetecek

    return authData;
  } catch (error) {
    console.error('Sign up error:', error);

    // Hata mesajını daha kullanıcı dostu hale getir
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred during sign up');
    }
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }

    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user-storage');
    }
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

// Social Authentication
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signInWithFacebook() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

// Password Reset
export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
  return data;
}

export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
  return data;
}

// User Management
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('Get current user error:', error);
      throw error;
    }

    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
}

export async function getCurrentSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Get current session error:', error);
      throw error;
    }

    return session;
  } catch (error) {
    console.error('Get current session error:', error);
    throw error;
  }
}

// Role Management
export async function updateUserRoleById(
  userId: string,
  role: 'visitor' | 'registered' | 'agent'
) {
  try {
    // Update role in our users table
    await updateUserRole(userId, role);

    // Update role in auth metadata
    const { data, error } = await supabase.auth.updateUser({
      data: { role },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update role error:', error);
    throw error;
  }
}

// Auth State Change Listener
export function onAuthStateChange(
  callback: (event: string, session: unknown) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

// Email Verification
export async function resendVerificationEmail(email: string) {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}
