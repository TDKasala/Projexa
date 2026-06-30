import type { LucideIcon } from "lucide-react";

export function PagePlaceholder({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">{title}</h1>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-20 text-center">
        <div className="rounded-full bg-blue-600/10 p-4">
          <Icon size={28} className="text-blue-600" />
        </div>
        <p className="text-base font-semibold text-navy-950">
          Module en cours de construction
        </p>
        <p className="max-w-md text-sm text-muted">
          Cette section sera bientôt connectée à vos données Supabase. Revenez
          prochainement pour découvrir les fonctionnalités complètes.
        </p>
      </div>
    </div>
  );
}
