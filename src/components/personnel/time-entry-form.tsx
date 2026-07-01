"use client";

import { useActionState } from "react";
import { InputField, FIELD_CLASS } from "@/components/ui/form-field";
import type { TimeEntryFormState } from "@/lib/actions/time-entries";
import type { Project } from "@/lib/types";

export function TimeEntryForm({
  action,
  projects,
}: {
  action: (prevState: TimeEntryFormState, formData: FormData) => Promise<TimeEntryFormState>;
  projects: Pick<Project, "id" | "name">[];
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        <InputField label="Date" name="entry_date" type="date" required />
        <InputField label="Heures" name="hours" type="number" placeholder="8" required step="0.5" min="0.5" max="24" />
        <div>
          <label htmlFor="te-project" className="block text-sm font-medium text-navy-950">Projet</label>
          <select
            id="te-project"
            name="project_id"
            className={`mt-1 ${FIELD_CLASS}`}
          >
            <option value="">— Général</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
      <InputField label="Description" name="description" placeholder="Activité réalisée…" />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : "Enregistrer les heures"}
      </button>
    </form>
  );
}
