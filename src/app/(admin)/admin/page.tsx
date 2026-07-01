import {
  Building2,
  Users,
  FolderKanban,
  FileText,
  ShieldCheck,
  TrendingUp,
  Activity,
  CheckCircle,
} from "lucide-react";
import { getAdminOverview } from "@/lib/actions/admin";
import { StatCard } from "@/components/ui/stat-card";

function fmtCurrency(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const ACTION_LABELS: Record<string, string> = {
  company_activated: "Entreprise activée",
  company_deactivated: "Entreprise désactivée",
  update_user_role: "Rôle modifié",
  update_setting: "Paramètre modifié",
  invite_user: "Utilisateur invité",
};

export default async function AdminDashboardPage() {
  const data = await getAdminOverview();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Vue d'ensemble</h1>
        <p className="mt-1 text-sm text-muted">Métriques globales de la plateforme Projexa</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        <StatCard
          label="Entreprises actives"
          value={`${data.activeCompanies} / ${data.totalCompanies}`}
          icon={Building2}
          tone="blue"
        />
        <StatCard
          label="Utilisateurs"
          value={data.totalUsers}
          icon={Users}
          sub={`dont ${data.superAdmins} superadmin(s)`}
          tone="orange"
        />
        <StatCard
          label="Projets (toutes ent.)"
          value={data.totalProjects}
          icon={FolderKanban}
          tone="neutral"
        />
        <StatCard
          label="Factures émises"
          value={data.totalInvoices}
          icon={FileText}
          tone="neutral"
        />
        <StatCard
          label="Budget cumulé"
          value={fmtCurrency(data.totalBudget)}
          icon={TrendingUp}
          tone="green"
        />
        <StatCard
          label="Ratio actives"
          value={
            data.totalCompanies > 0
              ? `${Math.round((data.activeCompanies / data.totalCompanies) * 100)} %`
              : "—"
          }
          icon={CheckCircle}
          tone="green"
        />
        <StatCard
          label="Superadmins"
          value={data.superAdmins}
          icon={ShieldCheck}
          tone="orange"
        />
        <StatCard
          label="Événements d'audit"
          value={data.recentLogs.length > 0 ? data.recentLogs.length + "+" : "0"}
          icon={Activity}
          tone="neutral"
          sub="10 derniers affichés"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Dernières entreprises */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold text-navy-950">
            Dernières entreprises inscrites
          </h2>
          {data.recentCompanies.length === 0 ? (
            <p className="text-sm text-muted">Aucune entreprise.</p>
          ) : (
            <div className="divide-y divide-border">
              {data.recentCompanies.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-navy-950">{c.name}</p>
                    <p className="text-xs text-muted">{c.email ?? "—"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        c.is_active
                          ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-success"
                          : "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-danger"
                      }
                    >
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs text-muted">{fmtDate(c.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Journal d'audit récent */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold text-navy-950">
            Dernières actions admin
          </h2>
          {data.recentLogs.length === 0 ? (
            <p className="text-sm text-muted">Aucune action enregistrée.</p>
          ) : (
            <div className="divide-y divide-border">
              {data.recentLogs.map((log) => (
                <div key={log.id} className="flex items-start justify-between gap-2 py-3">
                  <div>
                    <p className="text-sm font-medium text-navy-950">
                      {ACTION_LABELS[log.action] ?? log.action}
                    </p>
                    {log.target_id && (
                      <p className="text-xs text-muted truncate max-w-[200px]">
                        {log.target_type} : {log.target_id}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-muted">
                    {fmtDate(log.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
