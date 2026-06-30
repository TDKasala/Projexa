"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthFormState } from "@/lib/actions/auth-forms";
import { AuthCard } from "@/components/auth/auth-card";

const initialState: AuthFormState = { error: null };

export default function InscriptionPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  return (
    <AuthCard
      title="Créer un compte"
      subtitle="Commencez à gérer vos projets de construction"
      footer={
        <>
          Déjà un compte ?{" "}
          <Link href="/connexion" className="font-medium text-blue-600">
            Se connecter
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-navy-950">
            Nom complet
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-blue-600"
          />
        </div>

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
            minLength={8}
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-blue-600"
          />
          <p className="mt-1 text-xs text-muted">Au moins 8 caractères.</p>
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
          {isPending ? "Création en cours..." : "Créer mon compte"}
        </button>
      </form>
    </AuthCard>
  );
}
