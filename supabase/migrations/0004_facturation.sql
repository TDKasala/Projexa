-- Facturation & documents commerciaux : factures et devis

create type public.invoice_type as enum ('facture', 'devis');
create type public.invoice_status as enum ('brouillon', 'envoyee', 'payee', 'annulee');

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  invoice_number text,
  type public.invoice_type not null default 'facture',
  status public.invoice_status not null default 'brouillon',
  client_name text,
  client_address text,
  client_phone text,
  client_email text,
  client_rccm text,
  issue_date date not null default current_date,
  due_date date,
  subtotal numeric(14, 2) not null default 0,
  tax_rate numeric(5, 2) not null default 16,
  tax_amount numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0,
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  description text not null,
  quantity numeric(12, 2) not null default 1,
  unit text,
  unit_price numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0
);

create trigger invoices_set_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;

create policy "invoices_all" on public.invoices
  for all
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "invoice_items_all" on public.invoice_items
  for all
  using (
    invoice_id in (
      select id from public.invoices
      where company_id = public.current_company_id()
    )
  )
  with check (
    invoice_id in (
      select id from public.invoices
      where company_id = public.current_company_id()
    )
  );

create index invoices_company_id_idx on public.invoices (company_id);
create index invoices_project_id_idx on public.invoices (project_id);
create index invoice_items_invoice_id_idx on public.invoice_items (invoice_id);
