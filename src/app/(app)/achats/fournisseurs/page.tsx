import { Building2, Plus } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/table";
import { deleteSupplier } from "@/lib/actions/suppliers";

export const metadata = { title: "Fournisseurs — Projexa" };

export default async function FournisseursPage() {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("*")
    .eq("company_id", profile.company_id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fournisseurs"
        description="Gérez votre carnet de fournisseurs."
        action={
          <div className="flex gap-2">
            <LinkButton href="/achats" variant="outline">
              Commandes
            </LinkButton>
            <LinkButton href="/achats/fournisseurs/nouveau">
              <Plus size={16} /> Nouveau fournisseur
            </LinkButton>
          </div>
        }
      />

      {!suppliers || suppliers.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Aucun fournisseur enregistré"
          description="Ajoutez vos fournisseurs pour les associer à vos commandes d'achat."
          action={
            <LinkButton href="/achats/fournisseurs/nouveau">
              <Plus size={16} /> Nouveau fournisseur
            </LinkButton>
          }
        />
      ) : (
        <Table>
          <Thead>
            <Th>Nom</Th>
            <Th>Contact</Th>
            <Th>Téléphone</Th>
            <Th>E-mail</Th>
            <Th className="text-right">Actions</Th>
          </Thead>
          <Tbody>
            {suppliers.map((supplier) => (
              <Tr key={supplier.id}>
                <Td className="font-medium">
                  <Link href={`/achats/fournisseurs/${supplier.id}`} className="hover:underline">
                    {supplier.name}
                  </Link>
                </Td>
                <Td>{supplier.contact_name ?? "—"}</Td>
                <Td>{supplier.phone ?? "—"}</Td>
                <Td>{supplier.email ?? "—"}</Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-4">
                    <Link href={`/achats/fournisseurs/${supplier.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                      Modifier
                    </Link>
                    <DeleteButton
                      action={deleteSupplier.bind(null, supplier.id)}
                      confirmMessage={`Supprimer le fournisseur "${supplier.name}" ?`}
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
