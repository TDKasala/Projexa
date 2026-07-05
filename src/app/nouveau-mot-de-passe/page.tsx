"use client";

import { useActionState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { updatePassword, type AuthFormState } from "@/lib/actions/auth-forms";

const initialState: AuthFormState = { error: null };

export default function NouveauMotDePassePage() {
  const [state, formAction, isPending] = useActionState(updatePassword, initialState);

  return (
    <AuthCard
      title="Nouveau mot de passe"
      subtitle="Choisissez un mot de passe sécurisé pour votre compte."
      footer={<span />}
    >
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-navy-950">
            Nouveau mot de passe
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
        </div>

        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-navy-950">
            Confirmer le mot de passe
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
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
          {isPending ? "Mise à jour…" : "Mettre à jour le mot de passe"}
        </button>
      </form>
    </AuthCard>
  );
}
