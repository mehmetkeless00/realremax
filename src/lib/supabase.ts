import { createClient } from '@supabase/supabase-js';

// Fallback values for development when environment variables are not set
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client with auth disabled for development if no valid credentials
const createSupabaseClient = () => {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.warn(
      'Supabase environment variables not found. Using mock mode for development.'
    );
    // Return a mock client for development
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'visitor' | 'registered' | 'agent';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: 'visitor' | 'registered' | 'agent';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'visitor' | 'registered' | 'agent';
          created_at?: string;
          updated_at?: string;
        };
      };
      agents: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string;
          license_number: string;
          company: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          phone: string;
          license_number: string;
          company: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          phone?: string;
          license_number?: string;
          company?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          price: number;
          location: string;
          type: string;
          bedrooms: number | null;
          bathrooms: number | null;
          size: number | null;
          year_built: number | null;
          agent_id: string | null;
          status: string;
          listing_type: string;
          amenities: string[] | null;
          photos: string[] | null;
          address: string | null;
          city: string | null;
          postal_code: string | null;
          country: string | null;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          price: number;
          location: string;
          type: string;
          bedrooms?: number | null;
          bathrooms?: number | null;
          size?: number | null;
          year_built?: number | null;
          agent_id?: string | null;
          status?: string;
          listing_type?: string;
          amenities?: string[] | null;
          photos?: string[] | null;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          country?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          price?: number;
          location?: string;
          type?: string;
          bedrooms?: number | null;
          bathrooms?: number | null;
          size?: number | null;
          year_built?: number | null;
          agent_id?: string | null;
          status?: string;
          listing_type?: string;
          amenities?: string[] | null;
          photos?: string[] | null;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          country?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          property_id: string;
          agent_id: string;
          listing_type: 'sale' | 'rent';
          price: number;
          status: 'active' | 'pending' | 'sold' | 'rented';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          agent_id: string;
          listing_type: 'sale' | 'rent';
          price: number;
          status?: 'active' | 'pending' | 'sold' | 'rented';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          agent_id?: string;
          listing_type?: 'sale' | 'rent';
          price?: number;
          status?: 'active' | 'pending' | 'sold' | 'rented';
          created_at?: string;
          updated_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          property_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string;
          created_at?: string;
        };
      };
    };
  };
}
