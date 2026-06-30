"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({
  userEmail,
  children,
}: {
  userEmail: string | null;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-40">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
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
        <Topbar userEmail={userEmail} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
