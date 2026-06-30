-- Modules cœur : projets, personnel, matériaux, achats (fournisseurs et
-- commandes d'achat). Toutes les tables sont cloisonnées par company_id.

create type public.project_status as enum (
  'planifie', 'en_cours', 'en_pause', 'termine', 'annule'
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  name text not null,
  client_name text,
  address text,
  status public.project_status not null default 'planifie',
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  budget numeric(14, 2),
  start_date date,
  end_date date,
  description text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.personnel_status as enum ('actif', 'inactif');

create table public.personnel (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  full_name text not null,
  role text,
  phone text,
  email text,
  daily_rate numeric(12, 2),
  project_id uuid references public.projects (id) on delete set null,
  status public.personnel_status not null default 'actif',
  hire_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.materials (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  name text not null,
  unit text not null,
  quantity numeric(12, 2) not null default 0,
  unit_price numeric(12, 2),
  min_stock numeric(12, 2),
  project_id uuid references public.projects (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  name text not null,
  contact_name text,
  phone text,
  email text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.purchase_order_status as enum (
  'brouillon', 'envoyee', 'recue', 'annulee'
);

create table public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  supplier_id uuid references public.suppliers (id) on delete set null,
  project_id uuid references public.projects (id) on delete set null,
  reference text,
  status public.purchase_order_status not null default 'brouillon',
  order_date date not null default current_date,
  total_amount numeric(14, 2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create trigger personnel_set_updated_at
  before update on public.personnel
  for each row execute function public.set_updated_at();

create trigger materials_set_updated_at
  before update on public.materials
  for each row execute function public.set_updated_at();

create trigger suppliers_set_updated_at
  before update on public.suppliers
  for each row execute function public.set_updated_at();

create trigger purchase_orders_set_updated_at
  before update on public.purchase_orders
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.personnel enable row level security;
alter table public.materials enable row level security;
alter table public.suppliers enable row level security;
alter table public.purchase_orders enable row level security;

create policy "projects_all" on public.projects
  for all
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "personnel_all" on public.personnel
  for all
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "materials_all" on public.materials
  for all
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "suppliers_all" on public.suppliers
  for all
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "purchase_orders_all" on public.purchase_orders
  for all
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create index projects_company_id_idx on public.projects (company_id);
create index personnel_company_id_idx on public.personnel (company_id);
create index personnel_project_id_idx on public.personnel (project_id);
create index materials_company_id_idx on public.materials (company_id);
create index materials_project_id_idx on public.materials (project_id);
create index suppliers_company_id_idx on public.suppliers (company_id);
create index purchase_orders_company_id_idx on public.purchase_orders (company_id);
create index purchase_orders_supplier_id_idx on public.purchase_orders (supplier_id);
