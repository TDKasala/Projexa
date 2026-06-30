import { Receipt } from "lucide-react";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata = { title: "Facturation & documents commerciaux — Projexa" };

export default function FacturationPage() {
  return (
    <PagePlaceholder
      title="Facturation & documents commerciaux"
      description="Créez devis et factures conformes à votre activité."
      icon={Receipt}
    />
  );
}
