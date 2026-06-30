import { BarChart3, FolderKanban, Users, Boxes, ShoppingCart, Receipt, FileStack } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/table";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_TONE } from "@/lib/labels";

export const metadata = { title: "Synthèse générale — Projexa" };

export default async function SynthesePage() {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const [
    { data: projects },
    { data: personnel },
    { data: materials },
    { data: orders },
    { data: invoices },
    { data: documents },
  ] = await Promise.all([
    supabase.from("projects").select("id, name, status, progress_percent, budget").eq("company_id", profile.company_id),
    supabase.from("personnel").select("id, status").eq("company_id", profile.company_id),
    supabase.from("materials").select("id, quantity, min_stock, unit_price").eq("company_id", profile.company_id),
    supabase.from("purchase_orders").select("total_amount, status").eq("company_id", profile.company_id),
    supabase.from("invoices").select("total, status").eq("company_id", profile.company_id),
    supabase.from("documents").select("id").eq("company_id", profile.company_id),
  ]);

  // Project stats
  const projectList = projects ?? [];
  const activeCount = projectList.filter((p) => p.status === "en_cours").length;
  const terminatedCount = projectList.filter((p) => p.status === "termine").length;
  const totalBudget = projectList.reduce((s, p) => s + Number(p.budget ?? 0), 0);
  const avgProgress = projectList.length > 0
    ? Math.round(projectList.reduce((s, p) => s + p.progress_percent, 0) / projectList.length)
    : 0;

  // Personnel stats
  const activePersonnel = (personnel ?? []).filter((p) => p.status === "actif").length;

  // Stock stats
  const materialList = materials ?? [];
  const totalStockValue = materialList.reduce((s, m) => s + Number(m.quantity) * Number(m.unit_price ?? 0), 0);
  const lowStockCount = materialList.filter((m) => m.min_stock != null && Number(m.quantity) < Number(m.min_stock)).length;

  // Orders stats
  const orderList = orders ?? [];
  const totalOrders = orderList.reduce((s, o) => s + Number(o.total_amount), 0);
  const pendingOrders = orderList.filter((o) => o.status === "envoyee").length;

  // Invoice stats
  const invoiceList = invoices ?? [];
  const totalInvoiced = invoiceList.filter((i) => i.status !== "annulee").reduce((s, i) => s + Number(i.total), 0);
  const paidInvoices = invoiceList.filter((i) => i.status === "payee").reduce((s, i) => s + Number(i.total), 0);

  // Project breakdown by status
  const byStatus = projectList.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <PageHeader
        title="Synthèse générale"
        description="Indicateurs clés consolidés de toute l'activité de votre entreprise."
      />

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Projets en cours"
          value={activeCount}
          icon={FolderKanban}
          tone="blue"
          sub={`${projectList.length} projet(s) au total · ${terminatedCount} terminé(s)`}
        />
        <StatCard
          label="Avancement moyen"
          value={`${avgProgress}%`}
          icon={BarChart3}
          tone="blue"
          sub="Sur tous les projets non annulés"
        />
        <StatCard
          label="Budget total des projets"
          value={`${totalBudget.toLocaleString("fr-FR")} FC`}
          icon={FolderKanban}
          tone="orange"
        />
        <StatCard
          label="Personnel actif"
          value={activePersonnel}
          icon={Users}
          tone="green"
          sub={`${(personnel ?? []).length} membre(s) au total`}
        />
        <StatCard
          label="Valeur du stock"
          value={`${totalStockValue.toLocaleString("fr-FR")} FC`}
          icon={Boxes}
          tone={lowStockCount > 0 ? "danger" : "neutral"}
          sub={lowStockCount > 0 ? `${lowStockCount} article(s) en stock bas` : "Stocks en ordre"}
        />
        <StatCard
          label="Achats engagés"
          value={`${totalOrders.toLocaleString("fr-FR")} FC`}
          icon={ShoppingCart}
          tone="orange"
          sub={`${pendingOrders} commande(s) en attente`}
        />
        <StatCard
          label="CA facturé"
          value={`${totalInvoiced.toLocaleString("fr-FR")} FC`}
          icon={Receipt}
          tone="blue"
          sub={`${paidInvoiced(paidInvoices)} FC encaissé(s)`}
        />
        <StatCard
          label="Documents"
          value={(documents ?? []).length}
          icon={FileStack}
          tone="neutral"
          sub="Fichiers archivés"
        />
      </div>

      {/* Project breakdown */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-navy-950">Répartition des projets par statut</h2>
        <div className="flex flex-wrap gap-3">
          {(Object.entries(byStatus) as [string, number][]).map(([status, count]) => (
            <div key={status} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
              <Badge tone={PROJECT_STATUS_TONE[status as keyof typeof PROJECT_STATUS_TONE] ?? "neutral"}>
                {PROJECT_STATUS_LABELS[status as keyof typeof PROJECT_STATUS_LABELS] ?? status}
              </Badge>
              <span className="text-lg font-bold text-navy-950">{count}</span>
              <span className="text-sm text-muted">projet{count > 1 ? "s" : ""}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Project progress table */}
      {projectList.length > 0 && (
        <div>
          <h2 className="mb-3 text-base font-semibold text-navy-950">Avancement par projet</h2>
          <Table>
            <Thead>
              <Th>Projet</Th>
              <Th>Statut</Th>
              <Th>Avancement</Th>
              <Th>Budget</Th>
            </Thead>
            <Tbody>
              {projectList.map((project) => (
                <Tr key={project.id}>
                  <Td className="font-medium">{project.name}</Td>
                  <Td>
                    <Badge tone={PROJECT_STATUS_TONE[project.status]}>
                      {PROJECT_STATUS_LABELS[project.status]}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${project.progress_percent}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted">{project.progress_percent}%</span>
                    </div>
                  </Td>
                  <Td>
                    {project.budget != null
                      ? `${Number(project.budget).toLocaleString("fr-FR")} FC`
                      : "—"}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

function paidInvoiced(paid: number): string {
  return paid.toLocaleString("fr-FR");
}
