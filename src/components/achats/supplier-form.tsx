"use client";

import { useActionState } from "react";
import { FormField, FIELD_CLASS } from "@/components/ui/form-field";
import { Button, LinkButton } from "@/components/ui/button";
import type { SupplierFormState } from "@/lib/actions/suppliers";
import type { Supplier } from "@/lib/types";

type SupplierAction = (
  state: SupplierFormState,
  formData: FormData
) => Promise<SupplierFormState>;

export function SupplierForm({
  action,
  supplier,
}: {
  action: SupplierAction;
  supplier?: Supplier;
}) {
  const [state, formAction, isPending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Nom du fournisseur" htmlFor="name" required>
          <input id="name" name="name" required defaultValue={supplier?.name} className={FIELD_CLASS} />
        </FormField>

        <FormField label="Nom du contact" htmlFor="contact_name">
          <input
            id="contact_name"
            name="contact_name"
            defaultValue={supplier?.contact_name ?? ""}
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="Téléphone" htmlFor="phone">
          <input id="phone" name="phone" defaultValue={supplier?.phone ?? ""} className={FIELD_CLASS} />
        </FormField>

        <FormField label="E-mail" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={supplier?.email ?? ""}
            className={FIELD_CLASS}
          />
        </FormField>
      </div>

      <FormField label="Adresse" htmlFor="address">
        <textarea
          id="address"
          name="address"
          rows={3}
          defaultValue={supplier?.address ?? ""}
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
        <LinkButton href="/achats/fournisseurs" variant="outline">
          Annuler
        </LinkButton>
      </div>
    </form>
  );
}
