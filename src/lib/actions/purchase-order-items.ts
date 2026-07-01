"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";

export type POItemFormState = { error: string | null };

export async function createPOItem(
  poId: string,
  _prevState: POItemFormState,
  formData: FormData
): Promise<POItemFormState> {
  const profile = await requireProfileWithCompany();
  const description = String(formData.get("description") ?? "").trim();
  if (!description) return { error: "La description est obligatoire." };

  const quantity = parseFloat(String(formData.get("quantity") ?? "1"));
  const unit_price = parseFloat(String(formData.get("unit_price") ?? "0"));

  if (!Number.isFinite(quantity) || quantity <= 0)
    return { error: "La quantité doit être positive." };
  if (!Number.isFinite(unit_price) || unit_price < 0)
    return { error: "Le prix unitaire est invalide." };

  // Verify the PO belongs to this company
  const supabase = await createClient();
  const { data: po } = await supabase
    .from("purchase_orders")
    .select("id")
    .eq("id", poId)
    .eq("company_id", profile.company_id)
    .single();

  if (!po) return { error: "Commande introuvable." };

  const { error } = await supabase.from("purchase_order_items").insert({
    purchase_order_id: poId,
    description,
    quantity,
    unit: String(formData.get("unit") ?? "").trim() || null,
    unit_price,
  });

  if (error) return { error: "Impossible d'ajouter la ligne." };
  revalidatePath(`/achats/${poId}`);
  return { error: null };
}

export async function deletePOItem(itemId: string, poId: string): Promise<void> {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  // Verify ownership via purchase_order join
  const { data: item } = await supabase
    .from("purchase_order_items")
    .select("id, purchase_orders!inner(company_id)")
    .eq("id", itemId)
    .single();

  if (!item) return;
  await supabase.from("purchase_order_items").delete().eq("id", itemId);
  revalidatePath(`/achats/${poId}`);
}
