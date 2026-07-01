import { getAuditLogs } from "@/lib/actions/admin";

const ACTION_LABELS: Record<string, string> = {
  company_activated: "Entreprise activée",
  company_deactivated: "Entreprise désactivée",
  update_user_role: "Rôle modifié",
  update_setting: "Paramètre modifié",
  invite_user: "Utilisateur invité",
};

const ACTION_TONE: Record<string, string> = {
  company_activated: "bg-green-100 text-success",
  company_deactivated: "bg-red-100 text-danger",
  update_user_role: "bg-blue-100 text-blue-700",
  update_setting: "bg-orange-100 text-orange-700",
  invite_user: "bg-purple-100 text-purple-700",
};

function fmtDatetime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AuditPage() {
  const logs = await getAuditLogs(0, 100);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Journal d'audit</h1>
          <p className="mt-1 text-sm text-muted">
            100 événements les plus récents — exportez via l'Edge Function{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">
              export-audit-log
            </code>
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50 text-xs text-muted uppercase tracking-wide text-left">
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Acteur</th>
              <th className="px-4 py-3">Cible</th>
              <th className="px-4 py-3">Détails</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  Aucun événement enregistré.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        ACTION_TONE[log.action] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {ACTION_LABELS[log.action] ?? log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-navy-950">{log.actor_label}</td>
                  <td className="px-4 py-3 text-muted">
                    {log.target_type && (
                      <span className="font-medium text-navy-950 mr-1">
                        {log.target_type}
                      </span>
                    )}
                    <span className="truncate max-w-[160px] inline-block align-bottom">
                      {log.target_id ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {log.metadata ? (
                      <code className="block rounded bg-slate-100 px-2 py-1 text-xs font-mono whitespace-pre-wrap max-w-[200px] overflow-hidden">
                        {JSON.stringify(log.metadata, null, 0).slice(0, 80)}
                      </code>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {fmtDatetime(log.created_at)}
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
