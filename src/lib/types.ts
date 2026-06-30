import type {
  Database,
  UserRole,
  ProjectStatus,
  PersonnelStatus,
  PurchaseOrderStatus,
} from "@/lib/supabase/types";

export type { UserRole, ProjectStatus, PersonnelStatus, PurchaseOrderStatus };
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Personnel = Database["public"]["Tables"]["personnel"]["Row"];
export type Material = Database["public"]["Tables"]["materials"]["Row"];
export type Supplier = Database["public"]["Tables"]["suppliers"]["Row"];
export type PurchaseOrder = Database["public"]["Tables"]["purchase_orders"]["Row"];
