"use client";

import { useTransition } from "react";
import { toggleCompany } from "@/lib/actions/admin";

export function ToggleCompanyButton({
  companyId,
  isActive,
}: {
  companyId: string;
  isActive: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleCompany(companyId, !isActive);
        })
      }
      className={
        isActive
          ? "rounded px-2.5 py-1 text-xs font-medium bg-red-50 text-danger hover:bg-red-100 disabled:opacity-50 transition-colors"
          : "rounded px-2.5 py-1 text-xs font-medium bg-green-50 text-success hover:bg-green-100 disabled:opacity-50 transition-colors"
      }
    >
      {pending ? "…" : isActive ? "Désactiver" : "Activer"}
    </button>
  );
}
