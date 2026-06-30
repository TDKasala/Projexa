"use client";

import { useActionState } from "react";
import { FormField, FIELD_CLASS } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import type { DocumentUploadState } from "@/lib/actions/documents";
import type { Project } from "@/lib/types";

type UploadAction = (state: DocumentUploadState, formData: FormData) => Promise<DocumentUploadState>;

export function DocumentUploadForm({
  action,
  projects,
}: {
  action: UploadAction;
  projects: Pick<Project, "id" | "name">[];
}) {
  const [state, formAction, isPending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Fichier" htmlFor="file" required>
          <input
            id="file"
            name="file"
            type="file"
            required
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.dwg,.svg"
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="Nom du document" htmlFor="name">
          <input
            id="name"
            name="name"
            className={FIELD_CLASS}
            placeholder="Laisser vide pour utiliser le nom du fichier"
          />
        </FormField>

        <FormField label="Projet associé" htmlFor="project_id">
          <select id="project_id" name="project_id" className={FIELD_CLASS}>
            <option value="">Document général</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}
      {!state.error && !isPending && (
        <p className="text-xs text-muted">Formats acceptés : PDF, Word, Excel, images, DWG · Taille max : 20 Mo</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Téléversement..." : "Téléverser"}
      </Button>
    </form>
  );
}
