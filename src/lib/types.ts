import type {
  Database,
  UserRole,
  ProjectStatus,
  PersonnelStatus,
  PurchaseOrderStatus,
  InvoiceType,
  InvoiceStatus,
  TaskStatus,
  TaskPriority,
  MovementType,
} from "@/lib/supabase/types";

export type {
  UserRole,
  ProjectStatus,
  PersonnelStatus,
  PurchaseOrderStatus,
  InvoiceType,
  InvoiceStatus,
  TaskStatus,
  TaskPriority,
  MovementType,
};
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Personnel = Database["public"]["Tables"]["personnel"]["Row"];
export type Material = Database["public"]["Tables"]["materials"]["Row"];
export type Supplier = Database["public"]["Tables"]["suppliers"]["Row"];
export type PurchaseOrder = Database["public"]["Tables"]["purchase_orders"]["Row"];
export type Document = Database["public"]["Tables"]["documents"]["Row"];
export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
export type InvoiceItem = Database["public"]["Tables"]["invoice_items"]["Row"];
export type AdminAuditLog = Database["public"]["Tables"]["admin_audit_logs"]["Row"];
export type SystemSetting = Database["public"]["Tables"]["system_settings"]["Row"];
export type ProjectTask = Database["public"]["Tables"]["project_tasks"]["Row"];
export type ProjectMilestone = Database["public"]["Tables"]["project_milestones"]["Row"];
export type TimeEntry = Database["public"]["Tables"]["time_entries"]["Row"];
export type MaterialMovement = Database["public"]["Tables"]["material_movements"]["Row"];
export type PurchaseOrderItem = Database["public"]["Tables"]["purchase_order_items"]["Row"];
export type ProgressReport = Database["public"]["Tables"]["progress_reports"]["Row"];
