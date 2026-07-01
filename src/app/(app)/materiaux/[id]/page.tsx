import { notFound } from "next/navigation";
import Link from "next/link";
import { TrendingUp, TrendingDown, RefreshCw, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { MaterialForm } from "@/components/materiaux/material-form";
import { MovementForm } from "@/components/materiaux/movement-form";
import { Badge } from "@/components/ui/badge";
import { updateMaterial } from "@/lib/actions/materials";
import { createMaterialMovement } from "@/lib/actions/material-movements";
import { MOVEMENT_TYPE_LABELS, MOVEMENT_TYPE_TONE } from "@/lib/labels";

export const metadata = { title: "Détail matériau — Projexa" };

export default async function MaterielDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab = "mouvements" } = await searchParams;
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const [{ data: material }, { data: projects }, { data: movements }] = await Promise.all([
    supabase.from("materials").select("*").eq("id", id).eq("company_id", profile.company_id).single(),
    supabase.from("projects").select("id, name").eq("company_id", profile.company_id).order("name"),
    supabase
      .from("material_movements")
      .select("*, projects(name)")
      .eq("material_id", id)
      .order("movement_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (!material) notFound();

  const isLowStock = material.min_stock != null && Number(material.quantity) < Number(material.min_stock);
  const totalIn = (movements ?? [])
    .filter((m) => m.movement_type === "entree")
    .reduce((s, m) => s + Number(m.quantity), 0);
  const totalOut = (movements ?? [])
    .filter((m) => m.movement_type === "sortie")
    .reduce((s, m) => s + Number(m.quantity), 0);

  const tabs = [
    { key: "mouvements", label: "Mouvements de stock" },
    { key: "modifier", label: "Modifier" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={material.name}
        description={`Unité : ${material.unit}`}
        action={
          isLowStock ? (
            <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-danger">
              <AlertTriangle size={13} /> Stock bas
            </span>
          ) : undefined
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-navy-950">{Number(material.quantity).toLocaleString("fr-FR")}</p>
          <p className="text-xs text-muted mt-1">Stock actuel ({material.unit})</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-muted">{material.min_stock != null ? Number(material.min_stock).toLocaleString("fr-FR") : "—"}</p>
          <p className="text-xs text-muted mt-1">Seuil minimum</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">+{totalIn.toLocaleString("fr-FR")}</p>
          <p className="text-xs text-muted mt-1">Total entré</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-red-500">-{totalOut.toLocaleString("fr-FR")}</p>
          <p className="text-xs text-muted mt-1">Total sorti</p>
        </div>
      </div>

      {isLowStock && (
        <div className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-orange-500" />
          <p className="text-sm text-orange-700">
            Le stock actuel ({Number(material.quantity)} {material.unit}) est en-dessous du seuil minimum ({Number(material.min_stock)} {material.unit}).
            Un réapprovisionnement de{" "}
            <strong>{(Number(material.min_stock) - Number(material.quantity)).toLocaleString("fr-FR")} {material.unit}</strong> est recommandé.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex gap-1">
          {tabs.map(({ key, label }) => (
            <Link
              key={key}
              href={`/materiaux/${id}?tab=${key}`}
              className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-muted hover:text-navy-950"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Tab: Mouvements */}
      {tab === "mouvements" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-navy-950">Nouveau mouvement de stock</h3>
            <MovementForm
              action={createMaterialMovement.bind(null, id)}
              projects={projects ?? []}
            />
          </div>

          {(movements ?? []).length === 0 ? (
            <p className="text-sm text-muted">Aucun mouvement enregistré.</p>
          ) : (
            <>
              {/* Mobile */}
              <div className="sm:hidden space-y-3">
                {movements!.map((m) => {
                  const proj = (m as unknown as { projects: { name: string } | null }).projects;
                  const Icon = m.movement_type === "entree" ? TrendingUp : m.movement_type === "sortie" ? TrendingDown : RefreshCw;
                  return (
                    <div key={m.id} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Icon size={16} className={m.movement_type === "entree" ? "text-success" : m.movement_type === "sortie" ? "text-danger" : "text-blue-600"} />
                          <Badge tone={MOVEMENT_TYPE_TONE[m.movement_type]}>
                            {MOVEMENT_TYPE_LABELS[m.movement_type]}
                          </Badge>
                        </div>
                        <span className="text-sm font-semibold text-navy-950">
                          {m.movement_type === "sortie" ? "-" : "+"}{Number(m.quantity).toLocaleString("fr-FR")} {material.unit}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
                        <span>{new Date(m.movement_date).toLocaleDateString("fr-FR")}</span>
                        {proj && <span>· {proj.name}</span>}
                        {m.reference && <span>· {m.reference}</span>}
                      </div>
                      {m.notes && <p className="mt-1 text-xs text-muted">{m.notes}</p>}
                    </div>
                  );
                })}
              </div>

              {/* Desktop */}
              <div className="hidden sm:block overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs text-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Date</th>
                      <th className="px-4 py-3 text-left font-medium">Type</th>
                      <th className="px-4 py-3 text-left font-medium">Quantité</th>
                      <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Projet</th>
                      <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Référence</th>
                      <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {movements!.map((m) => {
                      const proj = (m as unknown as { projects: { name: string } | null }).projects;
                      return (
                        <tr key={m.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-muted">{new Date(m.movement_date).toLocaleDateString("fr-FR")}</td>
                          <td className="px-4 py-3">
                            <Badge tone={MOVEMENT_TYPE_TONE[m.movement_type]}>
                              {MOVEMENT_TYPE_LABELS[m.movement_type]}
                            </Badge>
                          </td>
                          <td className={`px-4 py-3 font-semibold ${m.movement_type === "entree" ? "text-success" : m.movement_type === "sortie" ? "text-danger" : "text-navy-950"}`}>
                            {m.movement_type === "sortie" ? "-" : m.movement_type === "ajustement" ? "=" : "+"}{Number(m.quantity).toLocaleString("fr-FR")} {material.unit}
                          </td>
                          <td className="px-4 py-3 text-muted hidden md:table-cell">{proj?.name ?? "—"}</td>
                          <td className="px-4 py-3 text-muted hidden lg:table-cell">{m.reference ?? "—"}</td>
                          <td className="px-4 py-3 text-muted hidden lg:table-cell max-w-xs truncate">{m.notes ?? "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* Tab: Modifier */}
      {tab === "modifier" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <MaterialForm action={updateMaterial.bind(null, id)} material={material} projects={projects ?? []} />
        </div>
      )}
    </div>
  );
}
