import { Camera, Calendar, Users, CircleDot } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_TONE } from "@/lib/labels";

export const metadata = { title: "Suivi de l'avancement — Projexa" };

const PROGRESS_COLOR: Record<string, string> = {
  planifie: "bg-slate-400",
  en_cours: "bg-blue-600",
  en_pause: "bg-orange-500",
  termine: "bg-green-600",
  annule: "bg-red-400",
};

export default async function AvancementPage() {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, status, progress_percent, budget, start_date, end_date, client_name")
    .eq("company_id", profile.company_id)
    .neq("status", "annule")
    .order("status")
    .order("created_at", { ascending: false });

  const { data: personnelCounts } = await supabase
    .from("personnel")
    .select("project_id")
    .eq("company_id", profile.company_id)
    .eq("status", "actif")
    .not("project_id", "is", null);

  const countByProject = new Map<string, number>();
  for (const p of personnelCounts ?? []) {
    if (p.project_id) {
      countByProject.set(p.project_id, (countByProject.get(p.project_id) ?? 0) + 1);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suivi de l'avancement"
        description="Vue d'ensemble de l'avancement de tous vos chantiers."
      />

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
                {/* Header */}
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

                {/* Progress bar */}
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

                {/* Meta */}
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

                {/* Edit link */}
                <div className="mt-4 border-t border-border pt-3">
                  <Link
                    href={`/projets/${project.id}`}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Mettre à jour →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
