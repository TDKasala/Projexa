import { Camera } from "lucide-react";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata = { title: "Suivi de l'avancement — Projexa" };

export default function AvancementPage() {
  return (
    <PagePlaceholder
      title="Suivi de l'avancement"
      description="Documentez l'avancement des chantiers avec photos."
      icon={Camera}
    />
  );
}
