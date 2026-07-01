"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/components/layout/nav-items";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-60 flex-col bg-navy-950 text-white xl:w-72">
      <div className="flex items-center gap-2 px-6 py-6">
        <Image src="/icon.svg" alt="Projexa" width={36} height={36} className="rounded-lg" />
        <div>
          <p className="text-lg font-bold tracking-wide">PROJEXA</p>
          <p className="text-[11px] text-blue-400">
            Planifier. Exécuter. Contrôler.
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-navy-800 hover:text-white"
              )}
            >
              <Icon className="shrink-0" size={18} />
              <span className="leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-navy-800 px-6 py-4 text-xs text-slate-400">
        © {new Date().getFullYear()} Projexa
      </div>
    </div>
  );
}
