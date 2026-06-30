import { FolderKanban, Users, Boxes, AlertTriangle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/table";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_TONE, PURCHASE_ORDER_STATUS_LABELS, PURCHASE_ORDER_STATUS_TONE } from "@/lib/labels";

export const metadata = { title: "Tableau de bord — Projexa" };

export default async function TableauDeBordPage() {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const [
    { data: projects },
    { data: personnel },
    { data: materials },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from("projects").select("id, name, status, progress_percent, budget").eq("company_id", profile.company_id),
    supabase.from("personnel").select("id, status").eq("company_id", profile.company_id),
    supabase.from("materials").select("id, quantity, min_stock").eq("company_id", profile.company_id),
    supabase
      .from("purchase_orders")
      .select("id, reference, status, order_date, total_amount, suppliers(name)")
      .eq("company_id", profile.company_id)
      .order("order_date", { ascending: false })
      .limit(5),
  ]);

  const activeProjects = (projects ?? []).filter((p) => p.status === "en_cours").length;
  const activePersonnel = (personnel ?? []).filter((p) => p.status === "actif").length;
  const lowStockCount = (materials ?? []).filter(
    (m) => m.min_stock != null && Number(m.quantity) < Number(m.min_stock)
  ).length;
  const totalBudget = (projects ?? []).reduce((sum, p) => sum + Number(p.budget ?? 0), 0);

  const recentProjects = (projects ?? [])
    .sort((a) => (a.status === "en_cours" ? -1 : 1))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader title="Tableau de bord" description="Vue d'ensemble de vos projets et activités." />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Projets actifs"
          value={activeProjects}
          icon={FolderKanban}
          tone="blue"
          sub={`${(projects ?? []).length} projet(s) au total`}
        />
        <StatCard
          label="Personnel actif"
          value={activePersonnel}
          icon={Users}
          tone="green"
          sub={`${(personnel ?? []).length} membre(s) au total`}
        />
        <StatCard
          label="Alertes de stock"
          value={lowStockCount}
          icon={Boxes}
          tone={lowStockCount > 0 ? "danger" : "neutral"}
          sub={lowStockCount > 0 ? "Matériaux sous le seuil minimum" : "Stocks en ordre"}
        />
        <StatCard
          label="Budget total"
          value={`${totalBudget.toLocaleString("fr-FR")} FC`}
          icon={TrendingUp}
          tone="orange"
          sub="Tous projets confondus"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Recent projects */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-navy-950">Projets récents</h2>
            <Link href="/projets" className="text-sm text-blue-600 hover:underline">
              Voir tout
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <p className="text-sm text-muted">Aucun projet pour le moment.</p>
          ) : (
            <Table>
              <Thead>
                <Th>Projet</Th>
                <Th>Statut</Th>
                <Th>Avancement</Th>
              </Thead>
              <Tbody>
                {recentProjects.map((project) => (
                  <Tr key={project.id}>
                    <Td className="font-medium">
                      <Link href={`/projets/${project.id}`} className="hover:underline">
                        {project.name}
                      </Link>
                    </Td>
                    <Td>
                      <Badge tone={PROJECT_STATUS_TONE[project.status]}>
                        {PROJECT_STATUS_LABELS[project.status]}
                      </Badge>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${project.progress_percent}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted">{project.progress_percent}%</span>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </div>

        {/* Recent purchase orders */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-navy-950">Dernières commandes</h2>
            <Link href="/achats" className="text-sm text-blue-600 hover:underline">
              Voir tout
            </Link>
          </div>
          {!recentOrders || recentOrders.length === 0 ? (
            <p className="text-sm text-muted">Aucune commande pour le moment.</p>
          ) : (
            <Table>
              <Thead>
                <Th>Référence</Th>
                <Th>Fournisseur</Th>
                <Th>Statut</Th>
                <Th>Montant</Th>
              </Thead>
              <Tbody>
                {recentOrders.map((order) => (
                  <Tr key={order.id}>
                    <Td className="font-medium">
                      <Link href={`/achats/${order.id}`} className="hover:underline">
                        {order.reference ?? `CMD-${order.id.slice(0, 8).toUpperCase()}`}
                      </Link>
                    </Td>
                    <Td>{order.suppliers?.name ?? "—"}</Td>
                    <Td>
                      <Badge tone={PURCHASE_ORDER_STATUS_TONE[order.status]}>
                        {PURCHASE_ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </Td>
                    <Td>{Number(order.total_amount).toLocaleString("fr-FR")} FC</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </div>
      </div>

      {/* Low stock alert */}
      {lowStockCount > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-orange-500" />
          <div>
            <p className="text-sm font-semibold text-orange-700">
              {lowStockCount} matériau{lowStockCount > 1 ? "x" : ""} en-dessous du seuil minimum
            </p>
            <p className="mt-0.5 text-sm text-orange-600">
              <Link href="/materiaux" className="underline">
                Vérifier les stocks
              </Link>{" "}
              pour éviter les ruptures sur vos chantiers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
