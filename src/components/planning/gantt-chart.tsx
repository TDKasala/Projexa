"use client";

import { useMemo } from "react";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_TONE } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/types";

const STATUS_BAR_COLOR: Record<string, string> = {
  planifie: "bg-slate-400",
  en_cours: "bg-blue-600",
  en_pause: "bg-orange-500",
  termine: "bg-green-600",
  annule: "bg-red-400",
};

function monthsBetween(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function GanttChart({
  projects,
}: {
  projects: Pick<Project, "id" | "name" | "status" | "start_date" | "end_date" | "progress_percent">[];
}) {
  const dated = projects.filter((p) => p.start_date);

  const { rangeStart, totalMonths, months } = useMemo(() => {
    if (dated.length === 0) {
      const now = new Date();
      const rangeStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const months: Date[] = [];
      for (let i = 0; i < 6; i++) months.push(addMonths(rangeStart, i));
      return { rangeStart, totalMonths: 6, months };
    }

    const starts = dated.map((p) => new Date(p.start_date!));
    const ends = dated
      .filter((p) => p.end_date)
      .map((p) => new Date(p.end_date!));

    const minDate = new Date(Math.min(...starts.map((d) => d.getTime())));
    const maxDate =
      ends.length > 0
        ? new Date(Math.max(...ends.map((d) => d.getTime())))
        : addMonths(minDate, 6);

    const rangeStart = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const rangeEnd = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 1);
    const totalMonths = Math.max(6, monthsBetween(rangeStart, rangeEnd));

    const months: Date[] = [];
    for (let i = 0; i < totalMonths; i++) months.push(addMonths(rangeStart, i));

    return { rangeStart, totalMonths, months };
  }, [dated]);

  if (dated.length === 0) {
    return (
      <p className="text-sm text-muted">
        Aucun projet avec dates. Ajoutez une date de début pour visualiser le planning.
      </p>
    );
  }

  const FR_MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Month headers */}
        <div className="flex border-b border-border">
          <div className="w-48 shrink-0 border-r border-border" />
          <div className="flex flex-1">
            {months.map((m, i) => (
              <div
                key={i}
                className="flex-1 border-r border-border/50 px-1 py-2 text-center text-xs font-medium text-muted last:border-r-0"
              >
                {FR_MONTHS[m.getMonth()]} {m.getFullYear() !== new Date().getFullYear() && m.getFullYear()}
              </div>
            ))}
          </div>
        </div>

        {/* Project rows */}
        {dated.map((project) => {
          const start = new Date(project.start_date!);
          const end = project.end_date ? new Date(project.end_date) : addMonths(start, 1);

          const startOffset = Math.max(
            0,
            (monthsBetween(rangeStart, start) * 100) / totalMonths
          );
          const endOffset = Math.min(
            100,
            (monthsBetween(rangeStart, end) * 100) / totalMonths
          );
          const barWidth = Math.max(endOffset - startOffset, 100 / totalMonths);

          return (
            <div key={project.id} className="flex border-b border-border/50 last:border-0">
              <div className="flex w-48 shrink-0 items-center border-r border-border px-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-navy-950">{project.name}</p>
                  <Badge tone={PROJECT_STATUS_TONE[project.status]} className="mt-0.5">
                    {PROJECT_STATUS_LABELS[project.status]}
                  </Badge>
                </div>
              </div>
              <div className="relative flex flex-1 items-center py-3">
                {/* Grid lines */}
                {months.map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 border-r border-border/30"
                    style={{ left: `${(i * 100) / totalMonths}%` }}
                  />
                ))}
                {/* Bar */}
                <div
                  className="absolute h-7 rounded-md"
                  style={{
                    left: `${startOffset}%`,
                    width: `${barWidth}%`,
                  }}
                >
                  <div className={`h-full w-full overflow-hidden rounded-md ${STATUS_BAR_COLOR[project.status]}`}>
                    <div
                      className="h-full bg-white/30"
                      style={{ width: `${project.progress_percent}%` }}
                    />
                  </div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {project.progress_percent > 0 && `${project.progress_percent}%`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
