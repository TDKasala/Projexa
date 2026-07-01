-- Tableau de bord super-administrateur : journal d'audit, paramètres système,
-- drapeau is_superadmin sur les profils et is_active sur les entreprises.

-- Colonne is_superadmin sur les profils (défaut false, protégée par trigger)
alter table public.profiles
  add column if not exists is_superadmin boolean not null default false;

-- Colonne is_active sur les entreprises (défaut true)
alter table public.companies
  add column if not exists is_active boolean not null default true;

-- Journal d'audit des actions admin
create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Paramètres système clé-valeur
create table public.system_settings (
  key text primary key,
  value text,
  description text,
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);

create trigger system_settings_set_updated_at
  before update on public.system_settings
  for each row execute function public.set_updated_at();

-- Valeurs initiales
insert into public.system_settings (key, value, description) values
  ('registration_open', 'true', 'Autoriser les nouvelles inscriptions'),
  ('max_projects_per_company', '100', 'Nombre maximum de projets par entreprise'),
  ('max_users_per_company', '50', 'Nombre maximum d''utilisateurs par entreprise'),
  ('maintenance_mode', 'false', 'Mode maintenance actif'),
  ('support_email', 'support@projexa.app', 'Adresse e-mail du support')
on conflict (key) do nothing;

-- Fonction helper : l'utilisateur courant est-il superadmin ?
create function public.is_superadmin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select is_superadmin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- Mise à jour du trigger de protection des champs sensibles pour inclure is_superadmin
create or replace function public.protect_profile_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.id then
    -- Interdit à un utilisateur de s'octroyer le drapeau superadmin
    if new.is_superadmin is distinct from old.is_superadmin then
      raise exception 'Modification du statut superadmin non autorisée.';
    end if;

    if old.company_id is null then
      if new.role is distinct from 'owner' then
        raise exception 'Rôle invalide lors de la création de l''entreprise.';
      end if;
    else
      if new.company_id is distinct from old.company_id
        or new.role is distinct from old.role then
        raise exception 'Modification du rôle ou de l''entreprise non autorisée.';
      end if;
    end if;
  end if;
  return new;
end;
$$;

-- RLS pour les nouvelles tables
alter table public.admin_audit_logs enable row level security;
alter table public.system_settings enable row level security;

create policy "audit_logs_superadmin" on public.admin_audit_logs
  for all using (public.is_superadmin());

create policy "system_settings_superadmin" on public.system_settings
  for all using (public.is_superadmin());

-- Politiques supplémentaires : superadmin peut voir toutes les entreprises / profils
create policy "companies_superadmin_select" on public.companies
  for select using (public.is_superadmin());

create policy "companies_superadmin_update" on public.companies
  for update using (public.is_superadmin());

create policy "profiles_superadmin_select" on public.profiles
  for select using (public.is_superadmin());

create policy "profiles_superadmin_update" on public.profiles
  for update using (public.is_superadmin());

-- Index pour les requêtes admin fréquentes
create index admin_audit_logs_actor_idx on public.admin_audit_logs (actor_id);
create index admin_audit_logs_created_at_idx on public.admin_audit_logs (created_at desc);
create index companies_is_active_idx on public.companies (is_active);
create index profiles_is_superadmin_idx on public.profiles (is_superadmin) where is_superadmin = true;
