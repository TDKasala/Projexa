import { ShoppingCart, Plus } from "lucide-react";
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
  PURCHASE_ORDER_STATUS_LABELS,
  PURCHASE_ORDER_STATUS_TONE,
} from "@/lib/labels";
import { deletePurchaseOrder } from "@/lib/actions/purchase-orders";

export const metadata = { title: "Achats & approvisionnements — Projexa" };

export default async function AchatsPage() {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("purchase_orders")
    .select("*, suppliers(name), projects(name)")
    .eq("company_id", profile.company_id)
    .order("order_date", { ascending: false });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Achats & approvisionnements"
        description="Gérez vos commandes d'achat et vos fournisseurs."
        action={
          <div className="flex gap-2">
            <LinkButton href="/achats/fournisseurs" variant="outline">
              Fournisseurs
            </LinkButton>
            <LinkButton href="/achats/nouveau">
              <Plus size={16} /> Nouvelle commande
            </LinkButton>
          </div>
        }
      />

      {!orders || orders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Aucune commande d'achat"
          description="Créez vos premières commandes et suivez leur avancement."
          action={
            <LinkButton href="/achats/nouveau">
              <Plus size={16} /> Nouvelle commande
            </LinkButton>
          }
        />
      ) : (
        <>
          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/achats/${order.id}`}
                      className="block truncate font-semibold text-navy-950 hover:underline"
                    >
                      {order.reference ??
                        `CMD-${order.id.slice(0, 8).toUpperCase()}`}
                    </Link>
                    <p className="mt-0.5 text-sm text-muted">
                      {order.suppliers?.name ?? "Fournisseur non défini"}
                      {order.projects?.name && (
                        <span className="ml-1 text-xs">
                          · {order.projects.name}
                        </span>
                      )}
                    </p>
                  </div>
                  <Badge tone={PURCHASE_ORDER_STATUS_TONE[order.status]}>
                    {PURCHASE_ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm font-medium text-navy-950">
                    {Number(order.total_amount).toLocaleString("fr-FR")} FC
                    <span className="ml-2 text-xs text-muted font-normal">
                      {new Date(order.order_date).toLocaleDateString("fr-FR")}
                    </span>
                  </span>
                  <div className="flex gap-3">
                    <Link
                      href={`/achats/${order.id}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Modifier
                    </Link>
                    <DeleteButton
                      action={deletePurchaseOrder.bind(null, order.id)}
                      confirmMessage="Supprimer cette commande d'achat ?"
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
                <Th>Référence</Th>
                <Th>Fournisseur</Th>
                <Th className="hidden lg:table-cell">Projet</Th>
                <Th className="hidden md:table-cell">Date</Th>
                <Th>Statut</Th>
                <Th>Montant</Th>
                <Th className="text-right">Actions</Th>
              </Thead>
              <Tbody>
                {orders.map((order) => (
                  <Tr key={order.id}>
                    <Td className="font-medium">
                      <Link
                        href={`/achats/${order.id}`}
                        className="hover:underline"
                      >
                        {order.reference ??
                          `CMD-${order.id.slice(0, 8).toUpperCase()}`}
                      </Link>
                    </Td>
                    <Td>{order.suppliers?.name ?? "—"}</Td>
                    <Td className="hidden lg:table-cell">
                      {order.projects?.name ?? "—"}
                    </Td>
                    <Td className="hidden md:table-cell">
                      {new Date(order.order_date).toLocaleDateString("fr-FR")}
                    </Td>
                    <Td>
                      <Badge tone={PURCHASE_ORDER_STATUS_TONE[order.status]}>
                        {PURCHASE_ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </Td>
                    <Td>
                      {Number(order.total_amount).toLocaleString("fr-FR")} FC
                    </Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-4">
                        <Link
                          href={`/achats/${order.id}`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          Modifier
                        </Link>
                        <DeleteButton
                          action={deletePurchaseOrder.bind(null, order.id)}
                          confirmMessage="Supprimer cette commande d'achat ?"
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
