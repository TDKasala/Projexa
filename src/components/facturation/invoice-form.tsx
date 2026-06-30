"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { FormField, FIELD_CLASS } from "@/components/ui/form-field";
import { Button, LinkButton } from "@/components/ui/button";
import { INVOICE_TYPE_LABELS, INVOICE_STATUS_LABELS } from "@/lib/labels";
import type { InvoiceFormState } from "@/lib/actions/invoices";
import type { Invoice, InvoiceItem, Project } from "@/lib/types";

type InvoiceAction = (
  state: InvoiceFormState,
  formData: FormData
) => Promise<InvoiceFormState>;

type LineItemRow = { id: string; description: string; quantity: string; unit: string; unit_price: string };

function newRow(): LineItemRow {
  return { id: crypto.randomUUID(), description: "", quantity: "1", unit: "", unit_price: "0" };
}

export function InvoiceForm({
  action,
  invoice,
  existingItems,
  projects,
}: {
  action: InvoiceAction;
  invoice?: Invoice;
  existingItems?: InvoiceItem[];
  projects: Pick<Project, "id" | "name">[];
}) {
  const [state, formAction, isPending] = useActionState(action, { error: null });
  const [items, setItems] = useState<LineItemRow[]>(
    existingItems && existingItems.length > 0
      ? existingItems.map((i) => ({
          id: i.id,
          description: i.description,
          quantity: String(i.quantity),
          unit: i.unit ?? "",
          unit_price: String(i.unit_price),
        }))
      : [newRow()]
  );

  const [taxRate, setTaxRate] = useState(String(invoice?.tax_rate ?? 16));

  const subtotal = items.reduce((sum, row) => {
    const q = Number(row.quantity) || 0;
    const p = Number(row.unit_price) || 0;
    return sum + q * p;
  }, 0);
  const tax = subtotal * ((Number(taxRate) || 0) / 100);
  const total = subtotal + tax;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-6">
      {/* Header info */}
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Type de document" htmlFor="type" required>
          <select id="type" name="type" defaultValue={invoice?.type ?? "facture"} className={FIELD_CLASS}>
            {Object.entries(INVOICE_TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </FormField>
        <FormField label="N° de document" htmlFor="invoice_number">
          <input id="invoice_number" name="invoice_number" defaultValue={invoice?.invoice_number ?? ""} className={FIELD_CLASS} />
        </FormField>
        <FormField label="Statut" htmlFor="status">
          <select id="status" name="status" defaultValue={invoice?.status ?? "brouillon"} className={FIELD_CLASS}>
            {Object.entries(INVOICE_STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Date d'émission" htmlFor="issue_date" required>
          <input id="issue_date" name="issue_date" type="date" required defaultValue={invoice?.issue_date ?? today} className={FIELD_CLASS} />
        </FormField>
        <FormField label="Date d'échéance" htmlFor="due_date">
          <input id="due_date" name="due_date" type="date" defaultValue={invoice?.due_date ?? ""} className={FIELD_CLASS} />
        </FormField>
        <FormField label="Projet associé" htmlFor="project_id">
          <select id="project_id" name="project_id" defaultValue={invoice?.project_id ?? ""} className={FIELD_CLASS}>
            <option value="">Aucun</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </FormField>
      </div>

      {/* Client info */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold text-navy-950">Informations client</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Nom / Raison sociale" htmlFor="client_name">
            <input id="client_name" name="client_name" defaultValue={invoice?.client_name ?? ""} className={FIELD_CLASS} />
          </FormField>
          <FormField label="RCCM client" htmlFor="client_rccm">
            <input id="client_rccm" name="client_rccm" defaultValue={invoice?.client_rccm ?? ""} className={FIELD_CLASS} />
          </FormField>
          <FormField label="Téléphone" htmlFor="client_phone">
            <input id="client_phone" name="client_phone" defaultValue={invoice?.client_phone ?? ""} className={FIELD_CLASS} />
          </FormField>
          <FormField label="E-mail" htmlFor="client_email">
            <input id="client_email" name="client_email" type="email" defaultValue={invoice?.client_email ?? ""} className={FIELD_CLASS} />
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="Adresse" htmlFor="client_address">
              <input id="client_address" name="client_address" defaultValue={invoice?.client_address ?? ""} className={FIELD_CLASS} />
            </FormField>
          </div>
        </div>
      </div>

      {/* Line items */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-navy-950">Lignes</h3>
        <div className="space-y-2">
          {/* Header */}
          <div className="hidden grid-cols-[1fr_80px_80px_100px_40px] gap-2 text-xs font-semibold text-muted sm:grid">
            <span>Description *</span>
            <span>Qté</span>
            <span>Unité</span>
            <span>Prix unit. (FC)</span>
            <span />
          </div>
          {items.map((row, idx) => (
            <div key={row.id} className="grid items-center gap-2 sm:grid-cols-[1fr_80px_80px_100px_40px]">
              <input
                name="item_description"
                value={row.description}
                onChange={(e) => setItems((prev) => prev.map((r, i) => i === idx ? { ...r, description: e.target.value } : r))}
                placeholder="Description"
                className={FIELD_CLASS}
              />
              <input
                name="item_quantity"
                type="number"
                min={0}
                step="0.01"
                value={row.quantity}
                onChange={(e) => setItems((prev) => prev.map((r, i) => i === idx ? { ...r, quantity: e.target.value } : r))}
                className={FIELD_CLASS}
              />
              <input
                name="item_unit"
                value={row.unit}
                onChange={(e) => setItems((prev) => prev.map((r, i) => i === idx ? { ...r, unit: e.target.value } : r))}
                placeholder="m², h..."
                className={FIELD_CLASS}
              />
              <input
                name="item_unit_price"
                type="number"
                min={0}
                step="0.01"
                value={row.unit_price}
                onChange={(e) => setItems((prev) => prev.map((r, i) => i === idx ? { ...r, unit_price: e.target.value } : r))}
                className={FIELD_CLASS}
              />
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                disabled={items.length === 1}
                className="rounded-lg p-2 text-muted hover:text-danger disabled:opacity-30"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, newRow()])}
          className="mt-2 flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
        >
          <Plus size={14} /> Ajouter une ligne
        </button>
      </div>

      {/* Totals */}
      <div className="ml-auto w-full max-w-xs space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted">Sous-total HT</span>
          <span className="font-medium">{subtotal.toLocaleString("fr-FR")} FC</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted">TVA</span>
          <div className="flex items-center gap-1">
            <input
              name="tax_rate"
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              className="w-16 rounded border border-border px-2 py-1 text-right text-xs"
            />
            <span className="text-xs text-muted">%</span>
            <span className="ml-2 font-medium">{tax.toLocaleString("fr-FR")} FC</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 text-base font-bold text-navy-950">
          <span>Total TTC</span>
          <span>{total.toLocaleString("fr-FR")} FC</span>
        </div>
      </div>

      {/* Notes */}
      <FormField label="Notes / Conditions" htmlFor="notes">
        <textarea id="notes" name="notes" rows={3} defaultValue={invoice?.notes ?? ""} className={FIELD_CLASS} />
      </FormField>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <LinkButton href="/facturation" variant="outline">Annuler</LinkButton>
      </div>
    </form>
  );
}
