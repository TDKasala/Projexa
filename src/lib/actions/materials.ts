"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";

export type MaterialFormState = { error: string | null };

function parseNumber(value: FormDataEntryValue | null): number | null {
  const str = String(value ?? "").trim();
  if (!str) return null;
  const num = Number(str);
  return Number.isFinite(num) ? num : null;
}

function parseProjectId(value: FormDataEntryValue | null): string | null {
  const str = String(value ?? "").trim();
  return str || null;
}

export async function createMaterial(
  _prevState: MaterialFormState,
  formData: FormData
): Promise<MaterialFormState> {
  const profile = await requireProfileWithCompany();

  const name = String(formData.get("name") ?? "").trim();
  const unit = String(formData.get("unit") ?? "").trim();
  if (!name || !unit) {
    return { error: "Le nom et l'unité sont obligatoires." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("materials").insert({
    company_id: profile.company_id,
    name,
    unit,
    quantity: parseNumber(formData.get("quantity")) ?? 0,
    unit_price: parseNumber(formData.get("unit_price")),
    min_stock: parseNumber(formData.get("min_stock")),
    project_id: parseProjectId(formData.get("project_id")),
  });

  if (error) {
    return { error: "Impossible d'ajouter ce matériau. Réessayez." };
  }

  revalidatePath("/materiaux");
  redirect("/materiaux");
}

export async function updateMaterial(
  id: string,
  _prevState: MaterialFormState,
  formData: FormData
): Promise<MaterialFormState> {
  const profile = await requireProfileWithCompany();

  const name = String(formData.get("name") ?? "").trim();
  const unit = String(formData.get("unit") ?? "").trim();
  if (!name || !unit) {
    return { error: "Le nom et l'unité sont obligatoires." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("materials")
    .update({
      name,
      unit,
      quantity: parseNumber(formData.get("quantity")) ?? 0,
      unit_price: parseNumber(formData.get("unit_price")),
      min_stock: parseNumber(formData.get("min_stock")),
      project_id: parseProjectId(formData.get("project_id")),
    })
    .eq("id", id)
    .eq("company_id", profile.company_id);

  if (error) {
    return { error: "Impossible de mettre à jour ce matériau. Réessayez." };
  }

  revalidatePath("/materiaux");
  redirect("/materiaux");
}

export async function deleteMaterial(id: string): Promise<void> {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  await supabase.from("materials").delete().eq("id", id).eq("company_id", profile.company_id);
  revalidatePath("/materiaux");
}
