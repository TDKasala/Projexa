import type { PersonnelStatus, ProjectStatus, PurchaseOrderStatus } from "@/lib/types";

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
