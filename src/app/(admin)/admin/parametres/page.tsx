import { getSystemSettings } from "@/lib/actions/admin";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function ParametresAdminPage() {
  const settings = await getSystemSettings();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Paramètres système</h1>
        <p className="mt-1 text-sm text-muted">
          Configuration globale de la plateforme Projexa.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        {settings.length === 0 ? (
          <p className="text-sm text-muted">
            Aucun paramètre. Appliquez la migration{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">
              0005_supadmin.sql
            </code>{" "}
            pour initialiser les valeurs par défaut.
          </p>
        ) : (
          <SettingsForm settings={settings} />
        )}
      </div>

      {/* Déploiement des Edge Functions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-3 font-semibold text-navy-950">Edge Functions</h2>
        <p className="mb-4 text-sm text-muted">
          Les fonctions suivantes sont déployées dans{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">
            supabase/functions/
          </code>
          . Déployez-les via{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">
            supabase functions deploy
          </code>
          .
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              name: "invite-user",
              desc: "Envoie une invitation e-mail et affecte l'utilisateur à une entreprise.",
              method: "POST",
            },
            {
              name: "company-stats",
              desc: "Retourne des statistiques agrégées par entreprise (utilisateurs, projets, budget, CA).",
              method: "GET",
            },
            {
              name: "export-audit-log",
              desc: "Exporte le journal d'audit au format CSV avec filtrage par date.",
              method: "GET",
            },
          ].map((fn) => (
            <div
              key={fn.name}
              className="flex items-start gap-3 rounded-lg border border-border p-3"
            >
              <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono font-medium">
                {fn.method}
              </span>
              <div>
                <p className="text-sm font-semibold text-navy-950">{fn.name}</p>
                <p className="text-xs text-muted">{fn.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
