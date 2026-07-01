"use client";

import { useActionState } from "react";
import { InputField, FIELD_CLASS } from "@/components/ui/form-field";
import type { MovementFormState } from "@/lib/actions/material-movements";
import type { Project } from "@/lib/types";

export function MovementForm({
  action,
  projects,
}: {
  action: (prevState: MovementFormState, formData: FormData) => Promise<MovementFormState>;
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
          <label htmlFor="mv-type" className="block text-sm font-medium text-navy-950">Type de mouvement</label>
          <select
            id="mv-type"
            name="movement_type"
            required
            className={`mt-1 ${FIELD_CLASS}`}
          >
            <option value="entree">Entrée (réception)</option>
            <option value="sortie">Sortie (utilisation/vente)</option>
            <option value="ajustement">Ajustement (inventaire)</option>
          </select>
        </div>
        <InputField label="Quantité" name="quantity" type="number" placeholder="0" required step="0.01" min="0.01" />
        <InputField label="Prix unitaire (FC)" name="unit_price" type="number" placeholder="0" step="0.01" />
        <InputField label="Date" name="movement_date" type="date" />
        <div>
          <label htmlFor="mv-project" className="block text-sm font-medium text-navy-950">Projet lié</label>
          <select
            id="mv-project"
            name="project_id"
            className={`mt-1 ${FIELD_CLASS}`}
          >
            <option value="">— Aucun</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <InputField label="Référence" name="reference" placeholder="BL-001, CMD-123…" />
      </div>
      <InputField label="Notes" name="notes" as="textarea" placeholder="Observations, fournisseur…" />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : "Enregistrer le mouvement"}
      </button>
    </form>
  );
}
