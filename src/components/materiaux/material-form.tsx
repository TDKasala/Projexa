"use client";

import { useActionState } from "react";
import { FormField, FIELD_CLASS } from "@/components/ui/form-field";
import { Button, LinkButton } from "@/components/ui/button";
import type { MaterialFormState } from "@/lib/actions/materials";
import type { Material, Project } from "@/lib/types";

type MaterialAction = (
  state: MaterialFormState,
  formData: FormData
) => Promise<MaterialFormState>;

export function MaterialForm({
  action,
  material,
  projects,
}: {
  action: MaterialAction;
  material?: Material;
  projects: Pick<Project, "id" | "name">[];
}) {
  const [state, formAction, isPending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Nom du matériau" htmlFor="name" required>
          <input id="name" name="name" required defaultValue={material?.name} className={FIELD_CLASS} />
        </FormField>

        <FormField label="Unité" htmlFor="unit" required>
          <input
            id="unit"
            name="unit"
            required
            defaultValue={material?.unit}
            placeholder="sac, m³, kg, pièce..."
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="Quantité en stock" htmlFor="quantity">
          <input
            id="quantity"
            name="quantity"
            type="number"
            step="0.01"
            min={0}
            defaultValue={material?.quantity ?? 0}
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="Prix unitaire (FC)" htmlFor="unit_price">
          <input
            id="unit_price"
            name="unit_price"
            type="number"
            step="0.01"
            min={0}
            defaultValue={material?.unit_price ?? ""}
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="Stock minimum" htmlFor="min_stock">
          <input
            id="min_stock"
            name="min_stock"
            type="number"
            step="0.01"
            min={0}
            defaultValue={material?.min_stock ?? ""}
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="Projet associé" htmlFor="project_id">
          <select
            id="project_id"
            name="project_id"
            defaultValue={material?.project_id ?? ""}
            className={FIELD_CLASS}
          >
            <option value="">Stock général</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <LinkButton href="/materiaux" variant="outline">
          Annuler
        </LinkButton>
      </div>
    </form>
  );
}
