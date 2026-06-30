"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import type { PurchaseOrderStatus } from "@/lib/types";

export type PurchaseOrderFormState = { error: string | null };

function parseNumber(value: FormDataEntryValue | null): number {
  const str = String(value ?? "").trim();
  if (!str) return 0;
  const num = Number(str);
  return Number.isFinite(num) ? num : 0;
}

function parseOptional(value: FormDataEntryValue | null): string | null {
  const str = String(value ?? "").trim();
  return str || null;
}

export async function createPurchaseOrder(
  _prevState: PurchaseOrderFormState,
  formData: FormData
): Promise<PurchaseOrderFormState> {
  const profile = await requireProfileWithCompany();

  const supabase = await createClient();
  const { error } = await supabase.from("purchase_orders").insert({
    company_id: profile.company_id,
    supplier_id: parseOptional(formData.get("supplier_id")),
    project_id: parseOptional(formData.get("project_id")),
    reference: parseOptional(formData.get("reference")),
    status: (String(formData.get("status") ?? "brouillon") as PurchaseOrderStatus),
    order_date: String(formData.get("order_date") ?? new Date().toISOString().slice(0, 10)),
    total_amount: parseNumber(formData.get("total_amount")),
    notes: parseOptional(formData.get("notes")),
  });

  if (error) {
    return { error: "Impossible de créer la commande. Réessayez." };
  }

  revalidatePath("/achats");
  redirect("/achats");
}

export async function updatePurchaseOrder(
  id: string,
  _prevState: PurchaseOrderFormState,
  formData: FormData
): Promise<PurchaseOrderFormState> {
  const profile = await requireProfileWithCompany();

  const supabase = await createClient();
  const { error } = await supabase
    .from("purchase_orders")
    .update({
      supplier_id: parseOptional(formData.get("supplier_id")),
      project_id: parseOptional(formData.get("project_id")),
      reference: parseOptional(formData.get("reference")),
      status: (String(formData.get("status") ?? "brouillon") as PurchaseOrderStatus),
      order_date: String(formData.get("order_date") ?? new Date().toISOString().slice(0, 10)),
      total_amount: parseNumber(formData.get("total_amount")),
      notes: parseOptional(formData.get("notes")),
    })
    .eq("id", id)
    .eq("company_id", profile.company_id);

  if (error) {
    return { error: "Impossible de mettre à jour la commande. Réessayez." };
  }

  revalidatePath("/achats");
  redirect("/achats");
}

export async function deletePurchaseOrder(id: string): Promise<void> {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  await supabase.from("purchase_orders").delete().eq("id", id).eq("company_id", profile.company_id);
  revalidatePath("/achats");
}
