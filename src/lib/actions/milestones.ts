"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";

export type MilestoneFormState = { error: string | null };

export async function createMilestone(
  projectId: string,
  _prevState: MilestoneFormState,
  formData: FormData
): Promise<MilestoneFormState> {
  const profile = await requireProfileWithCompany();
  const title = String(formData.get("title") ?? "").trim();
  const due_date = String(formData.get("due_date") ?? "").trim();
  if (!title) return { error: "Le titre est obligatoire." };
  if (!due_date) return { error: "La date est obligatoire." };

  const supabase = await createClient();
  const { error } = await supabase.from("project_milestones").insert({
    project_id: projectId,
    company_id: profile.company_id,
    title,
    due_date,
    notes: String(formData.get("notes") ?? "").trim() || null,
  });

  if (error) return { error: "Impossible de créer le jalon." };
  revalidatePath(`/projets/${projectId}`);
  return { error: null };
}

export async function toggleMilestone(
  milestoneId: string,
  projectId: string,
  isCompleted: boolean
): Promise<void> {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  await supabase
    .from("project_milestones")
    .update({ completed_at: isCompleted ? null : new Date().toISOString() })
    .eq("id", milestoneId)
    .eq("company_id", profile.company_id);
  revalidatePath(`/projets/${projectId}`);
}

export async function deleteMilestone(milestoneId: string, projectId: string): Promise<void> {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  await supabase
    .from("project_milestones")
    .delete()
    .eq("id", milestoneId)
    .eq("company_id", profile.company_id);
  revalidatePath(`/projets/${projectId}`);
}
