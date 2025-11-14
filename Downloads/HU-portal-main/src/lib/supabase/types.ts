export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          date: string
          time: string
          location: string
          banner_url: string | null
          created_by: string
          created_at: string
          updated_at: string
          is_published: boolean
          max_capacity: number | null
          requires_approval: boolean
          event_type: 'online' | 'offline' | 'hybrid'
          meeting_url: string | null
          address: string | null
          city: string | null
          country: string | null
          organizer_name: string | null
          organizer_email: string | null
          organizer_phone: string | null
          submission_type: 'authenticated' | 'public' | null
          status: 'draft' | 'pending' | 'approved' | 'rejected' | null
          image_url: string | null
          full_description: string | null
          start_date: string | null
          end_date: string | null
          location_type: string | null
          max_attendees: number | null
          venue_details: string | null
          requirements: string | null
          what_to_bring: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          date: string
          time: string
          location: string
          banner_url?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          is_published?: boolean
          max_capacity?: number | null
          requires_approval?: boolean
          event_type?: 'online' | 'offline' | 'hybrid'
          meeting_url?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          organizer_name?: string | null
          organizer_email?: string | null
          organizer_phone?: string | null
          submission_type?: 'authenticated' | 'public' | null
          status?: 'draft' | 'pending' | 'approved' | 'rejected' | null
          image_url?: string | null
          full_description?: string | null
          start_date?: string | null
          end_date?: string | null
          location_type?: string | null
          max_attendees?: number | null
          venue_details?: string | null
          requirements?: string | null
          what_to_bring?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          date?: string
          time?: string
          location?: string
          banner_url?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          is_published?: boolean
          max_capacity?: number | null
          requires_approval?: boolean
          event_type?: 'online' | 'offline' | 'hybrid'
          meeting_url?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          organizer_name?: string | null
          organizer_email?: string | null
          organizer_phone?: string | null
          submission_type?: 'authenticated' | 'public' | null
          status?: 'draft' | 'pending' | 'approved' | 'rejected' | null
          image_url?: string | null
          full_description?: string | null
          start_date?: string | null
          end_date?: string | null
          location_type?: string | null
          max_attendees?: number | null
          venue_details?: string | null
          requirements?: string | null
          what_to_bring?: string | null
        }
      }
      event_registrations: {
        Row: {
          id: string
          event_id: string
          user_id: string
          registered_at: string
          status: 'pending' | 'approved' | 'rejected' | 'waitlisted'
          checked_in: boolean
          checked_in_at: string | null
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          registered_at?: string
          status?: 'pending' | 'approved' | 'rejected' | 'waitlisted'
          checked_in?: boolean
          checked_in_at?: string | null
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          registered_at?: string
          status?: 'pending' | 'approved' | 'rejected' | 'waitlisted'
          checked_in?: boolean
          checked_in_at?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          name: string
          email: string
          skills: string[]
          college: string | null
          avatar_url: string | null
          bio: string | null
          linkedin_url: string | null
          github_url: string | null
          twitter_url: string | null
          website_url: string | null
          created_at: string
          updated_at: string
          is_organizer: boolean
        }
        Insert: {
          id: string
          name: string
          email: string
          skills?: string[]
          college?: string | null
          avatar_url?: string | null
          bio?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          twitter_url?: string | null
          website_url?: string | null
          created_at?: string
          updated_at?: string
          is_organizer?: boolean
        }
        Update: {
          id?: string
          name?: string
          email?: string
          skills?: string[]
          college?: string | null
          avatar_url?: string | null
          bio?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          twitter_url?: string | null
          website_url?: string | null
          created_at?: string
          updated_at?: string
          is_organizer?: boolean
        }
      }
      community_join_requests: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          created_at: string
          status: 'pending' | 'approved' | 'rejected'
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          created_at?: string
          status?: 'pending' | 'approved' | 'rejected'
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          created_at?: string
          status?: 'pending' | 'approved' | 'rejected'
          user_id?: string | null
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string
          featured_image: string | null
          author_id: string
          published: boolean
          created_at: string
          updated_at: string
          tags: string[]
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt: string
          featured_image?: string | null
          author_id: string
          published?: boolean
          created_at?: string
          updated_at?: string
          tags?: string[]
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string
          featured_image?: string | null
          author_id?: string
          published?: boolean
          created_at?: string
          updated_at?: string
          tags?: string[]
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Event = Tables<'events'>
export type EventRegistration = Tables<'event_registrations'>
export type UserProfile = Tables<'user_profiles'>
export type CommunityJoinRequest = Tables<'community_join_requests'>
export type BlogPost = Tables<'blog_posts'>