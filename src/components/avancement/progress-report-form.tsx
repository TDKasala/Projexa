"use client";

import { useActionState } from "react";
import { InputField, FIELD_CLASS } from "@/components/ui/form-field";
import type { ProgressReportFormState } from "@/lib/actions/progress-reports";
import type { Project } from "@/lib/types";

export function ProgressReportForm({
  action,
  projects,
}: {
  action: (prevState: ProgressReportFormState, formData: FormData) => Promise<ProgressReportFormState>;
  projects: Pick<Project, "id" | "name">[];
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pr-project" className="block text-sm font-medium text-navy-950">Projet</label>
          <select
            id="pr-project"
            name="project_id"
            required
            className={`mt-1 ${FIELD_CLASS}`}
          >
            <option value="">— Sélectionner un projet</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <InputField label="Date du rapport" name="report_date" type="date" />
        <div>
          <label htmlFor="pr-percent" className="block text-sm font-medium text-navy-950">Avancement global (%)</label>
          <input
            id="pr-percent"
            type="range"
            name="overall_percent"
            min="0"
            max="100"
            step="5"
            defaultValue="0"
            className="mt-2 w-full"
          />
          <div className="mt-1 text-xs text-muted">Glissez pour ajuster (0–100%)</div>
        </div>
        <InputField label="Ouvriers présents" name="workers_present" type="number" placeholder="0" min="0" />
      </div>
      <InputField label="Résumé des travaux" name="summary" as="textarea" required placeholder="Travaux réalisés aujourd'hui…" />
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField label="Problèmes rencontrés" name="problems" as="textarea" placeholder="Obstacles, imprévus…" />
        <InputField label="Prochaines étapes" name="next_steps" as="textarea" placeholder="Tâches à venir…" />
      </div>
      <InputField label="Météo" name="weather" placeholder="Ensoleillé, pluvieux…" />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : "Soumettre le rapport"}
      </button>
    </form>
  );
}
