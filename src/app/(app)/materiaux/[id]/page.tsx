import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { MaterialForm } from "@/components/materiaux/material-form";
import { updateMaterial } from "@/lib/actions/materials";

export const metadata = { title: "Modifier le matériau — Projexa" };

export default async function ModifierMaterielPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const [{ data: material }, { data: projects }] = await Promise.all([
    supabase.from("materials").select("*").eq("id", id).eq("company_id", profile.company_id).single(),
    supabase.from("projects").select("id, name").eq("company_id", profile.company_id).order("name"),
  ]);

  if (!material) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title={material.name} description="Modifiez les informations de ce matériau." />
      <div className="rounded-xl border border-border bg-card p-6">
        <MaterialForm action={updateMaterial.bind(null, id)} material={material} projects={projects ?? []} />
      </div>
    </div>
  );
}
