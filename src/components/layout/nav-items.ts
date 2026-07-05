import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Boxes,
  ShoppingCart,
  CalendarRange,
  Wallet,
  Camera,
  FileStack,
  Receipt,
  BarChart3,
  Settings,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Tableau de bord", href: "/tableau-de-bord", icon: LayoutDashboard },
  { label: "Gestion des projets", href: "/projets", icon: FolderKanban },
  { label: "Gestion du personnel", href: "/personnel", icon: Users },
  { label: "Gestion des matériaux", href: "/materiaux", icon: Boxes },
  { label: "Achats & approvisionnements", href: "/achats", icon: ShoppingCart },
  { label: "Planning & gestion du temps", href: "/planning", icon: CalendarRange },
  { label: "Suivi financier", href: "/finances", icon: Wallet },
  { label: "Suivi de l'avancement", href: "/avancement", icon: Camera },
  { label: "Gestion documentaire", href: "/documents", icon: FileStack },
  { label: "Facturation & documents commerciaux", href: "/facturation", icon: Receipt },
  { label: "Synthèse générale", href: "/synthese", icon: BarChart3 },
  { label: "Paramètres", href: "/parametres", icon: Settings },
];
