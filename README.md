# Projexa

**Planifier. Exécuter. Contrôler.**

Projexa est une plateforme de gestion de projets de construction : projets,
personnel, matériaux, achats, planning, finances, avancement, documents et
facturation, réunis dans un seul outil — en français, installable comme
application (PWA), construite avec Next.js 16 et Supabase.

## Stack technique

- [Next.js 16](https://nextjs.org) (App Router, Turbopack, React 19)
- [Supabase](https://supabase.com) (Postgres, Auth, Storage, Row Level Security)
- Tailwind CSS v4
- PWA : `app/manifest.ts` + service worker (`public/sw.js`)
- Déploiement cible : [Vercel](https://vercel.com)

## Démarrage local

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer Supabase

1. Créez un projet sur [supabase.com](https://supabase.com).
2. Copiez `.env.local.example` vers `.env.local` :

   ```bash
   cp .env.local.example .env.local
   ```

3. Renseignez les variables avec les valeurs de votre projet Supabase
   (Project Settings → API) :

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

4. Appliquez les migrations SQL du dossier `supabase/migrations` (une fois
   disponibles) via le SQL Editor de Supabase ou la CLI Supabase.

### 3. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Déploiement sur Vercel

1. Importez le dépôt dans [Vercel](https://vercel.com/new).
2. Renseignez les mêmes variables d'environnement que `.env.local` dans les
   paramètres du projet Vercel (Environment Variables).
3. Déployez — Vercel détecte automatiquement Next.js.

Le manifeste PWA est généré automatiquement (`/manifest.webmanifest`) et le
service worker (`/sw.js`) est enregistré côté client. Une fois déployée en
HTTPS, l'application est installable depuis un navigateur compatible.

## Structure du projet

```
src/
  app/
    (app)/            routes authentifiées (tableau de bord, projets, ...)
    connexion/         page de connexion
    inscription/        page de création de compte
    manifest.ts         manifeste PWA
  components/
    layout/             sidebar, topbar, app shell, navigation
    auth/                composants des pages d'authentification
    pwa/                 enregistrement du service worker
  lib/
    supabase/            clients Supabase (navigateur, serveur, proxy)
    actions/              Server Actions (authentification, ...)
  proxy.ts                rafraîchissement de session et garde d'accès
public/
  sw.js                   service worker (cache de l'app shell)
  manifest assets         icônes et logo
```

## Scripts

```bash
npm run dev      # serveur de développement (Turbopack)
npm run build    # build de production
npm run start    # serveur de production
npm run lint     # ESLint
```
