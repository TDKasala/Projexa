import type { PersonnelStatus, ProjectStatus, PurchaseOrderStatus, InvoiceType, InvoiceStatus, TaskStatus, TaskPriority, MovementType } from "@/lib/types";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planifie: "Planifié",
  en_cours: "En cours",
  en_pause: "En pause",
  termine: "Terminé",
  annule: "Annulé",
};

export const PROJECT_STATUS_TONE: Record<ProjectStatus, "neutral" | "blue" | "orange" | "success" | "danger"> = {
  planifie: "neutral",
  en_cours: "blue",
  en_pause: "orange",
  termine: "success",
  annule: "danger",
};

export const PERSONNEL_STATUS_LABELS: Record<PersonnelStatus, string> = {
  actif: "Actif",
  inactif: "Inactif",
};

export const PURCHASE_ORDER_STATUS_LABELS: Record<PurchaseOrderStatus, string> = {
  brouillon: "Brouillon",
  envoyee: "Envoyée",
  recue: "Reçue",
  annulee: "Annulée",
};

export const PURCHASE_ORDER_STATUS_TONE: Record<
  PurchaseOrderStatus,
  "neutral" | "blue" | "orange" | "success" | "danger"
> = {
  brouillon: "neutral",
  envoyee: "blue",
  recue: "success",
  annulee: "danger",
};

export const INVOICE_TYPE_LABELS: Record<InvoiceType, string> = {
  facture: "Facture",
  devis: "Devis",
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  brouillon: "Brouillon",
  envoyee: "Envoyée",
  payee: "Payée",
  annulee: "Annulée",
};

export const INVOICE_STATUS_TONE: Record<
  InvoiceStatus,
  "neutral" | "blue" | "orange" | "success" | "danger"
> = {
  brouillon: "neutral",
  envoyee: "blue",
  payee: "success",
  annulee: "danger",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  a_faire: "À faire",
  en_cours: "En cours",
  en_revision: "En révision",
  termine: "Terminé",
  annule: "Annulé",
};

export const TASK_STATUS_TONE: Record<TaskStatus, "neutral" | "blue" | "orange" | "success" | "danger"> = {
  a_faire: "neutral",
  en_cours: "blue",
  en_revision: "orange",
  termine: "success",
  annule: "danger",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  basse: "Basse",
  normale: "Normale",
  haute: "Haute",
  urgente: "Urgente",
};

export const TASK_PRIORITY_TONE: Record<TaskPriority, "neutral" | "blue" | "orange" | "danger"> = {
  basse: "neutral",
  normale: "blue",
  haute: "orange",
  urgente: "danger",
};

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  entree: "Entrée",
  sortie: "Sortie",
  ajustement: "Ajustement",
};

export const MOVEMENT_TYPE_TONE: Record<MovementType, "neutral" | "blue" | "success" | "danger"> = {
  entree: "success",
  sortie: "danger",
  ajustement: "blue",
};
