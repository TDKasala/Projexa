"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import type { PersonnelStatus } from "@/lib/types";

export type PersonnelFormState = { error: string | null };

function parseNumber(value: FormDataEntryValue | null): number | null {
  const str = String(value ?? "").trim();
  if (!str) return null;
  const num = Number(str);
  return Number.isFinite(num) ? num : null;
}

function parseDate(value: FormDataEntryValue | null): string | null {
  const str = String(value ?? "").trim();
  return str || null;
}

function parseProjectId(value: FormDataEntryValue | null): string | null {
  const str = String(value ?? "").trim();
  return str || null;
}

export async function createPersonnel(
  _prevState: PersonnelFormState,
  formData: FormData
): Promise<PersonnelFormState> {
  const profile = await requireProfileWithCompany();

  const fullName = String(formData.get("full_name") ?? "").trim();
  if (!fullName) {
    return { error: "Le nom complet est obligatoire." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("personnel").insert({
    company_id: profile.company_id,
    full_name: fullName,
    role: String(formData.get("role") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    daily_rate: parseNumber(formData.get("daily_rate")),
    project_id: parseProjectId(formData.get("project_id")),
    status: (String(formData.get("status") ?? "actif") as PersonnelStatus),
    hire_date: parseDate(formData.get("hire_date")),
  });

  if (error) {
    return { error: "Impossible d'ajouter ce membre du personnel. Réessayez." };
  }

  revalidatePath("/personnel");
  redirect("/personnel");
}

export async function updatePersonnel(
  id: string,
  _prevState: PersonnelFormState,
  formData: FormData
): Promise<PersonnelFormState> {
  const profile = await requireProfileWithCompany();

  const fullName = String(formData.get("full_name") ?? "").trim();
  if (!fullName) {
    return { error: "Le nom complet est obligatoire." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("personnel")
    .update({
      full_name: fullName,
      role: String(formData.get("role") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      daily_rate: parseNumber(formData.get("daily_rate")),
      project_id: parseProjectId(formData.get("project_id")),
      status: (String(formData.get("status") ?? "actif") as PersonnelStatus),
      hire_date: parseDate(formData.get("hire_date")),
    })
    .eq("id", id)
    .eq("company_id", profile.company_id);

  if (error) {
    return { error: "Impossible de mettre à jour ce membre du personnel. Réessayez." };
  }

  revalidatePath("/personnel");
  redirect("/personnel");
}

export async function deletePersonnel(id: string): Promise<void> {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  await supabase.from("personnel").delete().eq("id", id).eq("company_id", profile.company_id);
  revalidatePath("/personnel");
}
