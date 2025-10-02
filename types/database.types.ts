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
      members: {
        Row: {
          id: string
          user_id: string
          membership_tier: string
          status: string
          join_date: string
          benefits: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          membership_tier: string
          status?: string
          join_date?: string
          benefits?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          membership_tier?: string
          status?: string
          join_date?: string
          benefits?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          member_id: string
          event_name: string
          event_date: string
          quantity: number
          intent: 'swap' | 'donate'
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          member_id: string
          event_name: string
          event_date: string
          quantity: number
          intent: 'swap' | 'donate'
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          member_id?: string
          event_name?: string
          event_date?: string
          quantity?: number
          intent?: 'swap' | 'donate'
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      activity_log: {
        Row: {
          id: string
          member_id: string
          ticket_id: string | null
          action_type: string
          timestamp: string
        }
        Insert: {
          id?: string
          member_id: string
          ticket_id?: string | null
          action_type: string
          timestamp?: string
        }
        Update: {
          id?: string
          member_id?: string
          ticket_id?: string | null
          action_type?: string
          timestamp?: string
        }
      }
    }
  }
}
