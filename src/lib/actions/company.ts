"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CompanyFormState = { error: string | null };

export async function createCompany(
  _prevState: CompanyFormState,
  formData: FormData
): Promise<CompanyFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { error: "Le nom de l'entreprise est obligatoire." };
  }

  const rccm = String(formData.get("rccm") ?? "").trim() || null;
  const idNational = String(formData.get("idNational") ?? "").trim() || null;
  const nImpot = String(formData.get("nImpot") ?? "").trim() || null;
  const tva = String(formData.get("tva") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim() || null;

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({
      name,
      rccm,
      id_national: idNational,
      n_impot: nImpot,
      tva,
      address,
      phone,
      email,
      owner_id: user.id,
    })
    .select("id")
    .single();

  if (companyError || !company) {
    return { error: "Impossible de créer l'entreprise. Réessayez." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ company_id: company.id, role: "owner" })
    .eq("id", user.id);

  if (profileError) {
    return { error: "Entreprise créée, mais le profil n'a pas pu être lié. Contactez le support." };
  }

  const logo = formData.get("logo");
  if (logo instanceof File && logo.size > 0) {
    const extension = logo.name.split(".").pop() || "png";
    const path = `${company.id}/logo.${extension}`;
    const { data: uploaded } = await supabase.storage
      .from("company-assets")
      .upload(path, logo, { upsert: true, contentType: logo.type });

    if (uploaded) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("company-assets").getPublicUrl(path);
      await supabase.from("companies").update({ logo_url: publicUrl }).eq("id", company.id);
    }
  }

  redirect("/tableau-de-bord");
}
