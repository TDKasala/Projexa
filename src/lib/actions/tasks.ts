"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import type { TaskStatus, TaskPriority } from "@/lib/types";

export type TaskFormState = { error: string | null };

export async function createTask(
  projectId: string,
  _prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  const profile = await requireProfileWithCompany();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Le titre est obligatoire." };

  const supabase = await createClient();
  const { error } = await supabase.from("project_tasks").insert({
    project_id: projectId,
    company_id: profile.company_id,
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    assignee_id: String(formData.get("assignee_id") ?? "").trim() || null,
    status: (String(formData.get("status") ?? "a_faire")) as TaskStatus,
    priority: (String(formData.get("priority") ?? "normale")) as TaskPriority,
    due_date: String(formData.get("due_date") ?? "").trim() || null,
    created_by: profile.id,
  });

  if (error) return { error: "Impossible de créer la tâche." };

  revalidatePath(`/projets/${projectId}`);
  return { error: null };
}

export async function updateTask(
  taskId: string,
  projectId: string,
  _prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  const profile = await requireProfileWithCompany();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Le titre est obligatoire." };

  const statusValue = String(formData.get("status") ?? "a_faire") as TaskStatus;
  const completed_at =
    statusValue === "termine" ? new Date().toISOString() : null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("project_tasks")
    .update({
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      assignee_id: String(formData.get("assignee_id") ?? "").trim() || null,
      status: statusValue,
      priority: (String(formData.get("priority") ?? "normale")) as TaskPriority,
      due_date: String(formData.get("due_date") ?? "").trim() || null,
      completed_at,
    })
    .eq("id", taskId)
    .eq("company_id", profile.company_id);

  if (error) return { error: "Impossible de mettre à jour la tâche." };

  revalidatePath(`/projets/${projectId}`);
  return { error: null };
}

export async function deleteTask(taskId: string, projectId: string): Promise<void> {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  await supabase
    .from("project_tasks")
    .delete()
    .eq("id", taskId)
    .eq("company_id", profile.company_id);
  revalidatePath(`/projets/${projectId}`);
}

export async function toggleTaskStatus(
  taskId: string,
  projectId: string,
  currentStatus: TaskStatus
): Promise<void> {
  const profile = await requireProfileWithCompany();
  const newStatus: TaskStatus = currentStatus === "termine" ? "en_cours" : "termine";
  const completed_at = newStatus === "termine" ? new Date().toISOString() : null;

  const supabase = await createClient();
  await supabase
    .from("project_tasks")
    .update({ status: newStatus, completed_at })
    .eq("id", taskId)
    .eq("company_id", profile.company_id);

  revalidatePath(`/projets/${projectId}`);
}
