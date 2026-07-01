import Link from "next/link";
import { getAllUsers } from "@/lib/actions/admin";
import { UpdateRoleForm } from "@/components/admin/update-role-form";

const ROLE_LABELS: Record<string, string> = {
  owner: "Propriétaire",
  admin: "Administrateur",
  manager: "Manager",
  member: "Membre",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function UtilisateursAdminPage() {
  const users = await getAllUsers();

  const superadmins = users.filter((u) => u.is_superadmin);
  const regular = users.filter((u) => !u.is_superadmin);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Utilisateurs</h1>
        <p className="mt-1 text-sm text-muted">
          {users.length} utilisateur{users.length !== 1 ? "s" : ""} —{" "}
          {superadmins.length} superadmin{superadmins.length !== 1 ? "s" : ""}
        </p>
      </div>

      {superadmins.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted uppercase tracking-wide">
            Superadmins
          </h2>
          <div className="rounded-xl border border-orange-200 bg-orange-50 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-orange-200 text-xs text-orange-700 uppercase tracking-wide text-left">
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3">Inscrit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {superadmins.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-medium text-navy-950">
                      {u.full_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted">{u.email ?? "—"}</td>
                    <td className="px-4 py-3 text-muted">{fmtDate(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted uppercase tracking-wide">
          Tous les utilisateurs
        </h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50 text-xs text-muted uppercase tracking-wide text-left">
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Entreprise</th>
                <th className="px-4 py-3">Rôle</th>
                <th className="px-4 py-3">Inscrit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {regular.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
                    Aucun utilisateur.
                  </td>
                </tr>
              ) : (
                regular.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-navy-950">
                      {u.full_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted">{u.email ?? "—"}</td>
                    <td className="px-4 py-3">
                      {u.company_id ? (
                        <Link
                          href={`/admin/entreprises/${u.company_id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {u.company_name}
                        </Link>
                      ) : (
                        <span className="text-muted">Sans entreprise</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <UpdateRoleForm userId={u.id} currentRole={u.role} />
                    </td>
                    <td className="px-4 py-3 text-muted">{fmtDate(u.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
