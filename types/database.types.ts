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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          lang: string | null
          currency: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          lang?: string | null
          currency?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          lang?: string | null
          currency?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      income_sources: {
        Row: {
          id: string
          user_id: string | null
          name: string
          amount: number
          type: string | null
          frequency: string | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          amount: number
          type?: string | null
          frequency?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          amount?: number
          type?: string | null
          frequency?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string | null
          name: string
          amount: number
          category: string
          subcategory: string | null
          date: string | null
          is_recurring: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          amount: number
          category: string
          subcategory?: string | null
          date?: string | null
          is_recurring?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          amount?: number
          category?: string
          subcategory?: string | null
          date?: string | null
          is_recurring?: boolean | null
          created_at?: string | null
        }
      }
      budget_settings: {
        Row: {
          id: string
          user_id: string | null
          rule_type: string | null
          necessities_pct: number | null
          wants_pct: number | null
          savings_pct: number | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          rule_type?: string | null
          necessities_pct?: number | null
          wants_pct?: number | null
          savings_pct?: number | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          rule_type?: string | null
          necessities_pct?: number | null
          wants_pct?: number | null
          savings_pct?: number | null
          updated_at?: string | null
        }
      }
      emergency_fund: {
        Row: {
          id: string
          user_id: string | null
          current_amount: number | null
          target_months: number | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          current_amount?: number | null
          target_months?: number | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          current_amount?: number | null
          target_months?: number | null
          updated_at?: string | null
        }
      }
      investments: {
        Row: {
          id: string
          user_id: string | null
          name: string
          type: string
          initial_amount: number | null
          monthly_contribution: number | null
          annual_rate: number | null
          start_date: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          type: string
          initial_amount?: number | null
          monthly_contribution?: number | null
          annual_rate?: number | null
          start_date?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          type?: string
          initial_amount?: number | null
          monthly_contribution?: number | null
          annual_rate?: number | null
          start_date?: string | null
          created_at?: string | null
        }
      }
      chat_history: {
        Row: {
          id: string
          user_id: string | null
          role: string
          content: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          role: string
          content: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          role?: string
          content?: string
          created_at?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
