import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  Wallet,
  Receipt,
} from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: FolderKanban,
    title: "Pilotez tous vos chantiers",
    description:
      "Projets, personnel, matériaux et achats centralisés dans un seul espace de travail.",
  },
  {
    icon: LayoutDashboard,
    title: "Planning & avancement en temps réel",
    description:
      "Diagrammes de Gantt, suivi photo de chantier et indicateurs d'avancement à jour.",
  },
  {
    icon: Wallet,
    title: "Maîtrisez vos finances",
    description:
      "Budgets, dépenses, recettes et rentabilité par projet, consolidés automatiquement.",
  },
  {
    icon: Receipt,
    title: "Facturation conforme",
    description:
      "Devis et factures avec RCCM, ID National, N° Impôt et TVA prêts en quelques clics.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-navy-950 text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <Image src="/icon.svg" alt="Projexa" width={36} height={36} className="rounded-lg" />
          <span className="text-lg font-bold tracking-wide">PROJEXA</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link
            href="/connexion"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-200 hover:text-white"
          >
            Connexion
          </Link>
          <Link
            href="/inscription"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Créer un compte
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6 py-16 text-center">
        <p className="rounded-full bg-orange-500/15 px-4 py-1 text-xs font-semibold tracking-wide text-orange-400">
          GESTION DE PROJETS DE CONSTRUCTION
        </p>
        <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          Planifier. Exécuter. Contrôler.
        </h1>
        <p className="mt-4 max-w-xl text-base text-slate-300">
          Projexa réunit la planification, le suivi financier, la gestion du
          personnel et la facturation de vos chantiers dans une seule
          plateforme, en français.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/inscription"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Démarrer gratuitement
          </Link>
          <Link
            href="/connexion"
            className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 hover:bg-navy-800"
          >
            Se connecter
          </Link>
        </div>

        <div className="mt-20 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-navy-800 bg-navy-900 p-5 text-left"
            >
              <div className="mb-3 inline-flex rounded-lg bg-blue-600/15 p-2.5">
                <Icon size={20} className="text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-navy-800 px-6 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Projexa — Tous droits réservés
      </footer>
    </div>
  );
}
