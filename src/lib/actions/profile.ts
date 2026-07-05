"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";

export type ProfileFormState = { error: string | null; success?: string };

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const fullName = String(formData.get("full_name") ?? "").trim();
  if (!fullName) return { error: "Le nom complet est requis." };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", profile.id);

  if (profileError) return { error: "Impossible de mettre à jour le profil." };

  const companyName = String(formData.get("company_name") ?? "").trim();
  if (!companyName) return { error: "Le nom de l'entreprise est requis." };

  const { error: companyError } = await supabase
    .from("companies")
    .update({
      name: companyName,
      rccm: String(formData.get("rccm") ?? "").trim() || null,
      id_national: String(formData.get("id_national") ?? "").trim() || null,
      n_impot: String(formData.get("n_impot") ?? "").trim() || null,
      tva: String(formData.get("tva") ?? "").trim() || null,
      address: String(formData.get("address") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
    })
    .eq("id", profile.company_id);

  if (companyError) return { error: "Impossible de mettre à jour l'entreprise." };

  revalidatePath("/parametres");
  return { error: null, success: "Paramètres mis à jour avec succès." };
}
