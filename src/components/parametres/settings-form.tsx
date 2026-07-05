"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileFormState } from "@/lib/actions/profile";
import type { Profile } from "@/lib/types";

const FIELD = "mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-blue-600";
const LABEL = "block text-sm font-medium text-navy-950";

type Company = {
  id: string;
  name: string;
  rccm: string | null;
  id_national: string | null;
  n_impot: string | null;
  tva: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
};

const initialState: ProfileFormState = { error: null };

export function SettingsForm({
  profile,
  company,
}: {
  profile: Profile;
  company: Company | null;
}) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="space-y-8">
      {state.success && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {state.success}
        </div>
      )}
      {state.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      )}

      {/* Profile section */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-base font-semibold text-navy-950">Mon profil</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="full_name" className={LABEL}>Nom complet</label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              defaultValue={profile.full_name ?? ""}
              className={FIELD}
            />
          </div>
          <div>
            <label className={LABEL}>Adresse e-mail</label>
            <input
              type="email"
              value={profile.email ?? ""}
              disabled
              className={`${FIELD} bg-slate-50 text-muted cursor-not-allowed`}
            />
            <p className="mt-1 text-xs text-muted">L&apos;e-mail ne peut pas être modifié ici.</p>
          </div>
        </div>
      </section>

      {/* Company section */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-base font-semibold text-navy-950">Mon entreprise</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="company_name" className={LABEL}>Nom de l&apos;entreprise *</label>
            <input
              id="company_name"
              name="company_name"
              type="text"
              required
              defaultValue={company?.name ?? ""}
              className={FIELD}
            />
          </div>
          <div>
            <label htmlFor="rccm" className={LABEL}>RCCM</label>
            <input
              id="rccm"
              name="rccm"
              type="text"
              defaultValue={company?.rccm ?? ""}
              className={FIELD}
            />
          </div>
          <div>
            <label htmlFor="id_national" className={LABEL}>ID National</label>
            <input
              id="id_national"
              name="id_national"
              type="text"
              defaultValue={company?.id_national ?? ""}
              className={FIELD}
            />
          </div>
          <div>
            <label htmlFor="n_impot" className={LABEL}>N° Impôt</label>
            <input
              id="n_impot"
              name="n_impot"
              type="text"
              defaultValue={company?.n_impot ?? ""}
              className={FIELD}
            />
          </div>
          <div>
            <label htmlFor="tva" className={LABEL}>TVA</label>
            <input
              id="tva"
              name="tva"
              type="text"
              defaultValue={company?.tva ?? ""}
              className={FIELD}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address" className={LABEL}>Adresse</label>
            <input
              id="address"
              name="address"
              type="text"
              defaultValue={company?.address ?? ""}
              className={FIELD}
            />
          </div>
          <div>
            <label htmlFor="phone" className={LABEL}>Téléphone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={company?.phone ?? ""}
              className={FIELD}
            />
          </div>
          <div>
            <label htmlFor="email" className={LABEL}>E-mail professionnel</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={company?.email ?? ""}
              className={FIELD}
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
        >
          {isPending ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}
