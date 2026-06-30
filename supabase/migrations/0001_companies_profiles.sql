-- Fondations multi-tenant : entreprises, profils utilisateurs, RLS.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('owner', 'admin', 'manager', 'member');

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rccm text,
  id_national text,
  n_impot text,
  tva text,
  address text,
  phone text,
  email text,
  logo_url text,
  owner_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  company_id uuid references public.companies (id) on delete set null,
  full_name text,
  email text,
  role public.user_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Renvoie l'entreprise de l'utilisateur courant. SECURITY DEFINER pour
-- éviter la récursion RLS quand cette fonction est utilisée dans les
-- politiques d'autres tables.
create function public.current_company_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select company_id from public.profiles where id = auth.uid();
$$;

-- Crée automatiquement un profil (sans entreprise) à l'inscription.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Empêche un utilisateur de s'attribuer un rôle ou une entreprise par
-- modification directe de son profil, hors création initiale de
-- l'entreprise (onboarding), où il devient automatiquement "owner".
create function public.protect_profile_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.id then
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

create trigger profiles_protect_privileged_fields
  before update on public.profiles
  for each row execute function public.protect_profile_privileged_fields();

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger companies_set_updated_at
  before update on public.companies
  for each row execute function public.set_updated_at();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.companies enable row level security;
alter table public.profiles enable row level security;

create policy "companies_select" on public.companies
  for select using (id = public.current_company_id());

create policy "companies_insert" on public.companies
  for insert with check (owner_id = auth.uid());

create policy "companies_update" on public.companies
  for update using (
    id = public.current_company_id()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('owner', 'admin')
    )
  )
  with check (id = public.current_company_id());

create policy "profiles_select" on public.profiles
  for select using (id = auth.uid() or company_id = public.current_company_id());

create policy "profiles_insert_self" on public.profiles
  for insert with check (id = auth.uid());

create policy "profiles_update_self" on public.profiles
  for update using (id = auth.uid())
  with check (id = auth.uid());

-- Bucket public pour les logos d'entreprise (utilisés sur les factures).
insert into storage.buckets (id, name, public)
values ('company-assets', 'company-assets', true)
on conflict (id) do nothing;

create policy "company_assets_read" on storage.objects
  for select using (bucket_id = 'company-assets');

create policy "company_assets_insert" on storage.objects
  for insert with check (
    bucket_id = 'company-assets'
    and (storage.foldername(name)) [1] = public.current_company_id()::text
  );

create policy "company_assets_update" on storage.objects
  for update using (
    bucket_id = 'company-assets'
    and (storage.foldername(name)) [1] = public.current_company_id()::text
  );

create policy "company_assets_delete" on storage.objects
  for delete using (
    bucket_id = 'company-assets'
    and (storage.foldername(name)) [1] = public.current_company_id()::text
  );
