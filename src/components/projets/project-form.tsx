"use client";

import { useActionState } from "react";
import { FormField, FIELD_CLASS } from "@/components/ui/form-field";
import { Button, LinkButton } from "@/components/ui/button";
import { PROJECT_STATUS_LABELS } from "@/lib/labels";
import type { ProjectFormState } from "@/lib/actions/projects";
import type { Project } from "@/lib/types";

type ProjectAction = (
  state: ProjectFormState,
  formData: FormData
) => Promise<ProjectFormState>;

export function ProjectForm({
  action,
  project,
}: {
  action: ProjectAction;
  project?: Project;
}) {
  const [state, formAction, isPending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Nom du projet" htmlFor="name" required>
          <input
            id="name"
            name="name"
            required
            defaultValue={project?.name}
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="Client" htmlFor="client_name">
          <input
            id="client_name"
            name="client_name"
            defaultValue={project?.client_name ?? ""}
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="Adresse du chantier" htmlFor="address">
          <input
            id="address"
            name="address"
            defaultValue={project?.address ?? ""}
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="Statut" htmlFor="status" required>
          <select
            id="status"
            name="status"
            defaultValue={project?.status ?? "planifie"}
            className={FIELD_CLASS}
          >
            {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Avancement (%)" htmlFor="progress_percent">
          <input
            id="progress_percent"
            name="progress_percent"
            type="number"
            min={0}
            max={100}
            defaultValue={project?.progress_percent ?? 0}
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="Budget (FC)" htmlFor="budget">
          <input
            id="budget"
            name="budget"
            type="number"
            step="0.01"
            min={0}
            defaultValue={project?.budget ?? ""}
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="Date de début" htmlFor="start_date">
          <input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={project?.start_date ?? ""}
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="Date de fin" htmlFor="end_date">
          <input
            id="end_date"
            name="end_date"
            type="date"
            defaultValue={project?.end_date ?? ""}
            className={FIELD_CLASS}
          />
        </FormField>
      </div>

      <FormField label="Description" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={project?.description ?? ""}
          className={FIELD_CLASS}
        />
      </FormField>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <LinkButton href="/projets" variant="outline">
          Annuler
        </LinkButton>
      </div>
    </form>
  );
}
