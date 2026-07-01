// Reflète les migrations SQL dans supabase/migrations. À régénérer avec
// `supabase gen types typescript` une fois le projet Supabase connecté.

export type UserRole = "owner" | "admin" | "manager" | "member";
export type ProjectStatus = "planifie" | "en_cours" | "en_pause" | "termine" | "annule";
export type PersonnelStatus = "actif" | "inactif";
export type PurchaseOrderStatus = "brouillon" | "envoyee" | "recue" | "annulee";
export type InvoiceType = "facture" | "devis";
export type InvoiceStatus = "brouillon" | "envoyee" | "payee" | "annulee";
export type TaskStatus = "a_faire" | "en_cours" | "en_revision" | "termine" | "annule";
export type TaskPriority = "basse" | "normale" | "haute" | "urgente";
export type MovementType = "entree" | "sortie" | "ajustement";

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
          is_active: boolean;
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
          is_active?: boolean;
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
          is_active?: boolean;
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
          is_superadmin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          company_id?: string | null;
          full_name?: string | null;
          email?: string | null;
          role?: UserRole;
          is_superadmin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string | null;
          full_name?: string | null;
          email?: string | null;
          role?: UserRole;
          is_superadmin?: boolean;
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
      documents: {
        Row: {
          id: string;
          company_id: string;
          project_id: string | null;
          name: string;
          file_path: string;
          file_size: number | null;
          mime_type: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          project_id?: string | null;
          name: string;
          file_path: string;
          file_size?: number | null;
          mime_type?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          project_id?: string | null;
          name?: string;
          file_path?: string;
          file_size?: number | null;
          mime_type?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      invoices: {
        Row: {
          id: string;
          company_id: string;
          project_id: string | null;
          invoice_number: string | null;
          type: InvoiceType;
          status: InvoiceStatus;
          client_name: string | null;
          client_address: string | null;
          client_phone: string | null;
          client_email: string | null;
          client_rccm: string | null;
          issue_date: string;
          due_date: string | null;
          subtotal: number;
          tax_rate: number;
          tax_amount: number;
          total: number;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          project_id?: string | null;
          invoice_number?: string | null;
          type?: InvoiceType;
          status?: InvoiceStatus;
          client_name?: string | null;
          client_address?: string | null;
          client_phone?: string | null;
          client_email?: string | null;
          client_rccm?: string | null;
          issue_date?: string;
          due_date?: string | null;
          subtotal?: number;
          tax_rate?: number;
          tax_amount?: number;
          total?: number;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          project_id?: string | null;
          invoice_number?: string | null;
          type?: InvoiceType;
          status?: InvoiceStatus;
          client_name?: string | null;
          client_address?: string | null;
          client_phone?: string | null;
          client_email?: string | null;
          client_rccm?: string | null;
          issue_date?: string;
          due_date?: string | null;
          subtotal?: number;
          tax_rate?: number;
          tax_amount?: number;
          total?: number;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          description: string;
          quantity: number;
          unit: string | null;
          unit_price: number;
          total: number;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          description: string;
          quantity?: number;
          unit?: string | null;
          unit_price?: number;
          total?: number;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          description?: string;
          quantity?: number;
          unit?: string | null;
          unit_price?: number;
          total?: number;
        };
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
        ];
      };
      project_tasks: {
        Row: {
          id: string;
          project_id: string;
          company_id: string;
          title: string;
          description: string | null;
          assignee_id: string | null;
          status: TaskStatus;
          priority: TaskPriority;
          due_date: string | null;
          completed_at: string | null;
          sort_order: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          company_id: string;
          title: string;
          description?: string | null;
          assignee_id?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          due_date?: string | null;
          completed_at?: string | null;
          sort_order?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          company_id?: string;
          title?: string;
          description?: string | null;
          assignee_id?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          due_date?: string | null;
          completed_at?: string | null;
          sort_order?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_tasks_assignee_id_fkey";
            columns: ["assignee_id"];
            isOneToOne: false;
            referencedRelation: "personnel";
            referencedColumns: ["id"];
          },
        ];
      };
      project_milestones: {
        Row: {
          id: string;
          project_id: string;
          company_id: string;
          title: string;
          due_date: string;
          completed_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          company_id: string;
          title: string;
          due_date: string;
          completed_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          company_id?: string;
          title?: string;
          due_date?: string;
          completed_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      time_entries: {
        Row: {
          id: string;
          company_id: string;
          personnel_id: string;
          project_id: string | null;
          task_id: string | null;
          entry_date: string;
          hours: number;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          personnel_id: string;
          project_id?: string | null;
          task_id?: string | null;
          entry_date?: string;
          hours: number;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          personnel_id?: string;
          project_id?: string | null;
          task_id?: string | null;
          entry_date?: string;
          hours?: number;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "time_entries_personnel_id_fkey";
            columns: ["personnel_id"];
            isOneToOne: false;
            referencedRelation: "personnel";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "time_entries_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      material_movements: {
        Row: {
          id: string;
          company_id: string;
          material_id: string;
          project_id: string | null;
          movement_type: MovementType;
          quantity: number;
          unit_price: number | null;
          reference: string | null;
          notes: string | null;
          movement_date: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          material_id: string;
          project_id?: string | null;
          movement_type: MovementType;
          quantity: number;
          unit_price?: number | null;
          reference?: string | null;
          notes?: string | null;
          movement_date?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          material_id?: string;
          project_id?: string | null;
          movement_type?: MovementType;
          quantity?: number;
          unit_price?: number | null;
          reference?: string | null;
          notes?: string | null;
          movement_date?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "material_movements_material_id_fkey";
            columns: ["material_id"];
            isOneToOne: false;
            referencedRelation: "materials";
            referencedColumns: ["id"];
          },
        ];
      };
      purchase_order_items: {
        Row: {
          id: string;
          purchase_order_id: string;
          description: string;
          quantity: number;
          unit: string | null;
          unit_price: number;
          total: number;
          sort_order: number;
        };
        Insert: {
          id?: string;
          purchase_order_id: string;
          description: string;
          quantity?: number;
          unit?: string | null;
          unit_price?: number;
          sort_order?: number;
        };
        Update: {
          id?: string;
          purchase_order_id?: string;
          description?: string;
          quantity?: number;
          unit?: string | null;
          unit_price?: number;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey";
            columns: ["purchase_order_id"];
            isOneToOne: false;
            referencedRelation: "purchase_orders";
            referencedColumns: ["id"];
          },
        ];
      };
      progress_reports: {
        Row: {
          id: string;
          project_id: string;
          company_id: string;
          report_date: string;
          reporter_id: string | null;
          overall_percent: number;
          summary: string;
          problems: string | null;
          next_steps: string | null;
          weather: string | null;
          workers_present: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          company_id: string;
          report_date?: string;
          reporter_id?: string | null;
          overall_percent?: number;
          summary: string;
          problems?: string | null;
          next_steps?: string | null;
          weather?: string | null;
          workers_present?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          company_id?: string;
          report_date?: string;
          reporter_id?: string | null;
          overall_percent?: number;
          summary?: string;
          problems?: string | null;
          next_steps?: string | null;
          weather?: string | null;
          workers_present?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "progress_reports_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      admin_audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          target_type: string | null;
          target_id: string | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          target_type?: string | null;
          target_id?: string | null;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          target_type?: string | null;
          target_id?: string | null;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      system_settings: {
        Row: {
          key: string;
          value: string | null;
          description: string | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: string | null;
          description?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: string | null;
          description?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "system_settings_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
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
      invoice_type: InvoiceType;
      invoice_status: InvoiceStatus;
      task_status: TaskStatus;
      task_priority: TaskPriority;
      movement_type: MovementType;
    };
  };
};
