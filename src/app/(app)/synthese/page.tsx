import { BarChart3 } from "lucide-react";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata = { title: "Synthèse générale — Projexa" };

export default function SynthesePage() {
  return (
    <PagePlaceholder
      title="Synthèse générale"
      description="Indicateurs clés de coût, financement et rentabilité."
      icon={BarChart3}
    />
  );
}
