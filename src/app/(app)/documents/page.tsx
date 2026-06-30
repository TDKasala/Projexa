import { FileStack, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { DeleteButton } from "@/components/ui/delete-button";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/table";
import { DocumentUploadForm } from "@/components/documents/document-upload-form";
import { uploadDocument, deleteDocument } from "@/lib/actions/documents";

export const metadata = { title: "Gestion documentaire — Projexa" };

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default async function DocumentsPage() {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const [{ data: documents }, { data: projects }] = await Promise.all([
    supabase
      .from("documents")
      .select("*, projects(name)")
      .eq("company_id", profile.company_id)
      .order("created_at", { ascending: false }),
    supabase
      .from("projects")
      .select("id, name")
      .eq("company_id", profile.company_id)
      .order("name"),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gestion documentaire"
        description="Centralisez plans, contrats, rapports et devis."
      />

      {/* Upload form */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold text-navy-950">Ajouter un document</h2>
        <DocumentUploadForm action={uploadDocument} projects={projects ?? []} />
      </div>

      {/* Documents list */}
      {!documents || documents.length === 0 ? (
        <EmptyState
          icon={FileStack}
          title="Aucun document téléversé"
          description="Téléversez vos plans, contrats et rapports pour les retrouver facilement."
        />
      ) : (
        <Table>
          <Thead>
            <Th>Nom</Th>
            <Th>Projet</Th>
            <Th>Taille</Th>
            <Th>Date</Th>
            <Th className="text-right">Actions</Th>
          </Thead>
          <Tbody>
            {documents.map((doc) => {
              const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(doc.file_path);
              return (
                <Tr key={doc.id}>
                  <Td className="font-medium">{doc.name}</Td>
                  <Td>{doc.projects?.name ?? "Général"}</Td>
                  <Td>{formatFileSize(doc.file_size)}</Td>
                  <Td>{new Date(doc.created_at).toLocaleDateString("fr-FR")}</Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-4">
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                      >
                        <Download size={14} /> Télécharger
                      </a>
                      <DeleteButton
                        action={deleteDocument.bind(null, doc.id, doc.file_path)}
                        confirmMessage={`Supprimer le document "${doc.name}" ?`}
                      />
                    </div>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}
    </div>
  );
}
