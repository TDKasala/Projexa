"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-40">
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-4 z-50 rounded-md bg-navy-900 p-1.5 text-white"
            aria-label="Fermer le menu"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card px-4 lg:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-1.5 text-muted hover:bg-border lg:hidden"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-navy-950">
            Tableau de bord administrateur
          </span>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
