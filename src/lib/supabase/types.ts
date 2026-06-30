// Reflète les migrations SQL dans supabase/migrations. À régénérer avec
// `supabase gen types typescript` une fois le projet Supabase connecté.

export type UserRole = "owner" | "admin" | "manager" | "member";
export type ProjectStatus = "planifie" | "en_cours" | "en_pause" | "termine" | "annule";
export type PersonnelStatus = "actif" | "inactif";
export type PurchaseOrderStatus = "brouillon" | "envoyee" | "recue" | "annulee";

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          rccm: string | null;
          id_national: string | null;
          n_impot: string | null;
          tva: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          logo_url: string | null;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          rccm?: string | null;
          id_national?: string | null;
          n_impot?: string | null;
          tva?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          logo_url?: string | null;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          rccm?: string | null;
          id_national?: string | null;
          n_impot?: string | null;
          tva?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          logo_url?: string | null;
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          company_id: string | null;
          full_name: string | null;
          email: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          company_id?: string | null;
          full_name?: string | null;
          email?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string | null;
          full_name?: string | null;
          email?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          client_name: string | null;
          address: string | null;
          status: ProjectStatus;
          progress_percent: number;
          budget: number | null;
          start_date: string | null;
          end_date: string | null;
          description: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          client_name?: string | null;
          address?: string | null;
          status?: ProjectStatus;
          progress_percent?: number;
          budget?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          description?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          client_name?: string | null;
          address?: string | null;
          status?: ProjectStatus;
          progress_percent?: number;
          budget?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          description?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      personnel: {
        Row: {
          id: string;
          company_id: string;
          full_name: string;
          role: string | null;
          phone: string | null;
          email: string | null;
          daily_rate: number | null;
          project_id: string | null;
          status: PersonnelStatus;
          hire_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          full_name: string;
          role?: string | null;
          phone?: string | null;
          email?: string | null;
          daily_rate?: number | null;
          project_id?: string | null;
          status?: PersonnelStatus;
          hire_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          full_name?: string;
          role?: string | null;
          phone?: string | null;
          email?: string | null;
          daily_rate?: number | null;
          project_id?: string | null;
          status?: PersonnelStatus;
          hire_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "personnel_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      materials: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          unit: string;
          quantity: number;
          unit_price: number | null;
          min_stock: number | null;
          project_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          unit: string;
          quantity?: number;
          unit_price?: number | null;
          min_stock?: number | null;
          project_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          unit?: string;
          quantity?: number;
          unit_price?: number | null;
          min_stock?: number | null;
          project_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "materials_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      suppliers: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          contact_name: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          contact_name?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          contact_name?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      purchase_orders: {
        Row: {
          id: string;
          company_id: string;
          supplier_id: string | null;
          project_id: string | null;
          reference: string | null;
          status: PurchaseOrderStatus;
          order_date: string;
          total_amount: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          supplier_id?: string | null;
          project_id?: string | null;
          reference?: string | null;
          status?: PurchaseOrderStatus;
          order_date?: string;
          total_amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          supplier_id?: string | null;
          project_id?: string | null;
          reference?: string | null;
          status?: PurchaseOrderStatus;
          order_date?: string;
          total_amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey";
            columns: ["supplier_id"];
            isOneToOne: false;
            referencedRelation: "suppliers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "purchase_orders_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_company_id: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      project_status: ProjectStatus;
      personnel_status: PersonnelStatus;
      purchase_order_status: PurchaseOrderStatus;
    };
  };
};
