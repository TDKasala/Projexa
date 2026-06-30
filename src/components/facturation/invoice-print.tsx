"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Invoice, InvoiceItem, Company } from "@/lib/types";
import { INVOICE_TYPE_LABELS } from "@/lib/labels";

function fmt(n: number): string {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export function InvoicePrint({
  invoice,
  items,
  company,
}: {
  invoice: Invoice;
  items: InvoiceItem[];
  company: Company;
}) {
  return (
    <div>
      {/* Print button — hidden in print */}
      <div className="mb-4 flex gap-3 print:hidden">
        <Button variant="outline" onClick={() => window.print()}>
          <Printer size={16} /> Imprimer
        </Button>
      </div>

      {/* Invoice document */}
      <div
        id="invoice-print"
        className="mx-auto min-h-[297mm] w-full max-w-[210mm] bg-white p-12 shadow-sm print:shadow-none print:p-0"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-navy-950 pb-6">
          <div>
            {company.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logo_url} alt={company.name} className="mb-2 h-14 object-contain" />
            )}
            <h1 className="text-xl font-bold text-navy-950">{company.name}</h1>
            {company.address && <p className="mt-0.5 text-xs text-slate-600">{company.address}</p>}
            {company.phone && <p className="text-xs text-slate-600">Tél : {company.phone}</p>}
            {company.email && <p className="text-xs text-slate-600">{company.email}</p>}
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-blue-600">
              {INVOICE_TYPE_LABELS[invoice.type].toUpperCase()}
            </p>
            <p className="mt-1 text-sm font-semibold text-navy-950">
              N° {invoice.invoice_number ?? `DOC-${invoice.id.slice(0, 8).toUpperCase()}`}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Date d&apos;émission : {fmtDate(invoice.issue_date)}
            </p>
            {invoice.due_date && (
              <p className="text-xs text-slate-500">Échéance : {fmtDate(invoice.due_date)}</p>
            )}
          </div>
        </div>

        {/* Company identifiers + client */}
        <div className="mt-6 grid grid-cols-2 gap-8">
          <div className="space-y-1 text-xs text-slate-600">
            <p className="mb-1 font-semibold text-navy-950">Émetteur</p>
            {company.rccm && <p><span className="font-medium">RCCM :</span> {company.rccm}</p>}
            {company.id_national && <p><span className="font-medium">ID National :</span> {company.id_national}</p>}
            {company.n_impot && <p><span className="font-medium">N° Impôt :</span> {company.n_impot}</p>}
            {company.tva && <p><span className="font-medium">N° TVA :</span> {company.tva}</p>}
          </div>
          <div className="space-y-1 text-xs text-slate-600">
            <p className="mb-1 font-semibold text-navy-950">Client</p>
            {invoice.client_name && <p className="font-semibold">{invoice.client_name}</p>}
            {invoice.client_rccm && <p><span className="font-medium">RCCM :</span> {invoice.client_rccm}</p>}
            {invoice.client_address && <p>{invoice.client_address}</p>}
            {invoice.client_phone && <p>Tél : {invoice.client_phone}</p>}
            {invoice.client_email && <p>{invoice.client_email}</p>}
          </div>
        </div>

        {/* Line items table */}
        <div className="mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-950 text-left text-xs text-white">
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2 text-right">Qté</th>
                <th className="px-3 py-2">Unité</th>
                <th className="px-3 py-2 text-right">Prix unitaire</th>
                <th className="px-3 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 1 ? "bg-slate-50" : ""}>
                  <td className="px-3 py-2">{item.description}</td>
                  <td className="px-3 py-2 text-right">{item.quantity}</td>
                  <td className="px-3 py-2 text-slate-500">{item.unit ?? "—"}</td>
                  <td className="px-3 py-2 text-right">{fmt(Number(item.unit_price))} FC</td>
                  <td className="px-3 py-2 text-right font-medium">{fmt(Number(item.total))} FC</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="ml-auto mt-4 w-64 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Sous-total HT</span>
            <span>{fmt(Number(invoice.subtotal))} FC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">TVA ({invoice.tax_rate}%)</span>
            <span>{fmt(Number(invoice.tax_amount))} FC</span>
          </div>
          <div className="flex justify-between border-t-2 border-navy-950 pt-2 text-base font-bold text-navy-950">
            <span>Total TTC</span>
            <span>{fmt(Number(invoice.total))} FC</span>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-8 border-t border-slate-200 pt-4">
            <p className="mb-1 text-xs font-semibold text-navy-950">Notes / Conditions</p>
            <p className="text-xs text-slate-600">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
          {company.name} —{" "}
          {[company.rccm && `RCCM ${company.rccm}`, company.n_impot && `N° Impôt ${company.n_impot}`]
            .filter(Boolean)
            .join(" · ")}
        </div>
      </div>
    </div>
  );
}
