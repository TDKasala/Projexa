"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  ClipboardList,
  Settings,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/admin/entreprises", label: "Entreprises", icon: Building2 },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/audit", label: "Journal d'audit", icon: ClipboardList },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside className="flex h-full w-64 flex-col bg-navy-950 text-white">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500">
          <Shield size={16} className="text-white" />
        </div>
        <span className="text-sm font-bold tracking-wide uppercase text-orange-400">
          Supadmin
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(href, exact)
                ? "bg-orange-500 text-white"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <Link
          href="/tableau-de-bord"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ArrowLeft size={17} />
          Retour à l'app
        </Link>
      </div>
    </aside>
  );
}
