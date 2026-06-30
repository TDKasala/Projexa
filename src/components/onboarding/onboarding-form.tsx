"use client";

import { useActionState } from "react";
import { createCompany, type CompanyFormState } from "@/lib/actions/company";

const initialState: CompanyFormState = { error: null };

const FIELD_CLASS =
  "mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-blue-600";
const LABEL_CLASS = "block text-sm font-medium text-navy-950";

export function OnboardingForm() {
  const [state, formAction, isPending] = useActionState(createCompany, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="name" className={LABEL_CLASS}>
          Nom de l&apos;entreprise *
        </label>
        <input id="name" name="name" type="text" required className={FIELD_CLASS} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="rccm" className={LABEL_CLASS}>
            RCCM
          </label>
          <input id="rccm" name="rccm" type="text" className={FIELD_CLASS} />
        </div>
        <div>
          <label htmlFor="idNational" className={LABEL_CLASS}>
            ID National
          </label>
          <input id="idNational" name="idNational" type="text" className={FIELD_CLASS} />
        </div>
        <div>
          <label htmlFor="nImpot" className={LABEL_CLASS}>
            N° Impôt
          </label>
          <input id="nImpot" name="nImpot" type="text" className={FIELD_CLASS} />
        </div>
        <div>
          <label htmlFor="tva" className={LABEL_CLASS}>
            TVA
          </label>
          <input id="tva" name="tva" type="text" className={FIELD_CLASS} />
        </div>
      </div>

      <div>
        <label htmlFor="address" className={LABEL_CLASS}>
          Adresse
        </label>
        <input id="address" name="address" type="text" className={FIELD_CLASS} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={LABEL_CLASS}>
            Téléphone
          </label>
          <input id="phone" name="phone" type="tel" className={FIELD_CLASS} />
        </div>
        <div>
          <label htmlFor="email" className={LABEL_CLASS}>
            E-mail professionnel
          </label>
          <input id="email" name="email" type="email" className={FIELD_CLASS} />
        </div>
      </div>

      <div>
        <label htmlFor="logo" className={LABEL_CLASS}>
          Logo de l&apos;entreprise
        </label>
        <input
          id="logo"
          name="logo"
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="mt-1 w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
      >
        {isPending ? "Création en cours..." : "Créer mon entreprise"}
      </button>
    </form>
  );
}
