"use client";

import { useTransition, useState } from "react";
import { updateUserRole } from "@/lib/actions/admin";
import type { UserRole } from "@/lib/types";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "owner", label: "Propriétaire" },
  { value: "admin", label: "Administrateur" },
  { value: "manager", label: "Manager" },
  { value: "member", label: "Membre" },
];

export function UpdateRoleForm({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: UserRole;
}) {
  const [pending, startTransition] = useTransition();
  const [role, setRole] = useState<UserRole>(currentRole);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value as UserRole;
    setRole(newRole);
    setError(null);
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (result.error) {
        setError(result.error);
        setRole(currentRole);
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        value={role}
        onChange={handleChange}
        disabled={pending}
        className="rounded border border-border bg-background px-2 py-1 text-xs font-medium text-navy-950 disabled:opacity-50"
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
