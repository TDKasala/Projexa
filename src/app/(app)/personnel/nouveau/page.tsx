import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { PersonnelForm } from "@/components/personnel/personnel-form";
import { createPersonnel } from "@/lib/actions/personnel";

export const metadata = { title: "Nouveau membre du personnel — Projexa" };

export default async function NouveauPersonnelPage() {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name")
    .eq("company_id", profile.company_id)
    .order("name");

  return (
    <div className="space-y-6">
      <PageHeader title="Nouveau membre du personnel" description="Ajoutez un employé à votre équipe." />
      <div className="rounded-xl border border-border bg-card p-6">
        <PersonnelForm action={createPersonnel} projects={projects ?? []} />
      </div>
    </div>
  );
}
