# Projexa

**Planifier. Exécuter. Contrôler.**

Projexa est une plateforme complète de gestion de projets de construction en français,
installable comme PWA, construite avec Next.js 16 et Supabase.

## Fonctionnalités

| Module | Description |
|---|---|
| Tableau de bord | Vue d'ensemble — projets actifs, alertes de stock, commandes récentes |
| Gestion des projets | CRUD complet avec statuts, avancement, budget, dates |
| Gestion du personnel | Équipes, affectations aux chantiers, taux journaliers |
| Gestion des matériaux | Stock, seuils d'alerte, valeur totale |
| Achats & approvisionnements | Commandes d'achat + carnet de fournisseurs |
| Planning (Gantt) | Chronologie CSS des projets, colorée par statut |
| Suivi financier | Budget vs dépenses engagées par projet |
| Suivi de l'avancement | Cartes visuelles de progression par chantier |
| Gestion documentaire | Téléversement de fichiers vers Supabase Storage |
| Facturation | Factures et devis avec RCCM / ID National / N° Impôt / TVA, impression A4 |
| Synthèse générale | KPIs consolidés de toute l'activité |

## Stack technique

- **Next.js 16** (App Router, Turbopack, React 19, Server Actions)
- **Supabase** (Postgres + Auth + Storage + RLS multitenante par `company_id`)
- **Tailwind CSS v4**
- **PWA** : `app/manifest.ts` + `public/sw.js` (cache app shell + fallback hors ligne)
- **Déploiement** : [Vercel](https://vercel.com)

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

3. Renseignez vos clés Supabase (Project Settings → API) :

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

4. Appliquez les migrations dans le SQL Editor de Supabase ou via la CLI :

   ```bash
   # Avec la CLI Supabase (lier d'abord votre projet)
   supabase db push
   ```

   Les migrations sont dans `supabase/migrations/` :
   - `0001_companies_profiles.sql` — entreprises, profils, RLS, stockage logos
   - `0002_core_modules.sql` — projets, personnel, matériaux, fournisseurs, commandes
   - `0003_documents.sql` — table documents + bucket Storage privé
   - `0004_facturation.sql` — factures, lignes de facture

### 3. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Déploiement sur Vercel

1. Importez le dépôt dans [Vercel](https://vercel.com/new).
2. Ajoutez les variables d'environnement dans les paramètres du projet :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Déployez — Vercel détecte automatiquement Next.js et utilise `vercel.json`.

En HTTPS, l'app est installable via le bouton d'installation du navigateur (Chrome, Safari, Edge).

## Structure du projet

```
src/
  app/
    (app)/              routes authentifiées — 11 modules
    connexion/           page de connexion
    inscription/         page d'inscription
    onboarding/          création d'entreprise (premier accès)
    manifest.ts          manifeste PWA
    layout.tsx           layout racine (Inter, SW, metadata)
  components/
    layout/              sidebar, topbar, app shell, navigation
    ui/                  Button, Badge, Table, FormField, StatCard, ...
    projets/ personnel/  formulaires CRUD par module
    materiaux/ achats/
    facturation/         formulaire et impression A4 des factures
    planning/            GanttChart CSS
    documents/           formulaire de téléversement
  lib/
    supabase/            clients (browser, server), types
    actions/             Server Actions par module
    dal.ts               couche d'accès aux données (requireProfileWithCompany)
    labels.ts            étiquettes françaises pour les statuts
    types.ts             types dérivés de la base de données
  proxy.ts               rafraîchissement de session Next.js
public/
  sw.js                  service worker
  offline.html           page hors ligne PWA
  icon.svg / logo.svg    icônes
supabase/migrations/     4 migrations SQL
```

## Scripts

```bash
npm run dev      # serveur de développement (Turbopack)
npm run build    # build de production
npm run start    # serveur de production
npm run lint     # ESLint
```
