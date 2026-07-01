"use client";

import { useActionState } from "react";
import { InputField } from "@/components/ui/form-field";
import type { POItemFormState } from "@/lib/actions/purchase-order-items";

export function POItemForm({
  action,
}: {
  action: (prevState: POItemFormState, formData: FormData) => Promise<POItemFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <InputField label="Description" name="description" required />
        </div>
        <InputField label="Quantité" name="quantity" type="number" placeholder="1" required step="0.01" min="0.01" />
        <InputField label="Unité" name="unit" placeholder="m², kg, unité…" />
        <div className="sm:col-span-2">
          <InputField label="Prix unitaire (FC)" name="unit_price" type="number" placeholder="0" required step="0.01" min="0" />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Ajout…" : "Ajouter la ligne"}
      </button>
    </form>
  );
}
