import { Suspense } from "react";
import { FolderKanban, Plus } from "lucide-react";
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
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_TONE } from "@/lib/labels";
import { deleteProject } from "@/lib/actions/projects";
import Link from "next/link";

export const metadata = { title: "Gestion des projets — Projexa" };

const PAGE_SIZE = 20;

export default async function ProjetsPage({
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
    .from("projects")
    .select("*", { count: "exact" })
    .eq("company_id", profile.company_id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q?.trim()) query = query.ilike("name", `%${q.trim()}%`);

  const { data: projects, count } = await query;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion des projets"
        description="Créez et suivez l'ensemble de vos chantiers."
        action={
          <LinkButton href="/projets/nouveau">
            <Plus size={16} /> Nouveau projet
          </LinkButton>
        }
      />

      <Suspense fallback={null}>
        <SearchBar placeholder="Rechercher un projet…" />
      </Suspense>

      {!projects || projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={q ? "Aucun projet trouvé" : "Aucun projet pour le moment"}
          description={
            q
              ? `Aucun résultat pour « ${q} ».`
              : "Créez votre premier projet pour commencer à suivre vos chantiers."
          }
          action={
            !q ? (
              <LinkButton href="/projets/nouveau">
                <Plus size={16} /> Nouveau projet
              </LinkButton>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/projets/${project.id}`}
                      className="block truncate font-semibold text-navy-950 hover:underline"
                    >
                      {project.name}
                    </Link>
                    {project.client_name && (
                      <p className="mt-0.5 text-sm text-muted truncate">
                        {project.client_name}
                      </p>
                    )}
                  </div>
                  <Badge tone={PROJECT_STATUS_TONE[project.status]}>
                    {PROJECT_STATUS_LABELS[project.status]}
                  </Badge>
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-muted">
                    <span>Avancement</span>
                    <span>{project.progress_percent}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${project.progress_percent}%` }}
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm text-muted">
                    {project.budget != null
                      ? `${Number(project.budget).toLocaleString("fr-FR")} FC`
                      : "Budget non défini"}
                  </span>
                  <div className="flex gap-3">
                    <Link
                      href={`/projets/${project.id}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Modifier
                    </Link>
                    <DeleteButton
                      action={deleteProject.bind(null, project.id)}
                      confirmMessage={`Supprimer le projet "${project.name}" ?`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block">
            <Table>
              <Thead>
                <Th>Nom</Th>
                <Th className="hidden md:table-cell">Client</Th>
                <Th>Statut</Th>
                <Th>Avancement</Th>
                <Th className="hidden lg:table-cell">Budget</Th>
                <Th className="text-right">Actions</Th>
              </Thead>
              <Tbody>
                {projects.map((project) => (
                  <Tr key={project.id}>
                    <Td className="font-medium">
                      <Link
                        href={`/projets/${project.id}`}
                        className="hover:underline"
                      >
                        {project.name}
                      </Link>
                    </Td>
                    <Td className="hidden md:table-cell">
                      {project.client_name ?? "—"}
                    </Td>
                    <Td>
                      <Badge tone={PROJECT_STATUS_TONE[project.status]}>
                        {PROJECT_STATUS_LABELS[project.status]}
                      </Badge>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${project.progress_percent}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted">
                          {project.progress_percent}%
                        </span>
                      </div>
                    </Td>
                    <Td className="hidden lg:table-cell">
                      {project.budget != null
                        ? `${Number(project.budget).toLocaleString("fr-FR")} FC`
                        : "—"}
                    </Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-4">
                        <Link
                          href={`/projets/${project.id}`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          Modifier
                        </Link>
                        <DeleteButton
                          action={deleteProject.bind(null, project.id)}
                          confirmMessage={`Supprimer le projet "${project.name}" ?`}
                        />
                      </div>
                    </Td>
                  </Tr>
                ))}
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
