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
      background_checks: {
        Row: {
          check_type: string
          created_at: string | null
          expires_at: string | null
          id: string
          notes: string | null
          provider: string | null
          reference_number: string | null
          status: string | null
          worker_id: string | null
        }
        Insert: {
          check_type: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          provider?: string | null
          reference_number?: string | null
          status?: string | null
          worker_id?: string | null
        }
        Update: {
          check_type?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          provider?: string | null
          reference_number?: string | null
          status?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "background_checks_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          certification_name: string
          certification_number: string | null
          created_at: string | null
          document_url: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuing_authority: string
          updated_at: string | null
          verification_status: string | null
          worker_id: string | null
        }
        Insert: {
          certification_name: string
          certification_number?: string | null
          created_at?: string | null
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority: string
          updated_at?: string | null
          verification_status?: string | null
          worker_id?: string | null
        }
        Update: {
          certification_name?: string
          certification_number?: string | null
          created_at?: string | null
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string
          updated_at?: string | null
          verification_status?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certifications_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      client_profiles: {
        Row: {
          address: string | null
          city: string | null
          company_name: string | null
          created_at: string | null
          full_name: string
          id: string
          is_business_account: boolean | null
          phone: string | null
          updated_at: string | null
          user_id: string | null
          verification_status: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          is_business_account?: boolean | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          is_business_account?: boolean | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      identity_documents: {
        Row: {
          created_at: string | null
          document_number: string
          document_type: string
          document_url: string
          expires_at: string | null
          id: string
          selfie_url: string
          updated_at: string | null
          verification_notes: string | null
          verification_status: string | null
          verified_at: string | null
          worker_id: string | null
        }
        Insert: {
          created_at?: string | null
          document_number: string
          document_type: string
          document_url: string
          expires_at?: string | null
          id?: string
          selfie_url: string
          updated_at?: string | null
          verification_notes?: string | null
          verification_status?: string | null
          verified_at?: string | null
          worker_id?: string | null
        }
        Update: {
          created_at?: string | null
          document_number?: string
          document_type?: string
          document_url?: string
          expires_at?: string | null
          id?: string
          selfie_url?: string
          updated_at?: string | null
          verification_notes?: string | null
          verification_status?: string | null
          verified_at?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "identity_documents_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_policies: {
        Row: {
          coverage_amount: number | null
          created_at: string | null
          currency: string | null
          effective_date: string
          expiry_date: string
          id: string
          policy_document_url: string | null
          policy_number: string
          policy_type: string
          provider_name: string
          updated_at: string | null
          verification_status: string | null
          worker_id: string | null
        }
        Insert: {
          coverage_amount?: number | null
          created_at?: string | null
          currency?: string | null
          effective_date: string
          expiry_date: string
          id?: string
          policy_document_url?: string | null
          policy_number: string
          policy_type: string
          provider_name: string
          updated_at?: string | null
          verification_status?: string | null
          worker_id?: string | null
        }
        Update: {
          coverage_amount?: number | null
          created_at?: string | null
          currency?: string | null
          effective_date?: string
          expiry_date?: string
          id?: string
          policy_document_url?: string | null
          policy_number?: string
          policy_type?: string
          provider_name?: string
          updated_at?: string | null
          verification_status?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_policies_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          category: string
          client_id: string | null
          completed_date: string | null
          created_at: string | null
          currency: string | null
          description: string
          id: string
          location_address: string | null
          location_city: string | null
          payment_status: string | null
          scheduled_date: string | null
          status: string | null
          title: string
          updated_at: string | null
          worker_id: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          category: string
          client_id?: string | null
          completed_date?: string | null
          created_at?: string | null
          currency?: string | null
          description: string
          id?: string
          location_address?: string | null
          location_city?: string | null
          payment_status?: string | null
          scheduled_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          worker_id?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          category?: string
          client_id?: string | null
          completed_date?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string
          id?: string
          location_address?: string | null
          location_city?: string | null
          payment_status?: string | null
          scheduled_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
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
      reviews: {
        Row: {
          client_id: string | null
          communication_rating: number | null
          created_at: string | null
          helpful_votes: number | null
          id: string
          is_verified: boolean | null
          job_id: string | null
          photos: string[] | null
          professionalism_rating: number | null
          punctuality_rating: number | null
          quality_rating: number | null
          rating: number
          review_text: string | null
          updated_at: string | null
          worker_id: string | null
        }
        Insert: {
          client_id?: string | null
          communication_rating?: number | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          is_verified?: boolean | null
          job_id?: string | null
          photos?: string[] | null
          professionalism_rating?: number | null
          punctuality_rating?: number | null
          quality_rating?: number | null
          rating: number
          review_text?: string | null
          updated_at?: string | null
          worker_id?: string | null
        }
        Update: {
          client_id?: string | null
          communication_rating?: number | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          is_verified?: boolean | null
          job_id?: string | null
          photos?: string[] | null
          professionalism_rating?: number | null
          punctuality_rating?: number | null
          quality_rating?: number | null
          rating?: number
          review_text?: string | null
          updated_at?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_assessments: {
        Row: {
          assessment_notes: string | null
          assessment_type: string
          assessor_id: string | null
          assessor_type: string | null
          created_at: string | null
          evidence_urls: string[] | null
          id: string
          score: number | null
          skill_name: string
          verified_at: string | null
          worker_id: string | null
        }
        Insert: {
          assessment_notes?: string | null
          assessment_type: string
          assessor_id?: string | null
          assessor_type?: string | null
          created_at?: string | null
          evidence_urls?: string[] | null
          id?: string
          score?: number | null
          skill_name: string
          verified_at?: string | null
          worker_id?: string | null
        }
        Update: {
          assessment_notes?: string | null
          assessment_type?: string
          assessor_id?: string | null
          assessor_type?: string | null
          created_at?: string | null
          evidence_urls?: string[] | null
          id?: string
          score?: number | null
          skill_name?: string
          verified_at?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_assessments_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
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
      trust_scores: {
        Row: {
          average_rating: number | null
          completed_jobs: number | null
          created_at: string | null
          id: string
          identity_score: number | null
          last_calculated: string | null
          overall_score: number | null
          reliability_score: number | null
          reputation_score: number | null
          response_time_hours: number | null
          skill_score: number | null
          total_jobs: number | null
          updated_at: string | null
          worker_id: string | null
        }
        Insert: {
          average_rating?: number | null
          completed_jobs?: number | null
          created_at?: string | null
          id?: string
          identity_score?: number | null
          last_calculated?: string | null
          overall_score?: number | null
          reliability_score?: number | null
          reputation_score?: number | null
          response_time_hours?: number | null
          skill_score?: number | null
          total_jobs?: number | null
          updated_at?: string | null
          worker_id?: string | null
        }
        Update: {
          average_rating?: number | null
          completed_jobs?: number | null
          created_at?: string | null
          id?: string
          identity_score?: number | null
          last_calculated?: string | null
          overall_score?: number | null
          reliability_score?: number | null
          reputation_score?: number | null
          response_time_hours?: number | null
          skill_score?: number | null
          total_jobs?: number | null
          updated_at?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trust_scores_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: true
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
      calculate_trust_score: {
        Args: { worker_uuid: string }
        Returns: number
      }
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
