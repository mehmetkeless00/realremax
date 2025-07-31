'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  role: 'visitor' | 'registered' | 'agent';
  name?: string;
  phone?: string;
  company?: string;
  license_number?: string;
}

interface UserState {
  // Auth state
  user: User | null;
  session: unknown | null;
  isLoading: boolean;

  // User profile
  profile: UserProfile | null;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: unknown | null) => void;
  setLoading: (loading: boolean) => void;
  setProfile: (profile: UserProfile | null) => void;

  // Auth actions
  signIn: (user: User, session: unknown) => void;
  signOut: () => void;

  // Profile actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateRole: (role: 'visitor' | 'registered' | 'agent') => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      isLoading: false,
      profile: null,

      // Basic setters
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ isLoading: loading }),
      setProfile: (profile) => set({ profile }),

      // Auth actions
      signIn: (user, session) =>
        set({
          user,
          session,
          isLoading: false,
        }),

      signOut: () =>
        set({
          user: null,
          session: null,
          profile: null,
          isLoading: false,
        }),

      // Profile actions
      updateProfile: (updates) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: { ...currentProfile, ...updates },
          });
        }
      },

      updateRole: (role) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: { ...currentProfile, role },
          });
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        profile: state.profile,
      }),
    }
  )
);
