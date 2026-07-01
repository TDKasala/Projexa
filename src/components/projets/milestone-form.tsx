"use client";

import { useActionState } from "react";
import { InputField } from "@/components/ui/form-field";
import type { MilestoneFormState } from "@/lib/actions/milestones";

export function MilestoneForm({
  action,
}: {
  action: (prevState: MilestoneFormState, formData: FormData) => Promise<MilestoneFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField label="Titre du jalon" name="title" required />
        <InputField label="Date limite" name="due_date" type="date" required />
      </div>
      <InputField label="Notes" name="notes" as="textarea" />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : "Ajouter le jalon"}
      </button>
    </form>
  );
}
