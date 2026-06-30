import { CalendarRange } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";
import { GanttChart } from "@/components/planning/gantt-chart";

export const metadata = { title: "Planning & gestion du temps — Projexa" };

export default async function PlanningPage() {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, status, start_date, end_date, progress_percent")
    .eq("company_id", profile.company_id)
    .neq("status", "annule")
    .order("start_date", { ascending: true });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planning & gestion du temps"
        description="Visualisez la chronologie de vos projets sur un diagramme de Gantt."
      />

      {!projects || projects.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title="Aucun projet à planifier"
          description="Créez des projets avec des dates de début et de fin pour visualiser votre planning."
          action={<LinkButton href="/projets/nouveau">Nouveau projet</LinkButton>}
        />
      ) : (
        <div className="rounded-xl border border-border bg-card p-4">
          <GanttChart projects={projects} />
        </div>
      )}

      {/* Legend */}
      {projects && projects.length > 0 && (
        <div className="flex flex-wrap gap-4 text-xs text-muted">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-slate-400" /> Planifié
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-blue-600" /> En cours
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-orange-500" /> En pause
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-green-600" /> Terminé
          </div>
          <span className="text-muted">· La zone claire à l&apos;intérieur de la barre représente l&apos;avancement.</span>
        </div>
      )}
    </div>
  );
}
