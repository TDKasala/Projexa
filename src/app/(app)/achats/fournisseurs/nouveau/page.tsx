import { PageHeader } from "@/components/ui/page-header";
import { SupplierForm } from "@/components/achats/supplier-form";
import { createSupplier } from "@/lib/actions/suppliers";

export const metadata = { title: "Nouveau fournisseur — Projexa" };

export default function NouveauFournisseurPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Nouveau fournisseur" description="Ajoutez un fournisseur à votre carnet." />
      <div className="rounded-xl border border-border bg-card p-6">
        <SupplierForm action={createSupplier} />
      </div>
    </div>
  );
}
