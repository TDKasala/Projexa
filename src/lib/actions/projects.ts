"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import type { ProjectStatus } from "@/lib/types";

export type ProjectFormState = { error: string | null };

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

export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const profile = await requireProfileWithCompany();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { error: "Le nom du projet est obligatoire." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("projects").insert({
    company_id: profile.company_id,
    name,
    client_name: String(formData.get("client_name") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    status: (String(formData.get("status") ?? "planifie") as ProjectStatus),
    progress_percent: parseNumber(formData.get("progress_percent")) ?? 0,
    budget: parseNumber(formData.get("budget")),
    start_date: parseDate(formData.get("start_date")),
    end_date: parseDate(formData.get("end_date")),
    description: String(formData.get("description") ?? "").trim() || null,
    created_by: profile.id,
  });

  if (error) {
    return { error: "Impossible de créer le projet. Réessayez." };
  }

  revalidatePath("/projets");
  redirect("/projets");
}

export async function updateProject(
  id: string,
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const profile = await requireProfileWithCompany();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { error: "Le nom du projet est obligatoire." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({
      name,
      client_name: String(formData.get("client_name") ?? "").trim() || null,
      address: String(formData.get("address") ?? "").trim() || null,
      status: (String(formData.get("status") ?? "planifie") as ProjectStatus),
      progress_percent: parseNumber(formData.get("progress_percent")) ?? 0,
      budget: parseNumber(formData.get("budget")),
      start_date: parseDate(formData.get("start_date")),
      end_date: parseDate(formData.get("end_date")),
      description: String(formData.get("description") ?? "").trim() || null,
    })
    .eq("id", id)
    .eq("company_id", profile.company_id);

  if (error) {
    return { error: "Impossible de mettre à jour le projet. Réessayez." };
  }

  revalidatePath("/projets");
  redirect("/projets");
}

export async function deleteProject(id: string): Promise<void> {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  await supabase.from("projects").delete().eq("id", id).eq("company_id", profile.company_id);
  revalidatePath("/projets");
}
