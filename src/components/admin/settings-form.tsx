"use client";

import { useActionState } from "react";
import { updateSystemSetting } from "@/lib/actions/admin";
import type { SystemSetting } from "@/lib/types";

async function formAction(
  _prev: { error: string | null; success?: boolean },
  formData: FormData
) {
  const key = String(formData.get("key") ?? "");
  const value = String(formData.get("value") ?? "").trim();
  if (!key) return { error: "Clé manquante." };
  return updateSystemSetting(key, value);
}

export function SettingsForm({ settings }: { settings: SystemSetting[] }) {
  const [state, dispatch, pending] = useActionState(formAction, { error: null });

  return (
    <div className="flex flex-col gap-6">
      {state.success && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-success">
          Paramètre enregistré.
        </p>
      )}
      {state.error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-danger">{state.error}</p>
      )}

      {settings.map((s) => (
        <form key={s.key} action={dispatch} className="flex flex-col gap-2">
          <input type="hidden" name="key" value={s.key} />
          <label className="text-sm font-semibold text-navy-950">{s.key}</label>
          {s.description && (
            <p className="text-xs text-muted">{s.description}</p>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              name="value"
              defaultValue={s.value ?? ""}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-60 transition-colors"
            >
              {pending ? "…" : "Enregistrer"}
            </button>
          </div>
          <p className="text-xs text-muted">
            Mis à jour le {new Date(s.updated_at).toLocaleDateString("fr-FR")}
          </p>
        </form>
      ))}
    </div>
  );
}
