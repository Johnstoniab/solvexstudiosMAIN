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
      access_requests: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          company: string | null
          reason: string
          status: string | null
          approved_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone?: string | null
          company?: string | null
          reason: string
          status?: string | null
          approved_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          company?: string | null
          reason?: string
          status?: string | null
          approved_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string | null
          rental_id: string | null
          booking_type: string
          start_date: string
          end_date: string | null
          total_price: number
          status: string | null
          customer_info: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          rental_id?: string | null
          booking_type: string
          start_date: string
          end_date?: string | null
          total_price: number
          status?: string | null
          customer_info?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          rental_id?: string | null
          booking_type?: string
          start_date?: string
          end_date?: string | null
          total_price?: number
          status?: string | null
          customer_info?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      career_applications: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          position: string
          experience_years: number | null
          portfolio_url: string | null
          cover_letter: string | null
          resume_url: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone?: string | null
          position: string
          experience_years?: number | null
          portfolio_url?: string | null
          cover_letter?: string | null
          resume_url?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          position?: string
          experience_years?: number | null
          portfolio_url?: string | null
          cover_letter?: string | null
          resume_url?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      clients: {
        Row: {
          id: string
          company: string | null
          industry: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          company?: string | null
          industry?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          company?: string | null
          industry?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string | null
          message: string
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject?: string | null
          message: string
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string | null
          message?: string
          status?: string | null
          created_at?: string | null
        }
      }
      members: {
        Row: {
          id: string
          team_id: string | null
          profile_id: string | null
          role: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          team_id?: string | null
          profile_id?: string | null
          role?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          team_id?: string | null
          profile_id?: string | null
          role?: string | null
          created_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          request_id: string | null
          sender_id: string | null
          content: string
          attachments: Json | null
          is_read: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          request_id?: string | null
          sender_id?: string | null
          content: string
          attachments?: Json | null
          is_read?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          request_id?: string | null
          sender_id?: string | null
          content?: string
          attachments?: Json | null
          is_read?: boolean | null
          created_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          client_id: string | null
          title: string
          description: string | null
          status: string | null
          priority: string | null
          budget: number | null
          start_date: string | null
          end_date: string | null
          metadata: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          client_id?: string | null
          title: string
          description?: string | null
          status?: string | null
          priority?: string | null
          budget?: number | null
          start_date?: string | null
          end_date?: string | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string | null
          title?: string
          description?: string | null
          status?: string | null
          priority?: string | null
          budget?: number | null
          start_date?: string | null
          end_date?: string | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      rentals: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          price: number
          duration: string | null
          image: string | null
          specs: Json | null
          is_available: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          price: number
          duration?: string | null
          image?: string | null
          specs?: Json | null
          is_available?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          price?: number
          duration?: string | null
          image?: string | null
          specs?: Json | null
          is_available?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      requests: {
        Row: {
          id: string
          client_id: string | null
          project_id: string | null
          type: string
          title: string
          description: string | null
          status: string | null
          priority: string | null
          attachments: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          client_id?: string | null
          project_id?: string | null
          type: string
          title: string
          description?: string | null
          status?: string | null
          priority?: string | null
          attachments?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string | null
          project_id?: string | null
          type?: string
          title?: string
          description?: string | null
          status?: string | null
          priority?: string | null
          attachments?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      services: {
        Row: {
          id: string
          title: string
          summary: string | null
          image_url: string | null
          title_color: string | null
          description: string | null
          sub_services: string[] | null
          outcome: string | null
          status: string | null
          is_deleted: boolean | null
          deleted_at: string | null
          image_fit: string | null
          image_position: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          title: string
          summary?: string | null
          image_url?: string | null
          title_color?: string | null
          description?: string | null
          sub_services?: string[] | null
          outcome?: string | null
          status?: string | null
          is_deleted?: boolean | null
          deleted_at?: string | null
          image_fit?: string | null
          image_position?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          summary?: string | null
          image_url?: string | null
          title_color?: string | null
          description?: string | null
          sub_services?: string[] | null
          outcome?: string | null
          status?: string | null
          is_deleted?: boolean | null
          deleted_at?: string | null
          image_fit?: string | null
          image_position?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_: string]: never
    }
    Functions: {
      [_: string]: never
    }
    Enums: {
      [_: string]: never
    }
  }
}
