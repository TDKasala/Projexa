import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Boxes,
  ShoppingCart,
  CalendarRange,
  Wallet,
  TrendingUp,
  FileStack,
  Receipt,
  BarChart3,
  CheckCircle2,
  Shield,
  Globe,
  WifiOff,
  ChevronRight,
  Building2,
  Zap,
} from "lucide-react";

const MODULES = [
  {
    icon: LayoutDashboard,
    name: "Tableau de bord",
    desc: "Vue d'ensemble — projets actifs, alertes de stock, commandes récentes.",
  },
  {
    icon: FolderKanban,
    name: "Gestion des projets",
    desc: "CRUD complet avec statuts, avancement, budget et dates de chantier.",
  },
  {
    icon: Users,
    name: "Gestion du personnel",
    desc: "Équipes, affectations aux chantiers, taux journaliers.",
  },
  {
    icon: Boxes,
    name: "Gestion des matériaux",
    desc: "Stocks, seuils d'alerte, valeur totale et traçabilité par projet.",
  },
  {
    icon: ShoppingCart,
    name: "Achats & approvisionnements",
    desc: "Commandes d'achat complètes + carnet de fournisseurs.",
  },
  {
    icon: CalendarRange,
    name: "Planning Gantt",
    desc: "Chronologie visuelle de vos projets, colorée par statut.",
  },
  {
    icon: Wallet,
    name: "Suivi financier",
    desc: "Budget vs dépenses engagées par projet, consolidés automatiquement.",
  },
  {
    icon: TrendingUp,
    name: "Suivi de l'avancement",
    desc: "Cartes visuelles de progression pour chaque chantier.",
  },
  {
    icon: FileStack,
    name: "Gestion documentaire",
    desc: "Téléversement de fichiers vers le stockage sécurisé Supabase.",
  },
  {
    icon: Receipt,
    name: "Facturation & devis",
    desc: "Factures A4 avec RCCM, ID National, N° Impôt et TVA, impression directe.",
  },
  {
    icon: BarChart3,
    name: "Synthèse générale",
    desc: "KPIs consolidés de toute l'activité — une page, tous les chiffres.",
  },
];

const WHY = [
  {
    icon: Globe,
    title: "100 % en français",
    desc: "Interface, libellés, formats de date et de devise pensés pour les entrepreneurs francophones d'Afrique centrale.",
  },
  {
    icon: CheckCircle2,
    title: "Conformité légale",
    desc: "Factures et devis conformes aux obligations locales : RCCM, Identifiant national, N° Impôt et TVA sur chaque document.",
  },
  {
    icon: WifiOff,
    title: "Fonctionne hors ligne",
    desc: "Application Progressive Web App : installez-la sur votre téléphone et continuez à travailler même sans connexion internet.",
  },
  {
    icon: Shield,
    title: "Données sécurisées",
    desc: "Isolation totale par entreprise (RLS multitenante Supabase) — vos données ne sont jamais mélangées avec celles d'une autre société.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Créez votre compte",
    desc: "Inscription en 30 secondes, puis configurez le profil de votre entreprise (RCCM, logo, coordonnées, TVA).",
  },
  {
    number: "02",
    title: "Ajoutez vos ressources",
    desc: "Renseignez vos projets, votre équipe, vos matériaux et vos fournisseurs. Tout est interconnecté.",
  },
  {
    number: "03",
    title: "Pilotez et facturez",
    desc: "Suivez l'avancement en temps réel, maîtrisez vos budgets et éditez vos factures en quelques clics.",
  },
];

