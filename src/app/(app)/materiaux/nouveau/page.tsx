import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { MaterialForm } from "@/components/materiaux/material-form";
import { createMaterial } from "@/lib/actions/materials";

export const metadata = { title: "Nouveau matériau — Projexa" };

export default async function NouveauMaterielPage() {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name")
    .eq("company_id", profile.company_id)
    .order("name");

  return (
    <div className="space-y-6">
      <PageHeader title="Nouveau matériau" description="Enregistrez un matériau dans votre stock." />
      <div className="rounded-xl border border-border bg-card p-6">
        <MaterialForm action={createMaterial} projects={projects ?? []} />
      </div>
    </div>
  );
}
