import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
