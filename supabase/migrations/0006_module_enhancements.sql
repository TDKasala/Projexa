-- Module enhancements: tasks, time entries, material movements,
-- purchase order line items, project milestones, progress reports.

-- ─── Enums ───────────────────────────────────────────────────────────────────

create type public.task_status as enum (
  'a_faire', 'en_cours', 'en_revision', 'termine', 'annule'
);

create type public.task_priority as enum ('basse', 'normale', 'haute', 'urgente');

create type public.movement_type as enum ('entree', 'sortie', 'ajustement');

-- ─── project_tasks ───────────────────────────────────────────────────────────

create table public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text,
  assignee_id uuid references public.personnel (id) on delete set null,
  status public.task_status not null default 'a_faire',
  priority public.task_priority not null default 'normale',
  due_date date,
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger project_tasks_set_updated_at
  before update on public.project_tasks
  for each row execute function public.set_updated_at();

alter table public.project_tasks enable row level security;

create policy "project_tasks_all" on public.project_tasks
  for all
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create index project_tasks_project_id_idx on public.project_tasks (project_id);
create index project_tasks_company_id_idx on public.project_tasks (company_id);
create index project_tasks_assignee_id_idx on public.project_tasks (assignee_id);
create index project_tasks_status_idx on public.project_tasks (status);

-- ─── project_milestones ───────────────────────────────────────────────────────

create table public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  due_date date not null,
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger project_milestones_set_updated_at
  before update on public.project_milestones
  for each row execute function public.set_updated_at();

alter table public.project_milestones enable row level security;

create policy "project_milestones_all" on public.project_milestones
  for all
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create index project_milestones_project_id_idx on public.project_milestones (project_id);
create index project_milestones_company_id_idx on public.project_milestones (company_id);

-- ─── time_entries ─────────────────────────────────────────────────────────────

create table public.time_entries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  personnel_id uuid not null references public.personnel (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  task_id uuid references public.project_tasks (id) on delete set null,
  entry_date date not null default current_date,
  hours numeric(5, 2) not null check (hours > 0 and hours <= 24),
  description text,
  created_at timestamptz not null default now()
);

alter table public.time_entries enable row level security;

create policy "time_entries_all" on public.time_entries
  for all
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create index time_entries_company_id_idx on public.time_entries (company_id);
create index time_entries_personnel_id_idx on public.time_entries (personnel_id);
create index time_entries_project_id_idx on public.time_entries (project_id);
create index time_entries_entry_date_idx on public.time_entries (entry_date);

-- ─── material_movements ───────────────────────────────────────────────────────

create table public.material_movements (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  material_id uuid not null references public.materials (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  movement_type public.movement_type not null,
  quantity numeric(12, 2) not null check (quantity > 0),
  unit_price numeric(12, 2),
  reference text,
  notes text,
  movement_date date not null default current_date,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.material_movements enable row level security;

create policy "material_movements_all" on public.material_movements
  for all
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create index material_movements_material_id_idx on public.material_movements (material_id);
create index material_movements_company_id_idx on public.material_movements (company_id);
create index material_movements_project_id_idx on public.material_movements (project_id);
create index material_movements_movement_date_idx on public.material_movements (movement_date);

-- Trigger to update material quantity after movement
create or replace function public.apply_material_movement()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.movement_type = 'entree' then
    update public.materials
    set quantity = quantity + new.quantity
    where id = new.material_id;
  elsif new.movement_type = 'sortie' then
    update public.materials
    set quantity = greatest(0, quantity - new.quantity)
    where id = new.material_id;
  elsif new.movement_type = 'ajustement' then
    update public.materials
    set quantity = new.quantity
    where id = new.material_id;
  end if;
  return new;
end;
$$;

create trigger material_movement_apply
  after insert on public.material_movements
  for each row execute function public.apply_material_movement();

-- ─── purchase_order_items ─────────────────────────────────────────────────────

create table public.purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references public.purchase_orders (id) on delete cascade,
  description text not null,
  quantity numeric(10, 2) not null default 1 check (quantity > 0),
  unit text,
  unit_price numeric(12, 2) not null default 0,
  total numeric(14, 2) generated always as (quantity * unit_price) stored,
  sort_order integer not null default 0
);

alter table public.purchase_order_items enable row level security;

-- RLS: reuse purchase_orders' company via a join
create policy "purchase_order_items_all" on public.purchase_order_items
  for all
  using (
    exists (
      select 1 from public.purchase_orders po
      where po.id = purchase_order_id
        and po.company_id = public.current_company_id()
    )
  )
  with check (
    exists (
      select 1 from public.purchase_orders po
      where po.id = purchase_order_id
        and po.company_id = public.current_company_id()
    )
  );

create index purchase_order_items_po_id_idx on public.purchase_order_items (purchase_order_id);

-- Trigger to recalculate purchase_order total_amount after item changes
create or replace function public.recalculate_po_total()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_po_id uuid;
begin
  v_po_id := coalesce(new.purchase_order_id, old.purchase_order_id);
  update public.purchase_orders
  set total_amount = (
    select coalesce(sum(quantity * unit_price), 0)
    from public.purchase_order_items
    where purchase_order_id = v_po_id
  )
  where id = v_po_id;
  return coalesce(new, old);
end;
$$;

create trigger po_items_recalculate_total
  after insert or update or delete on public.purchase_order_items
  for each row execute function public.recalculate_po_total();

-- ─── progress_reports ─────────────────────────────────────────────────────────

create table public.progress_reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  report_date date not null default current_date,
  reporter_id uuid references public.profiles (id) on delete set null,
  overall_percent integer not null default 0 check (overall_percent between 0 and 100),
  summary text not null,
  problems text,
  next_steps text,
  weather text,
  workers_present integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger progress_reports_set_updated_at
  before update on public.progress_reports
  for each row execute function public.set_updated_at();

alter table public.progress_reports enable row level security;

create policy "progress_reports_all" on public.progress_reports
  for all
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create index progress_reports_project_id_idx on public.progress_reports (project_id);
create index progress_reports_company_id_idx on public.progress_reports (company_id);
create index progress_reports_report_date_idx on public.progress_reports (report_date desc);
