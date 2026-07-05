import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-navy-950">Page introuvable</h1>
      <p className="mt-3 text-sm text-muted">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/tableau-de-bord"
        className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Retour au tableau de bord
      </Link>
    </div>
  );
}
