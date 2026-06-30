import { Wallet } from "lucide-react";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata = { title: "Suivi financier — Projexa" };

export default function FinancesPage() {
  return (
    <PagePlaceholder
      title="Suivi financier"
      description="Suivez budgets, dépenses et recettes par projet."
      icon={Wallet}
    />
  );
}
