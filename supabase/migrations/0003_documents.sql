-- Gestion documentaire : table de métadonnées et bucket Storage

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  name text not null,
  file_path text not null,
  file_size integer,
  mime_type text,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "documents_all" on public.documents
  for all
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create index documents_company_id_idx on public.documents (company_id);
create index documents_project_id_idx on public.documents (project_id);

-- Bucket documents (Storage)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "documents_storage_select"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = public.current_company_id()::text
  );

create policy "documents_storage_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = public.current_company_id()::text
  );

create policy "documents_storage_delete"
  on storage.objects for delete
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = public.current_company_id()::text
  );
