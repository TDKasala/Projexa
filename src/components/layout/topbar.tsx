"use client";

import { Menu, LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";

export function Topbar({
  userEmail,
  onMenuClick,
}: {
  userEmail: string | null;
  onMenuClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-2 text-navy-900 hover:bg-slate-100 lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu size={22} />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        {userEmail && (
          <span className="hidden text-sm text-muted sm:inline">{userEmail}</span>
        )}
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-navy-900 transition-colors hover:bg-slate-100"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </form>
      </div>
    </header>
  );
}
