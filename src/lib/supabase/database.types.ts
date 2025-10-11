// FILE: src/lib/supabase/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: { id: string };
        Insert: { id: string };
        Update: { id?: string };
      };
      services: {
        Row: {
          id: number;
          title: string;
          slug: string;
          description: string | null;
          image_path: string | null;
          price: number;
          status: "draft" | "published";
          order: number;
          created_by: string | null;
          inserted_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          slug: string;
          description?: string | null;
          image_path?: string | null;
          price?: number;
          status?: "draft" | "published";
          order?: number;
          created_by?: string | null;
          inserted_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          slug?: string;
          description?: string | null;
          image_path?: string | null;
          price?: number;
          status?: "draft" | "published";
          order?: number;
          created_by?: string | null;
          inserted_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}