import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { InvoiceForm } from "@/components/facturation/invoice-form";
import { updateInvoice } from "@/lib/actions/invoices";
import { INVOICE_TYPE_LABELS } from "@/lib/labels";

export const metadata = { title: "Modifier le document — Projexa" };

export default async function ModifierFacturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const [{ data: invoice }, { data: items }, { data: projects }] = await Promise.all([
    supabase.from("invoices").select("*").eq("id", id).eq("company_id", profile.company_id).single(),
    supabase.from("invoice_items").select("*").eq("invoice_id", id).order("id"),
    supabase.from("projects").select("id, name").eq("company_id", profile.company_id).order("name"),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Modifier : ${INVOICE_TYPE_LABELS[invoice.type]} ${invoice.invoice_number ?? ""}`}
        description="Modifiez les informations du document commercial."
      />
      <div className="rounded-xl border border-border bg-card p-6">
        <InvoiceForm
          action={updateInvoice.bind(null, id)}
          invoice={invoice}
          existingItems={items ?? []}
          projects={projects ?? []}
        />
      </div>
    </div>
  );
}
