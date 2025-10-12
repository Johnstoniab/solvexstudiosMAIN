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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
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
          status?: string | null
          is_deleted?: boolean | null
          deleted_at?: string | null
          image_fit?: string | null
          image_position?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // ... other tables remain the same
    }
    // ... rest of the file remains the same
  }
}