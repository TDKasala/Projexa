import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="rounded-full bg-blue-600/10 p-4">
        <Icon size={28} className="text-blue-600" />
      </div>
      <p className="text-base font-semibold text-navy-950">{title}</p>
      <p className="max-w-md text-sm text-muted">{description}</p>
      {action}
    </div>
  );
}
