import { Suspense } from "react";
import { Boxes, Plus, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/ui/delete-button";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/table";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { SearchBar } from "@/components/ui/search-bar";
import { deleteMaterial } from "@/lib/actions/materials";

export const metadata = { title: "Gestion des matériaux — Projexa" };

const PAGE_SIZE = 20;

export default async function MateriauxPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  let query = supabase
    .from("materials")
    .select("*, projects(name)", { count: "exact" })
    .eq("company_id", profile.company_id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q?.trim()) query = query.ilike("name", `%${q.trim()}%`);

  const { data: materials, count } = await query;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion des matériaux"
        description="Suivez vos stocks de matériaux et leurs seuils d'alerte."
        action={
          <LinkButton href="/materiaux/nouveau">
            <Plus size={16} /> Nouveau matériau
          </LinkButton>
        }
      />

      <Suspense fallback={null}>
        <SearchBar placeholder="Rechercher un matériau…" />
      </Suspense>

      {!materials || materials.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title={q ? "Aucun résultat" : "Aucun matériau enregistré"}
          description={
            q
              ? `Aucun résultat pour « ${q} ».`
              : "Ajoutez vos matériaux pour suivre vos stocks et vos approvisionnements."
          }
          action={
            !q ? (
              <LinkButton href="/materiaux/nouveau">
                <Plus size={16} /> Nouveau matériau
              </LinkButton>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {materials.map((material) => {
              const low =
                material.min_stock != null &&
                Number(material.quantity) < Number(material.min_stock);
              return (
                <div
                  key={material.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/materiaux/${material.id}`}
                        className="block truncate font-semibold text-navy-950 hover:underline"
                      >
                        {material.name}
                      </Link>
                      <p className="mt-0.5 text-sm text-muted">
                        {material.projects?.name ?? "Stock général"}
                      </p>
                    </div>
                    {low ? (
                      <Badge tone="danger">
                        <AlertTriangle size={12} className="mr-1" /> Stock bas
                      </Badge>
                    ) : (
                      <Badge tone="success">OK</Badge>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-sm font-medium text-navy-950">
                      {material.quantity} {material.unit}
                      {material.unit_price != null && (
                        <span className="ml-2 text-xs text-muted font-normal">
                          · {Number(material.unit_price).toLocaleString("fr-FR")} FC/{material.unit}
                        </span>
                      )}
                    </span>
                    <div className="flex gap-3">
                      <Link
                        href={`/materiaux/${material.id}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        Modifier
                      </Link>
                      <DeleteButton
                        action={deleteMaterial.bind(null, material.id)}
                        confirmMessage={`Supprimer le matériau "${material.name}" ?`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block">
            <Table>
              <Thead>
                <Th>Nom</Th>
                <Th className="hidden lg:table-cell">Projet</Th>
                <Th>Quantité</Th>
                <Th className="hidden md:table-cell">Prix unitaire</Th>
                <Th>Stock</Th>
                <Th className="text-right">Actions</Th>
              </Thead>
              <Tbody>
                {materials.map((material) => {
                  const low =
                    material.min_stock != null &&
                    Number(material.quantity) < Number(material.min_stock);
                  return (
                    <Tr key={material.id}>
                      <Td className="font-medium">
                        <Link href={`/materiaux/${material.id}`} className="hover:underline">
                          {material.name}
                        </Link>
                      </Td>
                      <Td className="hidden lg:table-cell">
                        {material.projects?.name ?? "Stock général"}
                      </Td>
                      <Td>
                        {material.quantity} {material.unit}
                      </Td>
                      <Td className="hidden md:table-cell">
                        {material.unit_price != null
                          ? `${Number(material.unit_price).toLocaleString("fr-FR")} FC`
                          : "—"}
                      </Td>
                      <Td>
                        {low ? (
                          <Badge tone="danger">
                            <AlertTriangle size={12} className="mr-1" /> Stock bas
                          </Badge>
                        ) : (
                          <Badge tone="success">OK</Badge>
                        )}
                      </Td>
                      <Td className="text-right">
                        <div className="flex justify-end gap-4">
                          <Link
                            href={`/materiaux/${material.id}`}
                            className="text-sm font-medium text-blue-600 hover:underline"
                          >
                            Modifier
                          </Link>
                          <DeleteButton
                            action={deleteMaterial.bind(null, material.id)}
                            confirmMessage={`Supprimer le matériau "${material.name}" ?`}
                          />
                        </div>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </div>

          <PaginationBar
            page={page}
            totalCount={count ?? 0}
            pageSize={PAGE_SIZE}
            baseParams={{ q: q ?? undefined }}
          />
        </>
      )}
    </div>
  );
}
