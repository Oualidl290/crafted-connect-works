export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      phone_verifications: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          otp_code: string
          phone: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          otp_code: string
          phone: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          otp_code?: string
          phone?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      skill_proofs: {
        Row: {
          created_at: string
          description: string | null
          document_url: string
          id: string
          proof_type: Database["public"]["Enums"]["skill_proof_type"]
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          worker_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_url: string
          id?: string
          proof_type: Database["public"]["Enums"]["skill_proof_type"]
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          worker_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_url?: string
          id?: string
          proof_type?: Database["public"]["Enums"]["skill_proof_type"]
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_proofs_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      workers: {
        Row: {
          bio: string | null
          city: string | null
          created_at: string
          facebook_reviews_url: string | null
          full_name: string
          google_my_business_url: string | null
          id: string
          id_document_url: string | null
          identity_verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          identity_verified: boolean | null
          is_licensed: boolean | null
          job_count: number | null
          phone: string
          profile_image_url: string | null
          selfie_url: string | null
          telegram_link: string | null
          trade: string | null
          trusted_by_locals: boolean | null
          updated_at: string
          user_id: string
          whatsapp_link: string | null
          yelp_url: string | null
        }
        Insert: {
          bio?: string | null
          city?: string | null
          created_at?: string
          facebook_reviews_url?: string | null
          full_name: string
          google_my_business_url?: string | null
          id?: string
          id_document_url?: string | null
          identity_verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          identity_verified?: boolean | null
          is_licensed?: boolean | null
          job_count?: number | null
          phone: string
          profile_image_url?: string | null
          selfie_url?: string | null
          telegram_link?: string | null
          trade?: string | null
          trusted_by_locals?: boolean | null
          updated_at?: string
          user_id: string
          whatsapp_link?: string | null
          yelp_url?: string | null
        }
        Update: {
          bio?: string | null
          city?: string | null
          created_at?: string
          facebook_reviews_url?: string | null
          full_name?: string
          google_my_business_url?: string | null
          id?: string
          id_document_url?: string | null
          identity_verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          identity_verified?: boolean | null
          is_licensed?: boolean | null
          job_count?: number | null
          phone?: string
          profile_image_url?: string | null
          selfie_url?: string | null
          telegram_link?: string | null
          trade?: string | null
          trusted_by_locals?: boolean | null
          updated_at?: string
          user_id?: string
          whatsapp_link?: string | null
          yelp_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_otps: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      skill_proof_type:
        | "certificate"
        | "license"
        | "work_photo"
        | "work_pdf"
        | "testimonial"
      verification_status: "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      skill_proof_type: [
        "certificate",
        "license",
        "work_photo",
        "work_pdf",
        "testimonial",
      ],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
