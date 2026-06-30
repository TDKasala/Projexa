import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { PersonnelForm } from "@/components/personnel/personnel-form";
import { updatePersonnel } from "@/lib/actions/personnel";

export const metadata = { title: "Modifier le membre du personnel — Projexa" };

export default async function ModifierPersonnelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const [{ data: personnel }, { data: projects }] = await Promise.all([
    supabase.from("personnel").select("*").eq("id", id).eq("company_id", profile.company_id).single(),
    supabase.from("projects").select("id, name").eq("company_id", profile.company_id).order("name"),
  ]);

  if (!personnel) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title={personnel.full_name} description="Modifiez les informations de ce membre." />
      <div className="rounded-xl border border-border bg-card p-6">
        <PersonnelForm action={updatePersonnel.bind(null, id)} personnel={personnel} projects={projects ?? []} />
      </div>
    </div>
  );
}
