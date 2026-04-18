export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          active: boolean
          body: string | null
          created_at: string
          ends_at: string | null
          id: string
          starts_at: string
          title: string
          variant: string
        }
        Insert: {
          active?: boolean
          body?: string | null
          created_at?: string
          ends_at?: string | null
          id?: string
          starts_at?: string
          title: string
          variant?: string
        }
        Update: {
          active?: boolean
          body?: string | null
          created_at?: string
          ends_at?: string | null
          id?: string
          starts_at?: string
          title?: string
          variant?: string
        }
        Relationships: []
      }
      bundles: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          items: Json
          name: string
          original_price: number
          price: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          items?: Json
          name: string
          original_price?: number
          price?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          items?: Json
          name?: string
          original_price?: number
          price?: number
        }
        Relationships: []
      }
      coupon_redemptions: {
        Row: {
          coupon_id: string
          created_at: string
          id: string
          invoice_id: string | null
          username: string
        }
        Insert: {
          coupon_id: string
          created_at?: string
          id?: string
          invoice_id?: string | null
          username: string
        }
        Update: {
          coupon_id?: string
          created_at?: string
          id?: string
          invoice_id?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          max_uses: number | null
          used_count: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          used_count?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          used_count?: number
        }
        Relationships: []
      }
      daily_rewards: {
        Row: {
          amount: number
          claimed_at: string
          id: string
          reward_type: string
          username: string
        }
        Insert: {
          amount?: number
          claimed_at?: string
          id?: string
          reward_type?: string
          username: string
        }
        Update: {
          amount?: number
          claimed_at?: string
          id?: string
          reward_type?: string
          username?: string
        }
        Relationships: []
      }
      flash_sales: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          discount_percent: number
          ends_at: string
          id: string
          starts_at: string
          title: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          discount_percent?: number
          ends_at: string
          id?: string
          starts_at?: string
          title: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          discount_percent?: number
          ends_at?: string
          id?: string
          starts_at?: string
          title?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          created_at: string
          id: string
          invoice_no: number
          items: Json
          status: string
          ticket_id: string | null
          total: number
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          invoice_no?: number
          items?: Json
          status?: string
          ticket_id?: string | null
          total?: number
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          invoice_no?: number
          items?: Json
          status?: string
          ticket_id?: string | null
          total?: number
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_ledger: {
        Row: {
          created_at: string
          id: string
          invoice_id: string | null
          points: number
          reason: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          invoice_id?: string | null
          points: number
          reason: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          invoice_id?: string | null
          points?: number
          reason?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_ledger_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          loyalty_points: number
          referral_code: string | null
          referred_by: string | null
          total_spent: number
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          loyalty_points?: number
          referral_code?: string | null
          referred_by?: string | null
          total_spent?: number
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          loyalty_points?: number
          referral_code?: string | null
          referred_by?: string | null
          total_spent?: number
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referred_username: string
          referrer_username: string
          reward_granted: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          referred_username: string
          referrer_username: string
          reward_granted?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          referred_username?: string
          referrer_username?: string
          reward_granted?: boolean
        }
        Relationships: []
      }
      store_config: {
        Row: {
          data: Json
          id: number
          updated_at: string
        }
        Insert: {
          data?: Json
          id?: number
          updated_at?: string
        }
        Update: {
          data?: Json
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      ticket_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          file_url: string
          id: string
          mime_type: string | null
          reply_id: string | null
          ticket_id: string | null
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number
          file_url: string
          id?: string
          mime_type?: string | null
          reply_id?: string | null
          ticket_id?: string | null
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          file_url?: string
          id?: string
          mime_type?: string | null
          reply_id?: string | null
          ticket_id?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_attachments_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "ticket_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_replies: {
        Row: {
          author_name: string
          author_type: string
          created_at: string
          id: string
          message: string
          ticket_id: string
        }
        Insert: {
          author_name: string
          author_type: string
          created_at?: string
          id?: string
          message: string
          ticket_id: string
        }
        Update: {
          author_name?: string
          author_type?: string
          created_at?: string
          id?: string
          message?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_replies_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          admin_notes: string | null
          category: string
          contact: string | null
          created_at: string
          description: string
          id: string
          priority: string
          status: string
          subject: string
          ticket_no: number
          updated_at: string
          username: string
        }
        Insert: {
          admin_notes?: string | null
          category: string
          contact?: string | null
          created_at?: string
          description: string
          id?: string
          priority?: string
          status?: string
          subject: string
          ticket_no?: number
          updated_at?: string
          username: string
        }
        Update: {
          admin_notes?: string | null
          category?: string
          contact?: string | null
          created_at?: string
          description?: string
          id?: string
          priority?: string
          status?: string
          subject?: string
          ticket_no?: number
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_name: string
          item_price: number
          item_type: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_name: string
          item_price?: number
          item_type: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_name?: string
          item_price?: number
          item_type?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
