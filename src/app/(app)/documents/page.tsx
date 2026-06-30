import { FileStack } from "lucide-react";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata = { title: "Gestion documentaire — Projexa" };

export default function DocumentsPage() {
  return (
    <PagePlaceholder
      title="Gestion documentaire"
      description="Centralisez plans, contrats, rapports et devis."
      icon={FileStack}
    />
  );
}
