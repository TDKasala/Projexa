import { Wallet, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
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

  const [{ data: projects }, { data: orders }] = await Promise.all([
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
  ]);

  if (!projects || projects.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Suivi financier"
          description="Suivez budgets, dépenses et écarts par projet."
        />
        <EmptyState
          icon={Wallet}
          title="Aucun projet"
          description="Créez des projets avec un budget pour commencer le suivi financier."
        />
      </div>
    );
  }

  // Group orders by project
  const spendByProject = new Map<string, number>();
  for (const order of orders ?? []) {
    if (order.project_id) {
      spendByProject.set(
        order.project_id,
        (spendByProject.get(order.project_id) ?? 0) + Number(order.total_amount)
      );
    }
  }

  const rows = projects.map((p) => {
    const budget = Number(p.budget ?? 0);
    const spent = spendByProject.get(p.id) ?? 0;
    const remaining = budget - spent;
    const overBudget = budget > 0 && spent > budget;
    const consumedPercent = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : null;
    return { ...p, budget, spent, remaining, overBudget, consumedPercent };
  });

  const totalBudget = rows.reduce((s, r) => s + r.budget, 0);
  const totalSpent = rows.reduce((s, r) => s + r.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overCount = rows.filter((r) => r.overBudget).length;

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
          label="Dépenses engagées"
          value={`${totalSpent.toLocaleString("fr-FR")} FC`}
          icon={TrendingUp}
          tone={totalSpent > totalBudget ? "danger" : "orange"}
        />
        <StatCard
          label="Solde restant"
          value={`${totalRemaining.toLocaleString("fr-FR")} FC`}
          icon={TrendingDown}
          tone={totalRemaining < 0 ? "danger" : "green"}
        />
        <StatCard
          label="Projets hors budget"
          value={overCount}
          icon={AlertCircle}
          tone={overCount > 0 ? "danger" : "neutral"}
          sub={overCount > 0 ? "Dépassement détecté" : "Tous dans les limites"}
        />
      </div>

      {/* Per-project breakdown */}
      <Table>
        <Thead>
          <Th>Projet</Th>
          <Th>Statut</Th>
          <Th>Budget</Th>
          <Th>Dépensé</Th>
          <Th>Restant</Th>
          <Th>Consommation</Th>
        </Thead>
        <Tbody>
          {rows.map((row) => (
            <Tr key={row.id}>
              <Td className="font-medium">{row.name}</Td>
              <Td>
                <Badge tone={PROJECT_STATUS_TONE[row.status]}>
                  {PROJECT_STATUS_LABELS[row.status]}
                </Badge>
              </Td>
              <Td>
                {row.budget > 0 ? `${row.budget.toLocaleString("fr-FR")} FC` : "—"}
              </Td>
              <Td>{row.spent > 0 ? `${row.spent.toLocaleString("fr-FR")} FC` : "—"}</Td>
              <Td>
                {row.budget > 0 ? (
                  <span className={row.overBudget ? "font-semibold text-danger" : ""}>
                    {row.remaining.toLocaleString("fr-FR")} FC
                  </span>
                ) : (
                  "—"
                )}
              </Td>
              <Td>
                {row.consumedPercent !== null ? (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${row.overBudget ? "bg-red-500" : "bg-blue-600"}`}
                        style={{ width: `${row.consumedPercent}%` }}
                      />
                    </div>
                    <span className={`text-xs ${row.overBudget ? "font-semibold text-danger" : "text-muted"}`}>
                      {row.consumedPercent}%
                    </span>
                  </div>
                ) : (
                  "—"
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}
