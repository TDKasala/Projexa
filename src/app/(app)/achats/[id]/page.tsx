import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/ui/delete-button";
import { PurchaseOrderForm } from "@/components/achats/purchase-order-form";
import { POItemForm } from "@/components/achats/po-item-form";
import { updatePurchaseOrder } from "@/lib/actions/purchase-orders";
import { createPOItem, deletePOItem } from "@/lib/actions/purchase-order-items";
import { PURCHASE_ORDER_STATUS_LABELS, PURCHASE_ORDER_STATUS_TONE } from "@/lib/labels";

export const metadata = { title: "Commande d'achat — Projexa" };

export default async function CommandeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab = "lignes" } = await searchParams;
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const [{ data: order }, { data: items }, { data: suppliers }, { data: projects }] = await Promise.all([
    supabase
      .from("purchase_orders")
      .select("*, suppliers(name, phone, email), projects(name)")
      .eq("id", id)
      .eq("company_id", profile.company_id)
      .single(),
    supabase
      .from("purchase_order_items")
      .select("*")
      .eq("purchase_order_id", id)
      .order("sort_order"),
    supabase.from("suppliers").select("id, name").eq("company_id", profile.company_id).order("name"),
    supabase.from("projects").select("id, name").eq("company_id", profile.company_id).order("name"),
  ]);

  if (!order) notFound();

  const supplier = order.suppliers as { name: string; phone: string | null; email: string | null } | null;
  const project = order.projects as { name: string } | null;
  const totalFromItems = (items ?? []).reduce((s, i) => s + Number(i.total), 0);

  const tabs = [
    { key: "lignes", label: "Lignes de commande" },
    { key: "modifier", label: "Modifier" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={order.reference ?? `CMD-${id.slice(0, 8).toUpperCase()}`}
        description={[
          supplier?.name && `Fournisseur : ${supplier.name}`,
          project?.name && `Projet : ${project.name}`,
        ].filter(Boolean).join(" · ")}
        action={
          <Badge tone={PURCHASE_ORDER_STATUS_TONE[order.status]}>
            {PURCHASE_ORDER_STATUS_LABELS[order.status]}
          </Badge>
        }
      />

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted">Date de commande</p>
          <p className="mt-1 text-lg font-semibold text-navy-950">
            {new Date(order.order_date).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted">Lignes</p>
          <p className="mt-1 text-lg font-semibold text-navy-950">{(items ?? []).length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted">Total TTC</p>
          <p className="mt-1 text-lg font-bold text-navy-950">
            {(totalFromItems || Number(order.total_amount)).toLocaleString("fr-FR")} FC
          </p>
        </div>
      </div>

      {supplier && (
        <div className="rounded-xl border border-border bg-card p-4 text-sm">
          <p className="font-semibold text-navy-950">{supplier.name}</p>
          <div className="mt-1 flex flex-wrap gap-3 text-muted">
            {supplier.phone && <span>{supplier.phone}</span>}
            {supplier.email && <span>{supplier.email}</span>}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex gap-1">
          {tabs.map(({ key, label }) => (
            <Link
              key={key}
              href={`/achats/${id}?tab=${key}`}
              className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-muted hover:text-navy-950"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Tab: Lignes */}
      {tab === "lignes" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-navy-950">Ajouter une ligne</h3>
            <POItemForm action={createPOItem.bind(null, id)} />
          </div>

          {(items ?? []).length === 0 ? (
            <p className="text-sm text-muted">Aucune ligne. Ajoutez des articles ci-dessus.</p>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="sm:hidden space-y-3">
                {items!.map((item) => (
                  <div key={item.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-navy-950 text-sm">{item.description}</p>
                      <DeleteButton
                        action={deletePOItem.bind(null, item.id, id)}
                        confirmMessage="Supprimer cette ligne ?"
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                      <span>{Number(item.quantity).toLocaleString("fr-FR")} {item.unit ?? "unité(s)"}</span>
                      <span>× {Number(item.unit_price).toLocaleString("fr-FR")} FC</span>
                      <span className="font-semibold text-navy-950">= {Number(item.total).toLocaleString("fr-FR")} FC</span>
                    </div>
                  </div>
                ))}
                <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 text-right">
                  <p className="text-xs text-muted">Total</p>
                  <p className="text-xl font-bold text-navy-950">{totalFromItems.toLocaleString("fr-FR")} FC</p>
                </div>
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs text-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Description</th>
                      <th className="px-4 py-3 text-right font-medium">Qté</th>
                      <th className="px-4 py-3 text-left font-medium">Unité</th>
                      <th className="px-4 py-3 text-right font-medium">P.U. (FC)</th>
                      <th className="px-4 py-3 text-right font-medium">Total (FC)</th>
                      <th className="px-4 py-3 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items!.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 text-navy-950">{item.description}</td>
                        <td className="px-4 py-3 text-right text-muted">{Number(item.quantity).toLocaleString("fr-FR")}</td>
                        <td className="px-4 py-3 text-muted">{item.unit ?? "—"}</td>
                        <td className="px-4 py-3 text-right text-muted">{Number(item.unit_price).toLocaleString("fr-FR")}</td>
                        <td className="px-4 py-3 text-right font-semibold text-navy-950">{Number(item.total).toLocaleString("fr-FR")}</td>
                        <td className="px-4 py-3 text-right">
                          <DeleteButton
                            action={deletePOItem.bind(null, item.id, id)}
                            confirmMessage="Supprimer cette ligne ?"
                          />
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50 font-semibold">
                      <td colSpan={4} className="px-4 py-3 text-right text-navy-950">Total</td>
                      <td className="px-4 py-3 text-right text-lg text-navy-950">{totalFromItems.toLocaleString("fr-FR")} FC</td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {order.notes && (
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted mb-1">Notes</p>
              <p className="text-sm text-navy-950">{order.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Modifier */}
      {tab === "modifier" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <PurchaseOrderForm
            action={updatePurchaseOrder.bind(null, id)}
            order={order}
            suppliers={suppliers ?? []}
            projects={projects ?? []}
          />
        </div>
      )}
    </div>
  );
}
