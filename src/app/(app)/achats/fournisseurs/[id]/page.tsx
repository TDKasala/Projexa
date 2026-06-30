import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { PageHeader } from "@/components/ui/page-header";
import { SupplierForm } from "@/components/achats/supplier-form";
import { updateSupplier } from "@/lib/actions/suppliers";

export const metadata = { title: "Modifier le fournisseur — Projexa" };

export default async function ModifierFournisseurPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  const { data: supplier } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", id)
    .eq("company_id", profile.company_id)
    .single();

  if (!supplier) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title={supplier.name} description="Modifiez les informations de ce fournisseur." />
      <div className="rounded-xl border border-border bg-card p-6">
        <SupplierForm action={updateSupplier.bind(null, id)} supplier={supplier} />
      </div>
    </div>
  );
}
