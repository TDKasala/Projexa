import { ShoppingCart } from "lucide-react";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata = { title: "Achats & approvisionnements — Projexa" };

export default function AchatsPage() {
  return (
    <PagePlaceholder
      title="Achats & approvisionnements"
      description="Gérez vos fournisseurs et commandes d'achat."
      icon={ShoppingCart}
    />
  );
}
