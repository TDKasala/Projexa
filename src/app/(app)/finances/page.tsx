import { Wallet, TrendingUp, TrendingDown, AlertCircle, Users } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/table";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_TONE } from "@/lib/labels";

export const metadata = { title: "Suivi financier — Projexa" };

export default async function FinancesPage() {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const [{ data: projects }, { data: orders }, { data: invoices }, { data: timeEntries }] = await Promise.all([
    supabase
      .from("projects")
      .select("id, name, status, budget")
      .eq("company_id", profile.company_id)
      .order("created_at", { ascending: false }),
    supabase
      .from("purchase_orders")
      .select("project_id, total_amount, status")
      .eq("company_id", profile.company_id)
      .neq("status", "annulee"),
    supabase
      .from("invoices")
      .select("project_id, total, status")
      .eq("company_id", profile.company_id)
      .neq("status", "annulee"),
    supabase
      .from("time_entries")
      .select("project_id, hours, personnel(daily_rate)")
      .eq("company_id", profile.company_id),
  ]);

  if (!projects || projects.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Suivi financier" description="Suivez budgets, dépenses et écarts par projet." />
        <EmptyState
          icon={Wallet}
          title="Aucun projet"
          description="Créez des projets avec un budget pour commencer le suivi financier."
        />
      </div>
    );
  }

  // Group orders by project
  const materialByProject = new Map<string, number>();
  for (const order of orders ?? []) {
    if (order.project_id) {
      materialByProject.set(
        order.project_id,
        (materialByProject.get(order.project_id) ?? 0) + Number(order.total_amount)
      );
    }
  }

  // Labour cost by project
  const labourByProject = new Map<string, number>();
  for (const e of timeEntries ?? []) {
    if (!e.project_id) continue;
    const dailyRate = (e.personnel as { daily_rate: number | null } | null)?.daily_rate ?? 0;
    const cost = (Number(e.hours) / 8) * dailyRate;
    labourByProject.set(e.project_id, (labourByProject.get(e.project_id) ?? 0) + cost);
  }

  // Revenue by project
  const revenueByProject = new Map<string, number>();
  const paidByProject = new Map<string, number>();
  for (const i of invoices ?? []) {
    if (!i.project_id) continue;
    revenueByProject.set(i.project_id, (revenueByProject.get(i.project_id) ?? 0) + Number(i.total));
    if (i.status === "payee") {
      paidByProject.set(i.project_id, (paidByProject.get(i.project_id) ?? 0) + Number(i.total));
    }
  }

  const rows = projects.map((p) => {
    const budget = Number(p.budget ?? 0);
    const materialCost = materialByProject.get(p.id) ?? 0;
    const labourCost = Math.round((labourByProject.get(p.id) ?? 0) * 100) / 100;
    const totalCost = materialCost + labourCost;
    const revenue = revenueByProject.get(p.id) ?? 0;
    const paid = paidByProject.get(p.id) ?? 0;
    const remaining = budget - totalCost;
    const overBudget = budget > 0 && totalCost > budget;
    const consumedPct = budget > 0 ? Math.min(100, Math.round((totalCost / budget) * 100)) : null;
    const margin = revenue - totalCost;
    return { ...p, budget, materialCost, labourCost, totalCost, revenue, paid, remaining, overBudget, consumedPct, margin };
  });

  const totalBudget = rows.reduce((s, r) => s + r.budget, 0);
  const totalCost = rows.reduce((s, r) => s + r.totalCost, 0);
  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
  const totalPaid = rows.reduce((s, r) => s + r.paid, 0);
  const overCount = rows.filter((r) => r.overBudget).length;
  const totalLabour = rows.reduce((s, r) => s + r.labourCost, 0);

  return (
    <div className="space-y-8">
      <PageHeader title="Suivi financier" description="Suivez budgets, dépenses et écarts par projet." />

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Budget total"
          value={`${totalBudget.toLocaleString("fr-FR")} FC`}
          icon={Wallet}
          tone="blue"
        />
        <StatCard
          label="Coûts engagés"
          value={`${totalCost.toLocaleString("fr-FR")} FC`}
          icon={TrendingUp}
          tone={totalCost > totalBudget ? "danger" : "orange"}
          sub={`dont ${totalLabour.toLocaleString("fr-FR")} FC main-d'œuvre`}
        />
        <StatCard
          label="CA facturé"
          value={`${totalRevenue.toLocaleString("fr-FR")} FC`}
          icon={TrendingDown}
          tone="green"
          sub={`${totalPaid.toLocaleString("fr-FR")} FC encaissé`}
        />
        <StatCard
          label="Projets hors budget"
          value={overCount}
          icon={AlertCircle}
          tone={overCount > 0 ? "danger" : "neutral"}
          sub={overCount > 0 ? "Dépassement détecté" : "Tous dans les limites"}
        />
      </div>

      {/* Per-project table — desktop */}
      <div className="hidden sm:block">
        <Table>
          <Thead>
            <Th>Projet</Th>
            <Th>Statut</Th>
            <Th>Budget</Th>
            <Th>Matériaux/Achats</Th>
            <Th>Main-d'œuvre</Th>
            <Th>Coût total</Th>
            <Th>CA facturé</Th>
            <Th>Consommation</Th>
          </Thead>
          <Tbody>
            {rows.map((row) => (
              <Tr key={row.id}>
                <Td className="font-medium">
                  <Link href={`/projets/${row.id}`} className="hover:underline">{row.name}</Link>
                </Td>
                <Td>
                  <Badge tone={PROJECT_STATUS_TONE[row.status]}>
                    {PROJECT_STATUS_LABELS[row.status]}
                  </Badge>
                </Td>
                <Td>{row.budget > 0 ? `${row.budget.toLocaleString("fr-FR")} FC` : "—"}</Td>
                <Td>{row.materialCost > 0 ? `${row.materialCost.toLocaleString("fr-FR")} FC` : "—"}</Td>
                <Td>
                  {row.labourCost > 0 ? (
                    <span className="flex items-center gap-1">
                      <Users size={12} className="text-muted" />
                      {row.labourCost.toLocaleString("fr-FR")} FC
                    </span>
                  ) : "—"}
                </Td>
                <Td>
                  <span className={row.overBudget ? "font-semibold text-danger" : ""}>
                    {row.totalCost > 0 ? `${row.totalCost.toLocaleString("fr-FR")} FC` : "—"}
                  </span>
                </Td>
                <Td>{row.revenue > 0 ? `${row.revenue.toLocaleString("fr-FR")} FC` : "—"}</Td>
                <Td>
                  {row.consumedPct !== null ? (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full ${row.overBudget ? "bg-red-500" : "bg-blue-600"}`}
                          style={{ width: `${row.consumedPct}%` }}
                        />
                      </div>
                      <span className={`text-xs ${row.overBudget ? "font-semibold text-danger" : "text-muted"}`}>
                        {row.consumedPct}%
                      </span>
                    </div>
                  ) : "—"}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {rows.map((row) => (
          <div key={row.id} className={`rounded-xl border p-4 bg-card ${row.overBudget ? "border-red-200" : "border-border"}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link href={`/projets/${row.id}`} className="block truncate font-semibold text-navy-950 hover:underline">
                  {row.name}
                </Link>
              </div>
              <Badge tone={PROJECT_STATUS_TONE[row.status]}>{PROJECT_STATUS_LABELS[row.status]}</Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-muted">Budget</p>
                <p className="font-medium">{row.budget > 0 ? `${row.budget.toLocaleString("fr-FR")} FC` : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Coût total</p>
                <p className={`font-medium ${row.overBudget ? "text-danger" : ""}`}>
                  {row.totalCost > 0 ? `${row.totalCost.toLocaleString("fr-FR")} FC` : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted">CA facturé</p>
                <p className="font-medium">{row.revenue > 0 ? `${row.revenue.toLocaleString("fr-FR")} FC` : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Marge brute</p>
                <p className={`font-medium ${row.margin < 0 ? "text-danger" : "text-success"}`}>
                  {row.revenue > 0 ? `${row.margin.toLocaleString("fr-FR")} FC` : "—"}
                </p>
              </div>
            </div>
            {row.consumedPct !== null && (
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>Consommation du budget</span>
                  <span className={row.overBudget ? "font-semibold text-danger" : ""}>{row.consumedPct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${row.overBudget ? "bg-red-500" : "bg-blue-600"}`}
                    style={{ width: `${row.consumedPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