const PLATFORM_STATS = [
  { value: "11", label: "modules intégrés" },
  { value: "4", label: "rôles utilisateurs" },
  { value: "100 %", label: "en français" },
  { value: "PWA", label: "installable offline" },
];

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-1 flex-col bg-navy-950 text-white">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-navy-950/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/icon.svg"
              alt="Projexa"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <div className="leading-tight">
              <p className="text-base font-bold tracking-wide">PROJEXA</p>
              <p className="hidden text-[10px] text-blue-400 sm:block">
                Planifier. Exécuter. Contrôler.
              </p>
            </div>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/connexion"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Commencer
            </Link>
          </nav>
        </div>
      </header>

      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-orange-500/5" />
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-orange-400">
            <Zap size={12} />
            GESTION DE PROJETS DE CONSTRUCTION
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Planifier.{" "}
            <span className="text-blue-400">Exécuter.</span>{" "}
            <span className="text-orange-400">Contrôler.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Projexa réunit la planification des chantiers, la gestion du
            personnel, le suivi des matériaux et la facturation dans une seule
            plateforme, pensée pour les entrepreneurs francophones.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 transition-colors"
            >
              Démarrer gratuitement
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/connexion"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-7 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-400 hover:text-white transition-colors"
            >
              Se connecter
            </Link>
          </div>

          {/* Platform stats strip */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {PLATFORM_STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-center"
              >
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pourquoi Projexa ────────────────────────────────────────────── */}
      <section className="bg-slate-950/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Pourquoi choisir Projexa ?
            </h2>
            <p className="mt-3 text-slate-400">
              Conçu pour les professionnels du bâtiment d'Afrique francophone
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <div className="mb-3 inline-flex rounded-lg bg-blue-600/20 p-2.5">
                  <Icon size={20} className="text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── All modules ─────────────────────────────────────────────────── */}
      <section className="bg-navy-900">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold tracking-widest text-orange-400 uppercase">
              Modules
            </span>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Tout ce dont vous avez besoin, dans un seul outil
            </h2>
            <p className="mt-3 text-slate-400">
              11 modules intégrés — zéro outil externe nécessaire
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map(({ icon: Icon, name, desc }) => (
              <div
                key={name}
                className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <div className="mt-0.5 shrink-0 rounded-lg bg-blue-600/20 p-2">
                  <Icon size={18} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ────────────────────────────────────────────────── */}
      <section className="bg-navy-950">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold tracking-widest text-blue-400 uppercase">
              Démarrage rapide
            </span>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Opérationnel en quelques minutes
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.number} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="absolute left-full top-7 hidden w-full -translate-y-1/2 border-t border-dashed border-white/20 sm:block" />
                )}
                <div className="relative rounded-xl border border-white/10 bg-white/5 p-6">
                  <span className="text-4xl font-black text-white/10">
                    {step.number}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Multi-tenant / Teams ────────────────────────────────────────── */}
      <section className="bg-slate-950/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-semibold tracking-widest text-orange-400 uppercase">
                Multi-utilisateurs
              </span>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                Travaillez en équipe avec les bons droits
              </h2>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Invitez vos collaborateurs et attribuez-leur un rôle adapté.
                Chaque membre accède uniquement aux données de votre entreprise —
                séparées hermétiquement de toutes les autres.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  { role: "Propriétaire", desc: "Accès total, configuration de l'entreprise" },
                  { role: "Administrateur", desc: "Gestion des ressources et des équipes" },
                  { role: "Manager", desc: "Suivi des chantiers et des commandes" },
                  { role: "Membre", desc: "Consultation et mises à jour de base" },
                ].map((r) => (
                  <li key={r.role} className="flex items-start gap-3">
                    <span className="mt-0.5 rounded-full bg-blue-600/20 px-2.5 py-0.5 text-xs font-semibold text-blue-400 shrink-0">
                      {r.role}
                    </span>
                    <span className="text-sm text-slate-400">{r.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Building2, label: "Entreprise isolée", sub: "RLS Supabase" },
                { icon: Users, label: "4 niveaux de rôles", sub: "Granulaire" },
                { icon: Shield, label: "Données cryptées", sub: "Postgres RLS" },
                { icon: Globe, label: "Accès partout", sub: "Web + Mobile" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="rounded-lg bg-orange-500/20 p-2 w-fit">
                    <Icon size={18} className="text-orange-400" />
                  </div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-slate-500">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PWA / Offline ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-900 to-navy-950">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-blue-200">
            <WifiOff size={12} />
            PROGRESSIVE WEB APP
          </div>
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            Sur tous vos appareils, même sans connexion
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-300 leading-relaxed">
            Installez Projexa comme une application native sur votre téléphone,
            votre tablette ou votre ordinateur. Continuez à consulter vos
            données de chantier même en zone blanche.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {["Android", "iOS / iPad", "Windows", "macOS", "Offline"].map((p) => (
              <span
                key={p}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-slate-200"
              >
                {p}
              </span>
            ))}
          </div>
          <Link
            href="/inscription"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-navy-950 hover:bg-slate-100 transition-colors"
          >
            Installer Projexa
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ─── Final CTA ───────────────────────────────────────────────────── */}
      <section className="bg-navy-950 border-t border-white/10">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            Prêt à transformer la gestion de vos chantiers ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Rejoignez les entreprises du BTP qui pilotent leurs projets,
            maîtrisent leurs budgets et facturent leurs clients avec Projexa.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Démarrer gratuitement
              <ChevronRight size={18} />
            </Link>
            <Link
              href="/connexion"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-8 py-4 text-base font-semibold text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
            >
              J'ai déjà un compte
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 bg-navy-950">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <Image
                  src="/icon.svg"
                  alt="Projexa"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-base font-bold tracking-wide">PROJEXA</span>
              </Link>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
                La plateforme de gestion de projets de construction pour les
                entrepreneurs francophones. Planifier. Exécuter. Contrôler.
              </p>
            </div>

            {/* Produit */}
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Produit
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {[
                  { label: "Tableau de bord", href: "/tableau-de-bord" },
                  { label: "Projets", href: "/projets" },
                  { label: "Facturation", href: "/facturation" },
                  { label: "Planning Gantt", href: "/planning" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compte */}
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Compte
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {[
                  { label: "Connexion", href: "/connexion" },
                  { label: "Créer un compte", href: "/inscription" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              © {year} Projexa — Tous droits réservés
            </p>
            <p className="text-xs text-slate-600">
              Propulsé par Next.js · Supabase · Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
