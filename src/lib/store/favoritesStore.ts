'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { useUIStore } from './uiStore';

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

interface FavoritesState {
  // State
  favorites: string[]; // Array of property IDs
  isLoading: boolean;
  isSyncing: boolean;
  isRealtimeEnabled: boolean; // Added

  // Actions
  addFavorite: (propertyId: string) => Promise<void>;
  removeFavorite: (propertyId: string) => Promise<void>;
  toggleFavorite: (propertyId: string) => Promise<void>;
  setFavorites: (propertyIds: string[]) => void;
  clearFavorites: () => void;

  // Sync actions
  syncFavorites: () => Promise<void>;
  loadFavorites: () => Promise<void>;

  // Real-time actions
  enableRealtime: () => Promise<void>; // Added
  disableRealtime: () => void; // Added
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      // Initial state
      favorites: [],
      isLoading: false,
      isSyncing: false,
      isRealtimeEnabled: false,

      // Basic actions
      addFavorite: async (propertyId: string) => {
        const { favorites } = get();
        if (favorites.includes(propertyId)) return;

        set((state) => ({
          favorites: [...state.favorites, propertyId],
        }));

        // Sync with Supabase if user is authenticated
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          try {
            const { error } = await supabase.from('favorites').insert({
              user_id: user.id,
              property_id: propertyId,
            });

            if (error) {
              console.error('Error adding favorite to database:', error);
              // Revert local state if database sync fails
              set((state) => ({
                favorites: state.favorites.filter((id) => id !== propertyId),
              }));
              throw error;
            }
          } catch (error) {
            console.error('Failed to sync favorite:', error);
            throw error;
          }
        }
      },

      removeFavorite: async (propertyId: string) => {
        const { favorites } = get();
        if (!favorites.includes(propertyId)) return;

        set((state) => ({
          favorites: state.favorites.filter((id) => id !== propertyId),
        }));

        // Sync with Supabase if user is authenticated
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          try {
            const { error } = await supabase
              .from('favorites')
              .delete()
              .eq('user_id', user.id)
              .eq('property_id', propertyId);

            if (error) {
              console.error('Error removing favorite from database:', error);
              // Revert local state if database sync fails
              set((state) => ({
                favorites: [...state.favorites, propertyId],
              }));
              throw error;
            }
          } catch (error) {
            console.error('Failed to sync favorite removal:', error);
            throw error;
          }
        }
      },

      toggleFavorite: async (propertyId: string) => {
        const { favorites } = get();
        const isFavorite = favorites.includes(propertyId);

        if (isFavorite) {
          await get().removeFavorite(propertyId);
        } else {
          await get().addFavorite(propertyId);
        }
      },

      setFavorites: (propertyIds: string[]) => {
        set({ favorites: propertyIds });
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },

      // Sync actions
      syncFavorites: async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        set({ isSyncing: true });

        try {
          // Get favorites from database
          const { data: favorites, error } = await supabase
            .from('favorites')
            .select('property_id')
            .eq('user_id', user.id);

          if (error) {
            console.error('Error syncing favorites:', error);
            throw error;
          }

          // Update local state
          const propertyIds = favorites.map((fav) => fav.property_id);
          set({ favorites: propertyIds });
        } catch (error) {
          console.error('Failed to sync favorites:', error);
          throw error;
        } finally {
          set({ isSyncing: false });
        }
      },

      loadFavorites: async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        set({ isLoading: true });

        try {
          const { data: favorites, error } = await supabase
            .from('favorites')
            .select('property_id')
            .eq('user_id', user.id);

          if (error) {
            console.error('Error loading favorites:', error);
            throw error;
          }

          const propertyIds = favorites.map((fav) => fav.property_id);
          set({ favorites: propertyIds });
        } catch (error) {
          console.error('Failed to load favorites:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Real-time actions
      enableRealtime: async () => {
        set({ isRealtimeEnabled: true });
        // TODO: Implement real-time subscription logic
      },

      disableRealtime: () => {
        set({ isRealtimeEnabled: false });
        // TODO: Cleanup real-time subscription
      },
    }),
    {
      name: 'favorites-storage',
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);
