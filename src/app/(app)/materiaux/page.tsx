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
import { deleteMaterial } from "@/lib/actions/materials";

export const metadata = { title: "Gestion des matériaux — Projexa" };

export default async function MateriauxPage() {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  const { data: materials } = await supabase
    .from("materials")
    .select("*, projects(name)")
    .eq("company_id", profile.company_id)
    .order("created_at", { ascending: false });

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

      {!materials || materials.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="Aucun matériau enregistré"
          description="Ajoutez vos matériaux pour suivre vos stocks et vos approvisionnements."
          action={
            <LinkButton href="/materiaux/nouveau">
              <Plus size={16} /> Nouveau matériau
            </LinkButton>
          }
        />
      ) : (
        <Table>
          <Thead>
            <Th>Nom</Th>
            <Th>Projet</Th>
            <Th>Quantité</Th>
            <Th>Prix unitaire</Th>
            <Th>Stock</Th>
            <Th className="text-right">Actions</Th>
          </Thead>
          <Tbody>
            {materials.map((material) => {
              const low =
                material.min_stock != null && Number(material.quantity) < Number(material.min_stock);
              return (
                <Tr key={material.id}>
                  <Td className="font-medium">
                    <Link href={`/materiaux/${material.id}`} className="hover:underline">
                      {material.name}
                    </Link>
                  </Td>
                  <Td>{material.projects?.name ?? "Stock général"}</Td>
                  <Td>
                    {material.quantity} {material.unit}
                  </Td>
                  <Td>
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
                      <Link href={`/materiaux/${material.id}`} className="text-sm font-medium text-blue-600 hover:underline">
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
      )}
    </div>
  );
}
