import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { InvoiceForm } from "@/components/facturation/invoice-form";
import { createInvoice } from "@/lib/actions/invoices";

export const metadata = { title: "Nouveau document commercial — Projexa" };

export default async function NouvelleFacturePage() {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name")
    .eq("company_id", profile.company_id)
    .order("name");

  return (
    <div className="space-y-6">
      <PageHeader title="Nouveau document commercial" description="Créez une facture ou un devis." />
      <div className="rounded-xl border border-border bg-card p-6">
        <InvoiceForm action={createInvoice} projects={projects ?? []} />
      </div>
    </div>
  );
}
