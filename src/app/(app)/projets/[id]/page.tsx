import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectForm } from "@/components/projets/project-form";
import { updateProject } from "@/lib/actions/projects";

export const metadata = { title: "Modifier le projet — Projexa" };

export default async function ModifierProjetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("company_id", profile.company_id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title={project.name} description="Modifiez les informations du chantier." />
      <div className="rounded-xl border border-border bg-card p-6">
        <ProjectForm action={updateProject.bind(null, id)} project={project} />
      </div>
    </div>
  );
}
