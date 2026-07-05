"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type AuthFormState } from "@/lib/actions/auth-forms";
import { AuthCard } from "@/components/auth/auth-card";

const initialState: AuthFormState = { error: null };

export default function ConnexionPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <AuthCard
      title="Connexion"
      subtitle="Accédez à votre espace de gestion de projets"
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="font-medium text-blue-600">
            Créer un compte
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy-950">
            Adresse e-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-navy-950">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-blue-600"
          />
        </div>

        {state.error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
        >
          {isPending ? "Connexion en cours..." : "Se connecter"}
        </button>

        <div className="text-center">
          <Link href="/mot-de-passe-oublie" className="text-sm text-muted hover:text-navy-950">
            Mot de passe oublié ?
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
