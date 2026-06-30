import { FolderKanban, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/ui/delete-button";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/table";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_TONE } from "@/lib/labels";
import { deleteProject } from "@/lib/actions/projects";
import Link from "next/link";

export const metadata = { title: "Gestion des projets — Projexa" };

export default async function ProjetsPage() {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("company_id", profile.company_id)
    .order("created_at", { ascending: false });

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

      {!projects || projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="Aucun projet pour le moment"
          description="Créez votre premier projet pour commencer à suivre vos chantiers."
          action={
            <LinkButton href="/projets/nouveau">
              <Plus size={16} /> Nouveau projet
            </LinkButton>
          }
        />
      ) : (
        <Table>
          <Thead>
            <Th>Nom</Th>
            <Th>Client</Th>
            <Th>Statut</Th>
            <Th>Avancement</Th>
            <Th>Budget</Th>
            <Th className="text-right">Actions</Th>
          </Thead>
          <Tbody>
            {projects.map((project) => (
              <Tr key={project.id}>
                <Td className="font-medium">
                  <Link href={`/projets/${project.id}`} className="hover:underline">
                    {project.name}
                  </Link>
                </Td>
                <Td>{project.client_name ?? "—"}</Td>
                <Td>
                  <Badge tone={PROJECT_STATUS_TONE[project.status]}>
                    {PROJECT_STATUS_LABELS[project.status]}
                  </Badge>
                </Td>
                <Td>{project.progress_percent}%</Td>
                <Td>
                  {project.budget != null
                    ? `${Number(project.budget).toLocaleString("fr-FR")} FC`
                    : "—"}
                </Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-4">
                    <Link href={`/projets/${project.id}`} className="text-sm font-medium text-blue-600 hover:underline">
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
      )}
    </div>
  );
}
