"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { resetPasswordForEmail, type AuthFormState } from "@/lib/actions/auth-forms";

const initialState: AuthFormState = { error: null };

export default function MotDePasseOubliePage() {
  const [state, formAction, isPending] = useActionState(
    resetPasswordForEmail,
    initialState
  );

  return (
    <AuthCard
      title="Mot de passe oublié"
      subtitle="Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation."
      footer={
        <Link href="/connexion" className="font-medium text-blue-600 hover:text-blue-500">
          Retour à la connexion
        </Link>
      }
    >
      {state.success ? (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {state.success}
        </div>
      ) : (
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
            {isPending ? "Envoi en cours…" : "Envoyer le lien"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
