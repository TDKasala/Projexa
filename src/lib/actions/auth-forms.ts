"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = { error: string | null; success?: string };

export async function signIn(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Adresse e-mail ou mot de passe incorrect." };
  }

  redirect("/tableau-de-bord");
}

export async function signUp(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "");

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return { error: "Impossible de créer le compte. Réessayez." };
  }

  redirect("/tableau-de-bord");
}

export async function resetPasswordForEmail(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "L'adresse e-mail est requise." };

  const supabase = await createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/auth/confirm?next=/nouveau-mot-de-passe`,
  });

  if (error) {
    return { error: "Impossible d'envoyer l'e-mail de réinitialisation." };
  }

  return { error: null, success: "Un lien de réinitialisation a été envoyé à votre adresse e-mail." };
}

export async function updatePassword(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }
  if (password !== confirm) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Impossible de mettre à jour le mot de passe." };
  }

  redirect("/tableau-de-bord");
}
