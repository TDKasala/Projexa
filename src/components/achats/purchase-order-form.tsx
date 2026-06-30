"use client";

import { useActionState } from "react";
import { FormField, FIELD_CLASS } from "@/components/ui/form-field";
import { Button, LinkButton } from "@/components/ui/button";
import { PURCHASE_ORDER_STATUS_LABELS } from "@/lib/labels";
import type { PurchaseOrderFormState } from "@/lib/actions/purchase-orders";
import type { PurchaseOrder, Project, Supplier } from "@/lib/types";

type PurchaseOrderAction = (
  state: PurchaseOrderFormState,
  formData: FormData
) => Promise<PurchaseOrderFormState>;

export function PurchaseOrderForm({
  action,
  order,
  suppliers,
  projects,
}: {
  action: PurchaseOrderAction;
  order?: PurchaseOrder;
  suppliers: Pick<Supplier, "id" | "name">[];
  projects: Pick<Project, "id" | "name">[];
}) {
  const [state, formAction, isPending] = useActionState(action, { error: null });

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Référence" htmlFor="reference">
          <input
            id="reference"
            name="reference"
            defaultValue={order?.reference ?? ""}
            placeholder="N° commande interne"
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="Date de commande" htmlFor="order_date" required>
          <input
            id="order_date"
            name="order_date"
            type="date"
            required
            defaultValue={order?.order_date ?? today}
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="Fournisseur" htmlFor="supplier_id">
          <select
            id="supplier_id"
            name="supplier_id"
            defaultValue={order?.supplier_id ?? ""}
            className={FIELD_CLASS}
          >
            <option value="">Sélectionner un fournisseur</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Projet associé" htmlFor="project_id">
          <select
            id="project_id"
            name="project_id"
            defaultValue={order?.project_id ?? ""}
            className={FIELD_CLASS}
          >
            <option value="">Aucun projet</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Statut" htmlFor="status" required>
          <select
            id="status"
            name="status"
            defaultValue={order?.status ?? "brouillon"}
            className={FIELD_CLASS}
          >
            {Object.entries(PURCHASE_ORDER_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Montant total (FC)" htmlFor="total_amount" required>
          <input
            id="total_amount"
            name="total_amount"
            type="number"
            step="0.01"
            min={0}
            required
            defaultValue={order?.total_amount ?? 0}
            className={FIELD_CLASS}
          />
        </FormField>
      </div>

      <FormField label="Notes" htmlFor="notes">
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={order?.notes ?? ""}
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
        <LinkButton href="/achats" variant="outline">
          Annuler
        </LinkButton>
      </div>
    </form>
  );
}
