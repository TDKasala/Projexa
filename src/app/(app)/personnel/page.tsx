import { Users } from "lucide-react";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata = { title: "Gestion du personnel — Projexa" };

export default function PersonnelPage() {
  return (
    <PagePlaceholder
      title="Gestion du personnel"
      description="Gérez vos équipes, présences et affectations."
      icon={Users}
    />
  );
}
