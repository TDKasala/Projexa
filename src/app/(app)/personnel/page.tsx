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
        <>
          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {personnel.map((person) => (
              <div
                key={person.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/personnel/${person.id}`}
                      className="block truncate font-semibold text-navy-950 hover:underline"
                    >
                      {person.full_name}
                    </Link>
                    <p className="mt-0.5 text-sm text-muted">
                      {person.role ?? "Rôle non défini"}
                      {person.projects?.name && (
                        <span className="ml-1 text-xs">· {person.projects.name}</span>
                      )}
                    </p>
                  </div>
                  <Badge
                    tone={person.status === "actif" ? "success" : "neutral"}
                  >
                    {PERSONNEL_STATUS_LABELS[person.status]}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm text-muted">
                    {person.daily_rate != null
                      ? `${Number(person.daily_rate).toLocaleString("fr-FR")} FC/j`
                      : "Taux non défini"}
                  </span>
                  <div className="flex gap-3">
                    <Link
                      href={`/personnel/${person.id}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Modifier
                    </Link>
                    <DeleteButton
                      action={deletePersonnel.bind(null, person.id)}
                      confirmMessage={`Supprimer "${person.full_name}" du personnel ?`}
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
                <Th className="hidden md:table-cell">Fonction</Th>
                <Th className="hidden lg:table-cell">Projet</Th>
                <Th>Statut</Th>
                <Th className="hidden md:table-cell">Taux journalier</Th>
                <Th className="text-right">Actions</Th>
              </Thead>
              <Tbody>
                {personnel.map((person) => (
                  <Tr key={person.id}>
                    <Td className="font-medium">
                      <Link
                        href={`/personnel/${person.id}`}
                        className="hover:underline"
                      >
                        {person.full_name}
                      </Link>
                    </Td>
                    <Td className="hidden md:table-cell">
                      {person.role ?? "—"}
                    </Td>
                    <Td className="hidden lg:table-cell">
                      {person.projects?.name ?? "—"}
                    </Td>
                    <Td>
                      <Badge
                        tone={person.status === "actif" ? "success" : "neutral"}
                      >
                        {PERSONNEL_STATUS_LABELS[person.status]}
                      </Badge>
                    </Td>
                    <Td className="hidden md:table-cell">
                      {person.daily_rate != null
                        ? `${Number(person.daily_rate).toLocaleString("fr-FR")} FC`
                        : "—"}
                    </Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-4">
                        <Link
                          href={`/personnel/${person.id}`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
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
          </div>
        </>
      )}
    </div>
  );
}
