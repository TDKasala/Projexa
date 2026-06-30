import { FolderKanban } from "lucide-react";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata = { title: "Gestion des projets — Projexa" };

export default function ProjetsPage() {
  return (
    <PagePlaceholder
      title="Gestion des projets"
      description="Créez et suivez l'ensemble de vos chantiers."
      icon={FolderKanban}
    />
  );
}
