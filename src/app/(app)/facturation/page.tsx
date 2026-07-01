import { Receipt, Plus } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/ui/delete-button";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/table";
import {
  INVOICE_TYPE_LABELS,
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_TONE,
} from "@/lib/labels";
import { deleteInvoice } from "@/lib/actions/invoices";

export const metadata = { title: "Facturation & documents commerciaux — Projexa" };

export default async function FacturationPage() {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, invoice_number, type, status, client_name, issue_date, total, projects(name)")
    .eq("company_id", profile.company_id)
    .order("issue_date", { ascending: false });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Facturation & documents commerciaux"
        description="Créez et gérez vos factures et devis."
        action={
          <LinkButton href="/facturation/nouveau">
            <Plus size={16} /> Nouveau document
          </LinkButton>
        }
      />

      {!invoices || invoices.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Aucun document commercial"
          description="Créez votre première facture ou devis pour vos clients."
          action={
            <LinkButton href="/facturation/nouveau">
              <Plus size={16} /> Nouveau document
            </LinkButton>
          }
        />
      ) : (
        <>
          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/facturation/${invoice.id}`}
                      className="block truncate font-semibold text-navy-950 hover:underline"
                    >
                      {invoice.invoice_number ??
                        `DOC-${invoice.id.slice(0, 8).toUpperCase()}`}
                    </Link>
                    <p className="mt-0.5 text-sm text-muted">
                      <span className="font-medium text-navy-900">
                        {INVOICE_TYPE_LABELS[invoice.type]}
                      </span>
                      {invoice.client_name && ` · ${invoice.client_name}`}
                    </p>
                  </div>
                  <Badge tone={INVOICE_STATUS_TONE[invoice.status]}>
                    {INVOICE_STATUS_LABELS[invoice.status]}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm font-medium text-navy-950">
                    {Number(invoice.total).toLocaleString("fr-FR")} FC TTC
                    <span className="ml-2 text-xs text-muted font-normal">
                      {new Date(invoice.issue_date).toLocaleDateString("fr-FR")}
                    </span>
                  </span>
                  <div className="flex gap-3">
                    <Link
                      href={`/facturation/${invoice.id}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Voir
                    </Link>
                    <Link
                      href={`/facturation/${invoice.id}/modifier`}
                      className="text-sm font-medium text-navy-950 hover:underline"
                    >
                      Modifier
                    </Link>
                    <DeleteButton
                      action={deleteInvoice.bind(null, invoice.id)}
                      confirmMessage="Supprimer ce document commercial ?"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block">
            <Table>
              <Thead>
                <Th>N° / Référence</Th>
                <Th>Type</Th>
                <Th>Client</Th>
                <Th className="hidden lg:table-cell">Projet</Th>
                <Th className="hidden md:table-cell">Date</Th>
                <Th>Statut</Th>
                <Th>Total TTC</Th>
                <Th className="text-right">Actions</Th>
              </Thead>
              <Tbody>
                {invoices.map((invoice) => (
                  <Tr key={invoice.id}>
                    <Td className="font-medium">
                      <Link
                        href={`/facturation/${invoice.id}`}
                        className="hover:underline"
                      >
                        {invoice.invoice_number ??
                          `DOC-${invoice.id.slice(0, 8).toUpperCase()}`}
                      </Link>
                    </Td>
                    <Td>{INVOICE_TYPE_LABELS[invoice.type]}</Td>
                    <Td>{invoice.client_name ?? "—"}</Td>
                    <Td className="hidden lg:table-cell">
                      {invoice.projects?.name ?? "—"}
                    </Td>
                    <Td className="hidden md:table-cell">
                      {new Date(invoice.issue_date).toLocaleDateString("fr-FR")}
                    </Td>
                    <Td>
                      <Badge tone={INVOICE_STATUS_TONE[invoice.status]}>
                        {INVOICE_STATUS_LABELS[invoice.status]}
                      </Badge>
                    </Td>
                    <Td>
                      {Number(invoice.total).toLocaleString("fr-FR")} FC
                    </Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/facturation/${invoice.id}`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          Voir
                        </Link>
                        <Link
                          href={`/facturation/${invoice.id}/modifier`}
                          className="text-sm font-medium text-navy-950 hover:underline"
                        >
                          Modifier
                        </Link>
                        <DeleteButton
                          action={deleteInvoice.bind(null, invoice.id)}
                          confirmMessage="Supprimer ce document commercial ?"
                        />
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
