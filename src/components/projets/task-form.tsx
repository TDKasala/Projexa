"use client";

import { useActionState } from "react";
import { InputField, FIELD_CLASS } from "@/components/ui/form-field";
import type { TaskStatus, TaskPriority, Personnel } from "@/lib/types";
import type { TaskFormState } from "@/lib/actions/tasks";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "a_faire", label: "À faire" },
  { value: "en_cours", label: "En cours" },
  { value: "en_revision", label: "En révision" },
  { value: "termine", label: "Terminé" },
  { value: "annule", label: "Annulé" },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "basse", label: "Basse" },
  { value: "normale", label: "Normale" },
  { value: "haute", label: "Haute" },
  { value: "urgente", label: "Urgente" },
];

export function TaskForm({
  action,
  personnel,
  defaultValues,
}: {
  action: (prevState: TaskFormState, formData: FormData) => Promise<TaskFormState>;
  personnel: Pick<Personnel, "id" | "full_name">[];
  defaultValues?: {
    title?: string;
    description?: string;
    assignee_id?: string | null;
    status?: TaskStatus;
    priority?: TaskPriority;
    due_date?: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}
      <InputField label="Titre" name="title" required defaultValue={defaultValues?.title} />
      <InputField label="Description" name="description" as="textarea" defaultValue={defaultValues?.description ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="task-assignee" className="block text-sm font-medium text-navy-950">Assigné à</label>
          <select
            id="task-assignee"
            name="assignee_id"
            defaultValue={defaultValues?.assignee_id ?? ""}
            className={`mt-1 ${FIELD_CLASS}`}
          >
            <option value="">— Non assigné</option>
            {personnel.map((p) => (
              <option key={p.id} value={p.id}>{p.full_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="task-priority" className="block text-sm font-medium text-navy-950">Priorité</label>
          <select
            id="task-priority"
            name="priority"
            defaultValue={defaultValues?.priority ?? "normale"}
            className={`mt-1 ${FIELD_CLASS}`}
          >
            {PRIORITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="task-status" className="block text-sm font-medium text-navy-950">Statut</label>
          <select
            id="task-status"
            name="status"
            defaultValue={defaultValues?.status ?? "a_faire"}
            className={`mt-1 ${FIELD_CLASS}`}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <InputField label="Date d'échéance" name="due_date" type="date" defaultValue={defaultValues?.due_date ?? ""} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : "Enregistrer la tâche"}
      </button>
    </form>
  );
}
