"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import type { MovementType } from "@/lib/types";

export type MovementFormState = { error: string | null };

export async function createMaterialMovement(
  materialId: string,
  _prevState: MovementFormState,
  formData: FormData
): Promise<MovementFormState> {
  const profile = await requireProfileWithCompany();
  const qtyStr = String(formData.get("quantity") ?? "").trim();
  const quantity = parseFloat(qtyStr);

  if (!qtyStr || !Number.isFinite(quantity) || quantity <= 0) {
    return { error: "La quantité doit être un nombre positif." };
  }

  const movement_type = String(formData.get("movement_type") ?? "entree") as MovementType;
  const upStr = String(formData.get("unit_price") ?? "").trim();
  const unit_price = upStr ? parseFloat(upStr) : null;

  const supabase = await createClient();
  const { error } = await supabase.from("material_movements").insert({
    company_id: profile.company_id,
    material_id: materialId,
    project_id: String(formData.get("project_id") ?? "").trim() || null,
    movement_type,
    quantity,
    unit_price: unit_price && Number.isFinite(unit_price) ? unit_price : null,
    reference: String(formData.get("reference") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
    movement_date: String(formData.get("movement_date") ?? "").trim() || undefined,
    created_by: profile.id,
  });

  if (error) return { error: "Impossible d'enregistrer le mouvement de stock." };
  revalidatePath(`/materiaux/${materialId}`);
  return { error: null };
}
