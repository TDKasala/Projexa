import { Boxes } from "lucide-react";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata = { title: "Gestion des matériaux — Projexa" };

export default function MateriauxPage() {
  return (
    <PagePlaceholder
      title="Gestion des matériaux"
      description="Suivez vos stocks et mouvements de matériaux."
      icon={Boxes}
    />
  );
}
