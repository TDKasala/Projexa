import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/dal";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export const metadata = { title: "Créer votre entreprise — Projexa" };

export default async function OnboardingPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/connexion");
  if (profile.company_id) redirect("/tableau-de-bord");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl rounded-2xl bg-card p-8 shadow-xl">
        <h1 className="text-center text-2xl font-bold text-navy-950">
          Configurez votre entreprise
        </h1>
        <p className="mt-1 text-center text-sm text-muted">
          Ces informations apparaîtront sur vos devis et factures.
        </p>

        <div className="mt-8">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
