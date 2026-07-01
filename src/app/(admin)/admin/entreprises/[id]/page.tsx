import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCompanyDetail } from "@/lib/actions/admin";
import { InviteUserForm } from "@/components/admin/invite-user-form";
import { UpdateRoleForm } from "@/components/admin/update-role-form";
import { ToggleCompanyButton } from "@/components/admin/toggle-company-button";

const ROLE_LABELS: Record<string, string> = {
  owner: "Propriétaire",
  admin: "Administrateur",
  manager: "Manager",
  member: "Membre",
};

const STATUS_LABELS: Record<string, string> = {
  planifie: "Planifié",
  en_cours: "En cours",
  en_pause: "En pause",
  termine: "Terminé",
  annule: "Annulé",
};

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function EntrepriseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { company, users, projects } = await getCompanyDetail(id);

  if (!company) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/entreprises"
          className="flex items-center gap-1.5 text-sm text-muted hover:text-navy-950 transition-colors"
        >
          <ArrowLeft size={15} />
          Entreprises
        </Link>
      </div>

      {/* En-tête entreprise */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-950">{company.name}</h1>
            <p className="mt-1 text-sm text-muted">ID : {company.id}</p>
          </div>
          <ToggleCompanyButton companyId={company.id} isActive={company.is_active} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-xs text-muted uppercase tracking-wide">E-mail</p>
            <p className="mt-0.5 text-navy-950">{company.email ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wide">Téléphone</p>
            <p className="mt-0.5 text-navy-950">{company.phone ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wide">RCCM</p>
            <p className="mt-0.5 text-navy-950">{company.rccm ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wide">N° Impôt</p>
            <p className="mt-0.5 text-navy-950">{company.n_impot ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wide">TVA</p>
            <p className="mt-0.5 text-navy-950">{company.tva ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wide">Inscrite le</p>
            <p className="mt-0.5 text-navy-950">{fmtDate(company.created_at)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Utilisateurs */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-navy-950">
              Utilisateurs ({users.length})
            </h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-muted uppercase tracking-wide text-left">
                <th className="px-4 py-2.5">Nom</th>
                <th className="px-4 py-2.5">E-mail</th>
                <th className="px-4 py-2.5">Rôle</th>
                <th className="px-4 py-2.5">Inscrit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted">
                    Aucun utilisateur.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-navy-950">{u.full_name ?? "—"}</p>
                      {u.is_superadmin && (
                        <span className="text-xs text-orange-500 font-medium">
                          superadmin
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">{u.email ?? "—"}</td>
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

        {/* Inviter un utilisateur */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-semibold text-navy-950">Inviter un utilisateur</h2>
          <InviteUserForm companyId={company.id} />
        </div>
      </div>

      {/* Projets récents */}
      {projects.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-navy-950">
              Projets récents ({projects.length})
            </h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-muted uppercase tracking-wide text-left">
                <th className="px-4 py-2.5">Nom</th>
                <th className="px-4 py-2.5">Statut</th>
                <th className="px-4 py-2.5 text-right">Avancement</th>
                <th className="px-4 py-2.5">Début</th>
                <th className="px-4 py-2.5">Fin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-navy-950">{p.name}</td>
                  <td className="px-4 py-3 text-muted">
                    {STATUS_LABELS[p.status] ?? p.status}
                  </td>
                  <td className="px-4 py-3 text-right">{p.progress_percent} %</td>
                  <td className="px-4 py-3 text-muted">{fmtDate(p.start_date)}</td>
                  <td className="px-4 py-3 text-muted">{fmtDate(p.end_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
