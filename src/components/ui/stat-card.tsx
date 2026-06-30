import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TONE_CLASS = {
  blue: "bg-blue-600/10 text-blue-600",
  orange: "bg-orange-500/10 text-orange-500",
  green: "bg-green-600/10 text-success",
  danger: "bg-red-600/10 text-danger",
  neutral: "bg-slate-100 text-slate-600",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "blue",
  sub,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: keyof typeof TONE_CLASS;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
      <div className={cn("rounded-xl p-3", TONE_CLASS[tone])}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-0.5 text-2xl font-bold text-navy-950">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
      </div>
    </div>
  );
}
