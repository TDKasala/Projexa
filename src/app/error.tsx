"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-danger">Erreur</p>
      <h1 className="mt-2 text-2xl font-bold text-navy-950">
        Une erreur est survenue
      </h1>
      <p className="mt-2 text-sm text-muted">
        Quelque chose s&apos;est mal passé. Réessayez ou revenez au tableau de bord.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Réessayer
        </button>
        <Link
          href="/tableau-de-bord"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-navy-950 hover:bg-slate-50"
        >
          Tableau de bord
        </Link>
      </div>
    </div>
  );
}
