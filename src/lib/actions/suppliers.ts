"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";

export type SupplierFormState = { error: string | null };

export async function createSupplier(
  _prevState: SupplierFormState,
  formData: FormData
): Promise<SupplierFormState> {
  const profile = await requireProfileWithCompany();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { error: "Le nom du fournisseur est obligatoire." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("suppliers").insert({
    company_id: profile.company_id,
    name,
    contact_name: String(formData.get("contact_name") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
  });

  if (error) {
    return { error: "Impossible d'ajouter ce fournisseur. Réessayez." };
  }

  revalidatePath("/achats/fournisseurs");
  redirect("/achats/fournisseurs");
}

export async function updateSupplier(
  id: string,
  _prevState: SupplierFormState,
  formData: FormData
): Promise<SupplierFormState> {
  const profile = await requireProfileWithCompany();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { error: "Le nom du fournisseur est obligatoire." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("suppliers")
    .update({
      name,
      contact_name: String(formData.get("contact_name") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      address: String(formData.get("address") ?? "").trim() || null,
    })
    .eq("id", id)
    .eq("company_id", profile.company_id);

  if (error) {
    return { error: "Impossible de mettre à jour ce fournisseur. Réessayez." };
  }

  revalidatePath("/achats/fournisseurs");
  redirect("/achats/fournisseurs");
}

export async function deleteSupplier(id: string): Promise<void> {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  await supabase.from("suppliers").delete().eq("id", id).eq("company_id", profile.company_id);
  revalidatePath("/achats/fournisseurs");
}
