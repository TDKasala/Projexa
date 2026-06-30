import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { PurchaseOrderForm } from "@/components/achats/purchase-order-form";
import { createPurchaseOrder } from "@/lib/actions/purchase-orders";

export const metadata = { title: "Nouvelle commande — Projexa" };

export default async function NouvelleCommandePage() {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  const [{ data: suppliers }, { data: projects }] = await Promise.all([
    supabase.from("suppliers").select("id, name").eq("company_id", profile.company_id).order("name"),
    supabase.from("projects").select("id, name").eq("company_id", profile.company_id).order("name"),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Nouvelle commande d'achat" description="Enregistrez une commande auprès d'un fournisseur." />
      <div className="rounded-xl border border-border bg-card p-6">
        <PurchaseOrderForm
          action={createPurchaseOrder}
          suppliers={suppliers ?? []}
          projects={projects ?? []}
        />
      </div>
    </div>
  );
}
