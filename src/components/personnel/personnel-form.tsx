"use client";

import { useActionState } from "react";
import { FormField, FIELD_CLASS } from "@/components/ui/form-field";
import { Button, LinkButton } from "@/components/ui/button";
import { PERSONNEL_STATUS_LABELS } from "@/lib/labels";
import type { PersonnelFormState } from "@/lib/actions/personnel";
import type { Personnel, Project } from "@/lib/types";

type PersonnelAction = (
  state: PersonnelFormState,
  formData: FormData
) => Promise<PersonnelFormState>;

export function PersonnelForm({
  action,
  personnel,
  projects,
}: {
  action: PersonnelAction;
  personnel?: Personnel;
  projects: Pick<Project, "id" | "name">[];
}) {
  const [state, formAction, isPending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Nom complet" htmlFor="full_name" required>
          <input
            id="full_name"
            name="full_name"
            required
            defaultValue={personnel?.full_name}
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="Fonction" htmlFor="role">
          <input
            id="role"
            name="role"
            defaultValue={personnel?.role ?? ""}
            className={FIELD_CLASS}
            placeholder="Chef de chantier, maçon, électricien..."
          />
        </FormField>

        <FormField label="Téléphone" htmlFor="phone">
          <input id="phone" name="phone" defaultValue={personnel?.phone ?? ""} className={FIELD_CLASS} />
        </FormField>

        <FormField label="E-mail" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={personnel?.email ?? ""}
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="Taux journalier (FC)" htmlFor="daily_rate">
          <input
            id="daily_rate"
            name="daily_rate"
            type="number"
            step="0.01"
            min={0}
            defaultValue={personnel?.daily_rate ?? ""}
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="Projet affecté" htmlFor="project_id">
          <select
            id="project_id"
            name="project_id"
            defaultValue={personnel?.project_id ?? ""}
            className={FIELD_CLASS}
          >
            <option value="">Aucun</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Statut" htmlFor="status" required>
          <select
            id="status"
            name="status"
            defaultValue={personnel?.status ?? "actif"}
            className={FIELD_CLASS}
          >
            {Object.entries(PERSONNEL_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Date d'embauche" htmlFor="hire_date">
          <input
            id="hire_date"
            name="hire_date"
            type="date"
            defaultValue={personnel?.hire_date ?? ""}
            className={FIELD_CLASS}
          />
        </FormField>
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <LinkButton href="/personnel" variant="outline">
          Annuler
        </LinkButton>
      </div>
    </form>
  );
}
