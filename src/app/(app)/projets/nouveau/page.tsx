import { PageHeader } from "@/components/ui/page-header";
import { ProjectForm } from "@/components/projets/project-form";
import { createProject } from "@/lib/actions/projects";

export const metadata = { title: "Nouveau projet — Projexa" };

export default function NouveauProjetPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Nouveau projet" description="Renseignez les informations du chantier." />
      <div className="rounded-xl border border-border bg-card p-6">
        <ProjectForm action={createProject} />
      </div>
    </div>
  );
}
