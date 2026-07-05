import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BTN =
  "flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-navy-950 hover:bg-slate-50 disabled:opacity-40";

export function PaginationBar({
  page,
  totalCount,
  pageSize,
  baseParams,
}: {
  page: number;
  totalCount: number;
  pageSize: number;
  baseParams: Record<string, string | undefined>;
}) {
  const totalPages = Math.ceil(totalCount / pageSize);
  if (totalPages <= 1) return null;

  function href(p: number) {
    const params = new URLSearchParams(
      Object.entries({ ...baseParams, page: String(p) }).filter(
        ([, v]) => v !== undefined
      ) as [string, string][]
    );
    return `?${params.toString()}`;
  }

  return (
    <div className="flex items-center justify-between border-t border-border pt-4">
      <p className="text-sm text-muted">
        Page {page} sur {totalPages} &middot; {totalCount} résultat
        {totalCount !== 1 ? "s" : ""}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={href(page - 1)} className={BTN}>
            <ChevronLeft size={14} /> Précédent
          </Link>
        ) : null}
        {page < totalPages ? (
          <Link href={href(page + 1)} className={BTN}>
            Suivant <ChevronRight size={14} />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
