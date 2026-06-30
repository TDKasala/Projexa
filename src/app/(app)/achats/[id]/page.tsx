import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { PurchaseOrderForm } from "@/components/achats/purchase-order-form";
import { updatePurchaseOrder } from "@/lib/actions/purchase-orders";

export const metadata = { title: "Modifier la commande — Projexa" };

export default async function ModifierCommandePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const [{ data: order }, { data: suppliers }, { data: projects }] = await Promise.all([
    supabase.from("purchase_orders").select("*").eq("id", id).eq("company_id", profile.company_id).single(),
    supabase.from("suppliers").select("id, name").eq("company_id", profile.company_id).order("name"),
    supabase.from("projects").select("id, name").eq("company_id", profile.company_id).order("name"),
  ]);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={order.reference ?? `Commande ${order.id.slice(0, 8).toUpperCase()}`}
        description="Modifiez les informations de cette commande."
      />
      <div className="rounded-xl border border-border bg-card p-6">
        <PurchaseOrderForm
          action={updatePurchaseOrder.bind(null, id)}
          order={order}
          suppliers={suppliers ?? []}
          projects={projects ?? []}
        />
      </div>
    </div>
  );
}
