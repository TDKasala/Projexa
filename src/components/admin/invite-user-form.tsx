"use client";

import { useActionState } from "react";
import { inviteUserToCompany } from "@/lib/actions/admin";
import type { UserRole } from "@/lib/types";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Administrateur" },
  { value: "manager", label: "Manager" },
  { value: "member", label: "Membre" },
];

async function formAction(
  _prev: { error: string | null; success?: boolean },
  formData: FormData
) {
  const email = String(formData.get("email") ?? "").trim();
  const companyId = String(formData.get("company_id") ?? "").trim();
  const role = String(formData.get("role") ?? "member") as UserRole;
  if (!email) return { error: "L'adresse e-mail est obligatoire." };
  return inviteUserToCompany(email, companyId, role);
}

export function InviteUserForm({ companyId }: { companyId: string }) {
  const [state, dispatch, pending] = useActionState(formAction, { error: null });

  return (
    <form action={dispatch} className="flex flex-col gap-3">
      <input type="hidden" name="company_id" value={companyId} />

      {state.success && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-success">
          Invitation envoyée avec succès.
        </p>
      )}
      {state.error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-danger">{state.error}</p>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted">Adresse e-mail</label>
        <input
          type="email"
          name="email"
          required
          placeholder="utilisateur@exemple.com"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-navy-950 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted">Rôle</label>
        <select
          name="role"
          defaultValue="member"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
      >
        {pending ? "Envoi…" : "Envoyer l'invitation"}
      </button>
    </form>
  );
}
