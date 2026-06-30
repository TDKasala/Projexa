import { LayoutDashboard } from "lucide-react";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata = { title: "Tableau de bord — Projexa" };

export default function TableauDeBordPage() {
  return (
    <PagePlaceholder
      title="Tableau de bord"
      description="Vue d'ensemble de vos projets, finances et avancement."
      icon={LayoutDashboard}
    />
  );
}
