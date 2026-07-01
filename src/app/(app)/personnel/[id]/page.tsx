import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Calendar, Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { PersonnelForm } from "@/components/personnel/personnel-form";
import { TimeEntryForm } from "@/components/personnel/time-entry-form";
import { DeleteButton } from "@/components/ui/delete-button";
import { updatePersonnel } from "@/lib/actions/personnel";
import { createTimeEntry, deleteTimeEntry } from "@/lib/actions/time-entries";
import { PERSONNEL_STATUS_LABELS } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Membre du personnel — Projexa" };

export default async function PersonnelDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab = "pointage" } = await searchParams;
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const [{ data: personnel }, { data: projects }] = await Promise.all([
    supabase.from("personnel").select("*").eq("id", id).eq("company_id", profile.company_id).single(),
    supabase.from("projects").select("id, name").eq("company_id", profile.company_id).eq("status", "en_cours").order("name"),
  ]);

  if (!personnel) notFound();

  // Fetch time entries for this month + last month
  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  const fromDate = firstOfMonth.toISOString().slice(0, 10);

  const { data: timeEntries } = await supabase
    .from("time_entries")
    .select("*, projects(name)")
    .eq("personnel_id", id)
    .gte("entry_date", fromDate)
    .order("entry_date", { ascending: false })
    .limit(50);

  const totalHoursMonth = (timeEntries ?? []).reduce((s, e) => s + Number(e.hours), 0);
  const totalDaysMonth = totalHoursMonth / 8;
  const totalCostMonth = personnel.daily_rate
    ? Math.round(totalDaysMonth * Number(personnel.daily_rate) * 100) / 100
    : null;

  const tabs = [
    { key: "pointage", label: "Pointage" },
    { key: "modifier", label: "Modifier" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={personnel.full_name}
        description={[personnel.role, personnel.email].filter(Boolean).join(" · ")}
        action={
          <Badge tone={personnel.status === "actif" ? "success" : "neutral"}>
            {PERSONNEL_STATUS_LABELS[personnel.status]}
          </Badge>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted">
            <Clock size={16} />
            <span className="text-xs">Heures ce mois</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-navy-950">{totalHoursMonth.toFixed(1)}h</p>
          <p className="text-xs text-muted">{totalDaysMonth.toFixed(1)} jours</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted">
            <Briefcase size={16} />
            <span className="text-xs">Taux journalier</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-navy-950">
            {personnel.daily_rate ? `${Number(personnel.daily_rate).toLocaleString("fr-FR")} FC` : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted">
            <Calendar size={16} />
            <span className="text-xs">Coût main-d'œuvre (mois)</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-navy-950">
            {totalCostMonth != null ? `${totalCostMonth.toLocaleString("fr-FR")} FC` : "—"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex gap-1">
          {tabs.map(({ key, label }) => (
            <Link
              key={key}
              href={`/personnel/${id}?tab=${key}`}
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

      {/* Tab: Pointage */}
      {tab === "pointage" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-navy-950">Saisir des heures</h3>
            <TimeEntryForm
              action={createTimeEntry.bind(null, id)}
              projects={projects ?? []}
            />
          </div>

          {(timeEntries ?? []).length === 0 ? (
            <p className="text-sm text-muted">Aucune entrée de temps ce mois-ci.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs text-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Projet</th>
                    <th className="px-4 py-3 text-left font-medium">Heures</th>
                    <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Description</th>
                    <th className="px-4 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {timeEntries!.map((entry) => {
                    const proj = entry.projects as { name: string } | null;
                    return (
                      <tr key={entry.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 text-navy-950">
                          {new Date(entry.entry_date).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-4 py-3 text-muted hidden sm:table-cell">
                          {proj?.name ?? "—"}
                        </td>
                        <td className="px-4 py-3 font-semibold text-navy-950">{entry.hours}h</td>
                        <td className="px-4 py-3 text-muted hidden md:table-cell max-w-xs truncate">
                          {entry.description ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DeleteButton
                            action={deleteTimeEntry.bind(null, entry.id, id)}
                            confirmMessage="Supprimer cette entrée de temps ?"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Modifier */}
      {tab === "modifier" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <PersonnelForm
            action={updatePersonnel.bind(null, id)}
            personnel={personnel}
            projects={projects ?? []}
          />
        </div>
      )}
    </div>
  );
}
