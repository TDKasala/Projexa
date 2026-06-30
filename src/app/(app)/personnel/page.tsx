import { Users, Plus } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/ui/delete-button";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/table";
import { PERSONNEL_STATUS_LABELS } from "@/lib/labels";
import { deletePersonnel } from "@/lib/actions/personnel";

export const metadata = { title: "Gestion du personnel — Projexa" };

export default async function PersonnelPage() {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  const { data: personnel } = await supabase
    .from("personnel")
    .select("*, projects(name)")
    .eq("company_id", profile.company_id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion du personnel"
        description="Gérez vos équipes, présences et affectations."
        action={
          <LinkButton href="/personnel/nouveau">
            <Plus size={16} /> Nouveau membre
          </LinkButton>
        }
      />

      {!personnel || personnel.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aucun membre du personnel"
          description="Ajoutez vos employés et affectez-les à vos chantiers."
          action={
            <LinkButton href="/personnel/nouveau">
              <Plus size={16} /> Nouveau membre
            </LinkButton>
          }
        />
      ) : (
        <Table>
          <Thead>
            <Th>Nom</Th>
            <Th>Fonction</Th>
            <Th>Projet</Th>
            <Th>Statut</Th>
            <Th>Taux journalier</Th>
            <Th className="text-right">Actions</Th>
          </Thead>
          <Tbody>
            {personnel.map((person) => (
              <Tr key={person.id}>
                <Td className="font-medium">
                  <Link href={`/personnel/${person.id}`} className="hover:underline">
                    {person.full_name}
                  </Link>
                </Td>
                <Td>{person.role ?? "—"}</Td>
                <Td>{person.projects?.name ?? "—"}</Td>
                <Td>
                  <Badge tone={person.status === "actif" ? "success" : "neutral"}>
                    {PERSONNEL_STATUS_LABELS[person.status]}
                  </Badge>
                </Td>
                <Td>
                  {person.daily_rate != null
                    ? `${Number(person.daily_rate).toLocaleString("fr-FR")} FC`
                    : "—"}
                </Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-4">
                    <Link href={`/personnel/${person.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                      Modifier
                    </Link>
                    <DeleteButton
                      action={deletePersonnel.bind(null, person.id)}
                      confirmMessage={`Supprimer "${person.full_name}" du personnel ?`}
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
