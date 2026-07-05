import { requireProfileWithCompany } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { SettingsForm } from "@/components/parametres/settings-form";

export const metadata = { title: "Paramètres — Projexa" };

export default async function ParametresPage() {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  const { data: company } = await supabase
    .from("companies")
    .select("id, name, rccm, id_national, n_impot, tva, address, phone, email")
    .eq("id", profile.company_id)
    .single();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paramètres"
        description="Gérez votre profil et les informations de votre entreprise."
      />
      <SettingsForm profile={profile} company={company} />
    </div>
  );
}
