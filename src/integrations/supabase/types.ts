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
          user_id: string
          display_name: string | null
          email: string | null
          phone: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          organization: string | null
          role: 'individual' | 'ngo' | 'driver' | 'recycler' | 'admin' | 'moderator'
          email_notifications: boolean | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
      }
      ewaste_items: {
        Row: {
          id: string
          user_id: string
          item_name: string
          category: string
          brand: string | null
          model: string | null
          serial_number: string | null
          condition: 'working' | 'non-working' | 'damaged' | null
          estimated_value: string | null
          pickup_location: string | null
          status: 'pending' | 'approved' | 'collected' | 'processed' | 'completed' | 'rejected' | 'assigned' | 'in_transit' | 'arrived_facility'
          qr_code: string | null
          images: string[] | null
          description: string | null
          weight_kg: string | null
          submission_date: string | null
          collection_date: string | null
          processing_date: string | null
          carbon_credits_earned: string | null
          created_at: string
          updated_at: string
        }
      }
      organizations: { Row: { id: string; name: string; org_type: string; created_by: string | null; created_at: string; updated_at: string } }
      organization_members: { Row: { org_id: string; user_id: string; org_role: 'owner' | 'admin' | 'member' | 'driver'; joined_at: string } }
      driver_profiles: { Row: { user_id: string; license_number: string | null; vehicle_plate: string | null; vehicle_type: string | null; phone: string | null; created_at: string; updated_at: string } }
      ewaste_assignments: { Row: { id: string; item_id: string; assigned_to_user_id: string | null; assigned_to_org_id: string | null; assigned_by: string | null; status: 'pending' | 'active' | 'accepted' | 'rejected' | 'cancelled' | 'completed'; assigned_at: string; accepted_at: string | null; completed_at: string | null } }
      tracking_events: { Row: { id: string; item_id: string; event_type: 'created' | 'assigned' | 'pickup_started' | 'collected' | 'in_transit' | 'arrived_facility' | 'processed' | 'handoff' | 'cancelled' | 'approved' | 'rejected'; actor_user_id: string | null; actor_org_id: string | null; latitude: number | null; longitude: number | null; notes: string | null; meta: Json | null; created_at: string } }
      qr_tokens: { Row: { id: string; item_id: string; token: string; purpose: 'view' | 'handoff' | 'pickup' | 'process'; expires_at: string | null; used: boolean; created_by: string | null; created_at: string } }
      carbon_credits: { Row: { id: string; user_id: string; ewaste_item_id: string | null; credits_earned: string; credits_used: string | null; transaction_type: 'earned' | 'redeemed' | 'transferred'; description: string | null; created_at: string } }
      messages: { Row: { id: string; sender_id: string; recipient_id: string | null; subject: string; content: string; message_type: 'user' | 'admin' | 'system'; is_read: boolean | null; parent_message_id: string | null; attachments: string[] | null; priority: 'low' | 'normal' | 'high' | 'urgent'; created_at: string; updated_at: string } }
      campaigns: { Row: { id: string; title: string; description: string; target_amount: string | null; current_amount: string | null; start_date: string; end_date: string; status: 'draft' | 'active' | 'completed' | 'cancelled'; image_url: string | null; created_by: string | null; created_at: string; updated_at: string } }
      notifications: { Row: { id: string; user_id: string; title: string; message: string; type: 'info' | 'success' | 'warning' | 'error' | 'system'; is_read: boolean | null; action_url: string | null; created_at: string } }
      admin_logs: { Row: { id: string; admin_id: string; action: string; target_table: string | null; target_id: string | null; old_values: Json | null; new_values: Json | null; ip_address: string | null; user_agent: string | null; created_at: string } }
    }
    Functions: {
      assign_item: {
        Args: { p_item_id: string; p_driver_user_id?: string | null; p_org_id?: string | null }
        Returns: Database['public']['Tables']['ewaste_assignments']['Row']
      }
      record_tracking_event: {
        Args: { p_item_id: string; p_event: Database['public']['Tables']['tracking_events']['Row']['event_type']; p_lat?: number | null; p_lng?: number | null; p_notes?: string | null; p_meta?: Json | null }
        Returns: Database['public']['Tables']['tracking_events']['Row']
      }
      create_qr_token: {
        Args: { p_item_id: string; p_purpose: 'view' | 'handoff' | 'pickup' | 'process'; p_expires_minutes?: number }
        Returns: string
      }
    }
  }
}

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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          target_id: string | null
          target_table: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          created_at: string
          created_by: string | null
          current_amount: number | null
          description: string
          end_date: string
          id: string
          image_url: string | null
          start_date: string
          status: string | null
          target_amount: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_amount?: number | null
          description: string
          end_date: string
          id?: string
          image_url?: string | null
          start_date: string
          status?: string | null
          target_amount?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_amount?: number | null
          description?: string
          end_date?: string
          id?: string
          image_url?: string | null
          start_date?: string
          status?: string | null
          target_amount?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      carbon_credits: {
        Row: {
          created_at: string
          credits_earned: number
          credits_used: number | null
          description: string | null
          ewaste_item_id: string | null
          id: string
          transaction_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_earned: number
          credits_used?: number | null
          description?: string | null
          ewaste_item_id?: string | null
          id?: string
          transaction_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          credits_earned?: number
          credits_used?: number | null
          description?: string | null
          ewaste_item_id?: string | null
          id?: string
          transaction_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "carbon_credits_ewaste_item_id_fkey"
            columns: ["ewaste_item_id"]
            isOneToOne: false
            referencedRelation: "ewaste_items"
            referencedColumns: ["id"]
          },
        ]
      }
      ewaste_items: {
        Row: {
          brand: string | null
          carbon_credits_earned: number | null
          category: string
          collection_date: string | null
          condition: string | null
          created_at: string
          description: string | null
          estimated_value: number | null
          id: string
          images: string[] | null
          item_name: string
          model: string | null
          pickup_location: string | null
          processing_date: string | null
          qr_code: string | null
          serial_number: string | null
          status: string | null
          submission_date: string | null
          updated_at: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          brand?: string | null
          carbon_credits_earned?: number | null
          category: string
          collection_date?: string | null
          condition?: string | null
          created_at?: string
          description?: string | null
          estimated_value?: number | null
          id?: string
          images?: string[] | null
          item_name: string
          model?: string | null
          pickup_location?: string | null
          processing_date?: string | null
          qr_code?: string | null
          serial_number?: string | null
          status?: string | null
          submission_date?: string | null
          updated_at?: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          brand?: string | null
          carbon_credits_earned?: number | null
          category?: string
          collection_date?: string | null
          condition?: string | null
          created_at?: string
          description?: string | null
          estimated_value?: number | null
          id?: string
          images?: string[] | null
          item_name?: string
          model?: string | null
          pickup_location?: string | null
          processing_date?: string | null
          qr_code?: string | null
          serial_number?: string | null
          status?: string | null
          submission_date?: string | null
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachments: string[] | null
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          message_type: string | null
          parent_message_id: string | null
          priority: string | null
          recipient_id: string | null
          sender_id: string
          subject: string
          updated_at: string
        }
        Insert: {
          attachments?: string[] | null
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          parent_message_id?: string | null
          priority?: string | null
          recipient_id?: string | null
          sender_id: string
          subject: string
          updated_at?: string
        }
        Update: {
          attachments?: string[] | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          parent_message_id?: string | null
          priority?: string | null
          recipient_id?: string | null
          sender_id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string | null
          email_notifications: boolean | null
          id: string
          is_active: boolean | null
          location: string | null
          organization: string | null
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          email_notifications?: boolean | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          organization?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          email_notifications?: boolean | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          organization?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
