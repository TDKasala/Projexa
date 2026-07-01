"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";

export type TimeEntryFormState = { error: string | null };

export async function createTimeEntry(
  personnelId: string,
  _prevState: TimeEntryFormState,
  formData: FormData
): Promise<TimeEntryFormState> {
  const profile = await requireProfileWithCompany();
  const hoursStr = String(formData.get("hours") ?? "").trim();
  const hours = parseFloat(hoursStr);

  if (!hoursStr || !Number.isFinite(hours) || hours <= 0 || hours > 24) {
    return { error: "Les heures doivent être comprises entre 0 et 24." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("time_entries").insert({
    company_id: profile.company_id,
    personnel_id: personnelId,
    project_id: String(formData.get("project_id") ?? "").trim() || null,
    entry_date: String(formData.get("entry_date") ?? "").trim() || undefined,
    hours,
    description: String(formData.get("description") ?? "").trim() || null,
  });

  if (error) return { error: "Impossible d'enregistrer les heures." };
  revalidatePath(`/personnel/${personnelId}`);
  return { error: null };
}

export async function deleteTimeEntry(entryId: string, personnelId: string): Promise<void> {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  await supabase
    .from("time_entries")
    .delete()
    .eq("id", entryId)
    .eq("company_id", profile.company_id);
  revalidatePath(`/personnel/${personnelId}`);
}
