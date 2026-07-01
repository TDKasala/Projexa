import { Camera, Calendar, Users, CircleDot, Plus, FileText } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { ProgressReportForm } from "@/components/avancement/progress-report-form";
import { createProgressReportFromForm, deleteProgressReport } from "@/lib/actions/progress-reports";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_TONE } from "@/lib/labels";

export const metadata = { title: "Suivi de l'avancement — Projexa" };

const PROGRESS_COLOR: Record<string, string> = {
  planifie: "bg-slate-400",
  en_cours: "bg-blue-600",
  en_pause: "bg-orange-500",
  termine: "bg-green-600",
  annule: "bg-red-400",
};

export default async function AvancementPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "projets" } = await searchParams;
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const [{ data: projects }, { data: personnelCounts }, { data: allReports }] = await Promise.all([
    supabase
      .from("projects")
      .select("id, name, status, progress_percent, budget, start_date, end_date, client_name")
      .eq("company_id", profile.company_id)
      .neq("status", "annule")
      .order("status")
      .order("created_at", { ascending: false }),
    supabase
      .from("personnel")
      .select("project_id")
      .eq("company_id", profile.company_id)
      .eq("status", "actif")
      .not("project_id", "is", null),
    supabase
      .from("progress_reports")
      .select("*, projects(name)")
      .eq("company_id", profile.company_id)
      .order("report_date", { ascending: false })
      .limit(30),
  ]);

  const countByProject = new Map<string, number>();
  for (const p of personnelCounts ?? []) {
    if (p.project_id) {
      countByProject.set(p.project_id, (countByProject.get(p.project_id) ?? 0) + 1);
    }
  }

  const activeProjects = (projects ?? []).filter((p) => p.status === "en_cours");

  const tabs = [
    { key: "projets", label: "Vue projets" },
    { key: "rapports", label: "Rapports" },
    { key: "nouveau-rapport", label: "+ Nouveau rapport" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suivi de l'avancement"
        description="Vue d'ensemble de l'avancement de tous vos chantiers."
      />

      {/* Tab nav */}
      <div className="border-b border-border">
        <nav className="-mb-px flex gap-1">
          {tabs.map(({ key, label }) => (
            <Link
              key={key}
              href={`/avancement?tab=${key}`}
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

      {/* Tab: Projets */}
      {tab === "projets" && (
        <>
          {!projects || projects.length === 0 ? (
            <EmptyState
              icon={Camera}
              title="Aucun projet actif"
              description="Créez un projet et mettez à jour son avancement pour le suivre ici."
              action={<LinkButton href="/projets/nouveau">Nouveau projet</LinkButton>}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => {
                const personnel = countByProject.get(project.id) ?? 0;
                const color = PROGRESS_COLOR[project.status] ?? "bg-slate-400";
                return (
                  <div
                    key={project.id}
                    className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-navy-950">{project.name}</h3>
                        {project.client_name && (
                          <p className="mt-0.5 text-xs text-muted">{project.client_name}</p>
                        )}
                      </div>
                      <Badge tone={PROJECT_STATUS_TONE[project.status]}>
                        {PROJECT_STATUS_LABELS[project.status]}
                      </Badge>
                    </div>

                    <div className="mt-4">
                      <div className="mb-1 flex items-center justify-between text-xs text-muted">
                        <span>Avancement</span>
                        <span className="font-semibold text-navy-950">{project.progress_percent}%</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full transition-all ${color}`}
                          style={{ width: `${project.progress_percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
                      {(project.start_date || project.end_date) && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {project.start_date
                            ? new Date(project.start_date).toLocaleDateString("fr-FR", { month: "short", day: "numeric", year: "2-digit" })
                            : "—"}
                          {" → "}
                          {project.end_date
                            ? new Date(project.end_date).toLocaleDateString("fr-FR", { month: "short", day: "numeric", year: "2-digit" })
                            : "En cours"}
                        </span>
                      )}
                      {personnel > 0 && (
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {personnel} membre{personnel > 1 ? "s" : ""}
                        </span>
                      )}
                      {project.budget && (
                        <span className="flex items-center gap-1">
                          <CircleDot size={12} />
                          {Number(project.budget).toLocaleString("fr-FR")} FC
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <Link
                        href={`/projets/${project.id}?tab=taches`}
                        className="text-xs font-medium text-blue-600 hover:underline"
                      >
                        Voir les tâches →
                      </Link>
                      <Link
                        href={`/avancement?tab=nouveau-rapport`}
                        className="text-xs text-muted hover:text-navy-950"
                      >
                        + Rapport
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Tab: Rapports */}
      {tab === "rapports" && (
        <div className="space-y-4">
          {(allReports ?? []).length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Aucun rapport d'avancement"
              description="Soumettez votre premier rapport de chantier pour le voir apparaître ici."
              action={
                <Link
                  href="/avancement?tab=nouveau-rapport"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Plus size={16} /> Nouveau rapport
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {allReports!.map((report) => {
                const proj = report.projects as { name: string } | null;
                return (
                  <div key={report.id} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-navy-950">{proj?.name ?? "Projet"}</span>
                          <span className="text-xs text-muted">
                            {new Date(report.report_date).toLocaleDateString("fr-FR", {
                              weekday: "long", year: "numeric", month: "long", day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-blue-600"
                              style={{ width: `${report.overall_percent}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-navy-950">{report.overall_percent}%</span>
                        </div>
                      </div>
                      <DeleteButton
                        action={deleteProgressReport.bind(null, report.id, report.project_id)}
                        confirmMessage="Supprimer ce rapport ?"
                      />
                    </div>
                    <p className="mt-3 text-sm text-navy-950">{report.summary}</p>
                    {report.problems && (
                      <div className="mt-2 rounded-lg bg-orange-50 px-3 py-2">
                        <p className="text-xs font-medium text-orange-700">Problèmes</p>
                        <p className="text-xs text-orange-600 mt-0.5">{report.problems}</p>
                      </div>
                    )}
                    {report.next_steps && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-muted">Prochaines étapes</p>
                        <p className="text-xs text-navy-950 mt-0.5">{report.next_steps}</p>
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted border-t border-border pt-3">
                      {report.workers_present && <span>👷 {report.workers_present} ouvriers</span>}
                      {report.weather && <span>🌤 {report.weather}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Nouveau rapport */}
      {tab === "nouveau-rapport" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-navy-950">Nouveau rapport d'avancement</h3>
          <ProgressReportForm
            action={createProgressReportFromForm}
            projects={projects ?? []}
          />
        </div>
      )}
    </div>
  );
}
