import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Circle, Calendar, Users, Flag, ClipboardList, Edit, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { ProjectForm } from "@/components/projets/project-form";
import { TaskForm } from "@/components/projets/task-form";
import { MilestoneForm } from "@/components/projets/milestone-form";
import { DeleteButton } from "@/components/ui/delete-button";
import { updateProject } from "@/lib/actions/projects";
import { createTask, deleteTask, toggleTaskStatus } from "@/lib/actions/tasks";
import { createMilestone, toggleMilestone, deleteMilestone } from "@/lib/actions/milestones";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_TONE,
  TASK_STATUS_LABELS,
  TASK_STATUS_TONE,
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_TONE,
} from "@/lib/labels";

export const metadata = { title: "Détail du projet — Projexa" };

export default async function ProjetDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab = "taches" } = await searchParams;
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const [
    { data: project },
    { data: tasks },
    { data: milestones },
    { data: teamPersonnel },
    { data: allPersonnel },
    { data: reports },
  ] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).eq("company_id", profile.company_id).single(),
    supabase
      .from("project_tasks")
      .select("*, personnel(id, full_name)")
      .eq("project_id", id)
      .order("sort_order")
      .order("created_at"),
    supabase
      .from("project_milestones")
      .select("*")
      .eq("project_id", id)
      .order("due_date"),
    supabase
      .from("personnel")
      .select("id, full_name, role, status, daily_rate")
      .eq("project_id", id)
      .eq("company_id", profile.company_id),
    supabase
      .from("personnel")
      .select("id, full_name")
      .eq("company_id", profile.company_id)
      .eq("status", "actif"),
    supabase
      .from("progress_reports")
      .select("*")
      .eq("project_id", id)
      .order("report_date", { ascending: false })
      .limit(5),
  ]);

  if (!project) notFound();

  const doneTasks = (tasks ?? []).filter((t) => t.status === "termine").length;
  const totalTasks = (tasks ?? []).length;
  const doneMilestones = (milestones ?? []).filter((m) => m.completed_at).length;

  const tabs = [
    { key: "taches", label: "Tâches", icon: ClipboardList, count: totalTasks },
    { key: "jalons", label: "Jalons", icon: Flag, count: (milestones ?? []).length },
    { key: "equipe", label: "Équipe", icon: Users, count: (teamPersonnel ?? []).length },
    { key: "modifier", label: "Modifier", icon: Edit },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={project.name}
        description={project.client_name ? `Client : ${project.client_name}` : "Gestion complète du projet"}
        action={
          <div className="flex gap-2">
            <Badge tone={PROJECT_STATUS_TONE[project.status]}>
              {PROJECT_STATUS_LABELS[project.status]}
            </Badge>
          </div>
        }
      />

      {/* Progress overview */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-navy-950">{project.progress_percent}%</p>
          <p className="text-xs text-muted mt-1">Avancement</p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-blue-600" style={{ width: `${project.progress_percent}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-navy-950">{doneTasks}/{totalTasks}</p>
          <p className="text-xs text-muted mt-1">Tâches terminées</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-navy-950">{doneMilestones}/{(milestones ?? []).length}</p>
          <p className="text-xs text-muted mt-1">Jalons atteints</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-navy-950">
            {project.budget != null ? `${Number(project.budget).toLocaleString("fr-FR")}` : "—"}
          </p>
          <p className="text-xs text-muted mt-1">Budget (FC)</p>
        </div>
      </div>

      {/* Dates banner */}
      {(project.start_date || project.end_date) && (
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm text-blue-700">
          <Calendar size={14} />
          <span>
            {project.start_date
              ? new Date(project.start_date).toLocaleDateString("fr-FR")
              : "Date de début inconnue"}
            {" → "}
            {project.end_date
              ? new Date(project.end_date).toLocaleDateString("fr-FR")
              : "En cours"}
          </span>
        </div>
      )}

      {/* Tab nav */}
      <div className="border-b border-border">
        <nav className="-mb-px flex gap-1 overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon, count }) => (
            <Link
              key={key}
              href={`/projets/${id}?tab=${key}`}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-muted hover:text-navy-950"
              }`}
            >
              <Icon size={15} />
              {label}
              {count !== undefined && (
                <span className={`rounded-full px-1.5 py-0.5 text-xs ${tab === key ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-muted"}`}>
                  {count}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Tab: Tâches */}
      {tab === "taches" && (
        <div className="space-y-6">
          {/* Add task form */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-navy-950">Nouvelle tâche</h3>
            <TaskForm
              action={createTask.bind(null, id)}
              personnel={allPersonnel ?? []}
            />
          </div>

          {/* Task list */}
          {(tasks ?? []).length === 0 ? (
            <p className="text-sm text-muted">Aucune tâche pour le moment. Créez la première ci-dessus.</p>
          ) : (
            <div className="space-y-2">
              {tasks!.map((task) => {
                const assignee = task.personnel as { id: string; full_name: string } | null;
                const isDone = task.status === "termine";
                return (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${
                      isDone ? "border-green-200 bg-green-50/50" : "border-border bg-card"
                    }`}
                  >
                    <form action={toggleTaskStatus.bind(null, task.id, id, task.status)} className="mt-0.5 shrink-0">
                      <button type="submit" className="text-muted hover:text-green-600">
                        {isDone ? (
                          <CheckCircle2 size={18} className="text-green-600" />
                        ) : (
                          <Circle size={18} />
                        )}
                      </button>
                    </form>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-medium text-sm ${isDone ? "line-through text-muted" : "text-navy-950"}`}>
                          {task.title}
                        </span>
                        <Badge tone={TASK_PRIORITY_TONE[task.priority]}>
                          {TASK_PRIORITY_LABELS[task.priority]}
                        </Badge>
                        <Badge tone={TASK_STATUS_TONE[task.status]}>
                          {TASK_STATUS_LABELS[task.status]}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="mt-0.5 text-xs text-muted">{task.description}</p>
                      )}
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted">
                        {assignee && <span>Assigné : {assignee.full_name}</span>}
                        {task.due_date && (
                          <span className={`flex items-center gap-1 ${
                            !isDone && new Date(task.due_date) < new Date() ? "text-danger font-medium" : ""
                          }`}>
                            <Calendar size={11} />
                            {new Date(task.due_date).toLocaleDateString("fr-FR")}
                          </span>
                        )}
                      </div>
                    </div>
                    <DeleteButton
                      action={deleteTask.bind(null, task.id, id)}
                      confirmMessage={`Supprimer la tâche "${task.title}" ?`}
                      label=""
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Jalons */}
      {tab === "jalons" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-navy-950">Nouveau jalon</h3>
            <MilestoneForm action={createMilestone.bind(null, id)} />
          </div>

          {(milestones ?? []).length === 0 ? (
            <p className="text-sm text-muted">Aucun jalon défini. Créez le premier ci-dessus.</p>
          ) : (
            <div className="space-y-2">
              {milestones!.map((m) => {
                const isCompleted = !!m.completed_at;
                const isOverdue = !isCompleted && new Date(m.due_date) < new Date();
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 rounded-xl border p-4 ${
                      isCompleted ? "border-green-200 bg-green-50/50" : isOverdue ? "border-red-200 bg-red-50/50" : "border-border bg-card"
                    }`}
                  >
                    <form action={toggleMilestone.bind(null, m.id, id, isCompleted)} className="mt-0.5 shrink-0">
                      <button type="submit">
                        {isCompleted ? (
                          <CheckCircle2 size={18} className="text-green-600" />
                        ) : (
                          <Circle size={18} className={isOverdue ? "text-danger" : "text-muted"} />
                        )}
                      </button>
                    </form>
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium text-sm ${isCompleted ? "line-through text-muted" : "text-navy-950"}`}>
                        {m.title}
                      </p>
                      <div className="mt-0.5 flex flex-wrap gap-3 text-xs text-muted">
                        <span className={`flex items-center gap-1 ${isOverdue ? "text-danger font-medium" : ""}`}>
                          <Calendar size={11} />
                          {new Date(m.due_date).toLocaleDateString("fr-FR")}
                          {isOverdue && " — En retard"}
                          {isCompleted && m.completed_at && ` — Complété le ${new Date(m.completed_at).toLocaleDateString("fr-FR")}`}
                        </span>
                      </div>
                      {m.notes && <p className="mt-0.5 text-xs text-muted">{m.notes}</p>}
                    </div>
                    <DeleteButton
                      action={deleteMilestone.bind(null, m.id, id)}
                      confirmMessage={`Supprimer le jalon "${m.title}" ?`}
                      label=""
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Équipe */}
      {tab === "equipe" && (
        <div className="space-y-4">
          {(teamPersonnel ?? []).length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <Users size={32} className="mx-auto mb-2 text-muted" />
              <p className="text-sm text-muted">Aucun membre affecté à ce projet.</p>
              <LinkButton href="/personnel/nouveau" className="mt-3 inline-flex">
                Ajouter du personnel
              </LinkButton>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {teamPersonnel!.map((p) => (
                <div key={p.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-sm font-bold text-blue-600">
                      {p.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <Link href={`/personnel/${p.id}`} className="block truncate font-semibold text-navy-950 hover:underline text-sm">
                        {p.full_name}
                      </Link>
                      {p.role && <p className="text-xs text-muted truncate">{p.role}</p>}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
                    <span className={p.status === "actif" ? "text-success font-medium" : "text-muted"}>
                      {p.status === "actif" ? "Actif" : "Inactif"}
                    </span>
                    {p.daily_rate && <span>{Number(p.daily_rate).toLocaleString("fr-FR")} FC/jour</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent reports */}
          {(reports ?? []).length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold text-navy-950">Derniers rapports d'avancement</h3>
              <div className="space-y-3">
                {reports!.map((r) => (
                  <div key={r.id} className="border-l-2 border-blue-300 pl-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-navy-950">
                        {new Date(r.report_date).toLocaleDateString("fr-FR")} — {r.overall_percent}%
                      </p>
                      {r.workers_present && (
                        <span className="text-xs text-muted">{r.workers_present} ouvriers</span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-muted">{r.summary}</p>
                  </div>
                ))}
              </div>
              <Link href="/avancement" className="mt-3 block text-xs text-blue-600 hover:underline">
                Voir tous les rapports →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab: Modifier */}
      {tab === "modifier" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <ProjectForm action={updateProject.bind(null, id)} project={project} />
        </div>
      )}
    </div>
  );
}
