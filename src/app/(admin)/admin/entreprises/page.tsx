import Link from "next/link";
import { getCompaniesWithStats } from "@/lib/actions/admin";
import { ToggleCompanyButton } from "@/components/admin/toggle-company-button";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function EntreprisesAdminPage() {
  const companies = await getCompaniesWithStats();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Entreprises</h1>
        <p className="mt-1 text-sm text-muted">
          {companies.length} entreprise{companies.length !== 1 ? "s" : ""} sur la
          plateforme
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50 text-left text-xs text-muted uppercase tracking-wide">
              <th className="px-4 py-3">Entreprise</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3 text-center">Utilisateurs</th>
              <th className="px-4 py-3 text-center">Projets</th>
              <th className="px-4 py-3">Inscrite le</th>
              <th className="px-4 py-3 text-center">Statut</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {companies.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
                  Aucune entreprise.
                </td>
              </tr>
            ) : (
              companies.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/entreprises/${c.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{c.email ?? "—"}</td>
                  <td className="px-4 py-3 text-center">{c.users_count}</td>
                  <td className="px-4 py-3 text-center">{c.projects_count}</td>
                  <td className="px-4 py-3 text-muted">{fmtDate(c.created_at)}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={
                        c.is_active
                          ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-success"
                          : "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-danger"
                      }
                    >
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ToggleCompanyButton companyId={c.id} isActive={c.is_active} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
