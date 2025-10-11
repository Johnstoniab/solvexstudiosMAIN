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
          status: string
          approved_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone?: string | null
          company?: string | null
          reason: string
          status?: string
          approved_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          company?: string | null
          reason?: string
          status?: string
          approved_by?: string | null
          created_at?: string
          updated_at?: string
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
          status: string
          customer_info: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          rental_id?: string | null
          booking_type: string
          start_date: string
          end_date?: string | null
          total_price: number
          status?: string
          customer_info?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          rental_id?: string | null
          booking_type?: string
          start_date?: string
          end_date?: string | null
          total_price?: number
          status?: string
          customer_info?: any
          created_at?: string
          updated_at?: string
        }
      }
      career_applications: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          position: string
          experience_years: number
          portfolio_url: string | null
          cover_letter: string | null
          resume_url: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone?: string | null
          position: string
          experience_years?: number
          portfolio_url?: string | null
          cover_letter?: string | null
          resume_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          position?: string
          experience_years?: number
          portfolio_url?: string | null
          cover_letter?: string | null
          resume_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          company: string | null
          industry: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          company?: string | null
          industry?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company?: string | null
          industry?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
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
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject?: string | null
          message: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string | null
          message?: string
          status?: string
          created_at?: string
        }
      }
      members: {
        Row: {
          id: string
          team_id: string | null
          profile_id: string | null
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          team_id?: string | null
          profile_id?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string | null
          profile_id?: string | null
          role?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          request_id: string | null
          sender_id: string | null
          content: string
          attachments: any
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          request_id?: string | null
          sender_id?: string | null
          content: string
          attachments?: any
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string | null
          sender_id?: string | null
          content?: string
          attachments?: any
          is_read?: boolean
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          client_id: string | null
          title: string
          description: string | null
          status: string
          priority: string
          budget: number | null
          start_date: string | null
          end_date: string | null
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          title: string
          description?: string | null
          status?: string
          priority?: string
          budget?: number | null
          start_date?: string | null
          end_date?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          title?: string
          description?: string | null
          status?: string
          priority?: string
          budget?: number | null
          start_date?: string | null
          end_date?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      rentals: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          price: number
          duration: string
          image: string | null
          specs: any
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          price: number
          duration?: string
          image?: string | null
          specs?: any
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          price?: number
          duration?: string
          image?: string | null
          specs?: any
          is_available?: boolean
          created_at?: string
          updated_at?: string
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
          status: string
          priority: string
          attachments: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          project_id?: string | null
          type: string
          title: string
          description?: string | null
          status?: string
          priority?: string
          attachments?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          project_id?: string | null
          type?: string
          title?: string
          description?: string | null
          status?: string
          priority?: string
          attachments?: any
          created_at?: string
          updated_at?: string
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
          status: string
          is_deleted: boolean
          deleted_at: string | null
          image_fit: string
          image_position: string
          created_at: string
          updated_at: string
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
          status?: string
          is_deleted?: boolean
          deleted_at?: string | null
          image_fit?: string
          image_position?: string
          created_at?: string
          updated_at?: string
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
          status?: string
          is_deleted?: boolean
          deleted_at?: string | null
          image_fit?: string
          image_position?: string
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rental_equipment: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          price: number
          duration: string
          image: string | null
          specs: any
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          price: number
          duration?: string
          image?: string | null
          specs?: any
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          price?: number
          duration?: string
          image?: string | null
          specs?: any
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      service_requests: {
        Row: {
          id: string
          client_id: string | null
          project_id: string | null
          type: string
          title: string
          description: string | null
          status: string
          priority: string
          attachments: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          project_id?: string | null
          type: string
          title: string
          description?: string | null
          status?: string
          priority?: string
          attachments?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          project_id?: string | null
          type?: string
          title?: string
          description?: string | null
          status?: string
          priority?: string
          attachments?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
