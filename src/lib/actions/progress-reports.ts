"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";

export type ProgressReportFormState = { error: string | null };

export async function createProgressReport(
  projectId: string,
  _prevState: ProgressReportFormState,
  formData: FormData
): Promise<ProgressReportFormState> {
  const profile = await requireProfileWithCompany();
  const summary = String(formData.get("summary") ?? "").trim();
  if (!summary) return { error: "Le résumé est obligatoire." };

  const percentStr = String(formData.get("overall_percent") ?? "0");
  const overall_percent = parseInt(percentStr, 10);

  const wpStr = String(formData.get("workers_present") ?? "").trim();
  const workers_present = wpStr ? parseInt(wpStr, 10) : null;

  const supabase = await createClient();
  const { error } = await supabase.from("progress_reports").insert({
    project_id: projectId,
    company_id: profile.company_id,
    reporter_id: profile.id,
    report_date: String(formData.get("report_date") ?? "").trim() || undefined,
    overall_percent: Number.isFinite(overall_percent) ? Math.min(100, Math.max(0, overall_percent)) : 0,
    summary,
    problems: String(formData.get("problems") ?? "").trim() || null,
    next_steps: String(formData.get("next_steps") ?? "").trim() || null,
    weather: String(formData.get("weather") ?? "").trim() || null,
    workers_present: workers_present && Number.isFinite(workers_present) ? workers_present : null,
  });

  if (error) return { error: "Impossible de créer le rapport." };
  revalidatePath(`/avancement`);
  revalidatePath(`/projets/${projectId}`);
  return { error: null };
}

export async function createProgressReportFromForm(
  _prevState: ProgressReportFormState,
  formData: FormData
): Promise<ProgressReportFormState> {
  const projectId = String(formData.get("project_id") ?? "").trim();
  if (!projectId) return { error: "Veuillez sélectionner un projet." };
  return createProgressReport(projectId, _prevState, formData);
}

export async function deleteProgressReport(reportId: string, projectId: string): Promise<void> {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  await supabase
    .from("progress_reports")
    .delete()
    .eq("id", reportId)
    .eq("company_id", profile.company_id);
  revalidatePath(`/avancement`);
  revalidatePath(`/projets/${projectId}`);
}
