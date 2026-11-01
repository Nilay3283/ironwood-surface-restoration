-- Ironwood Surface Restoration — lead storage
create table if not exists public.estimate_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  email text not null,
  service text not null,
  surface_type text not null,
  property_type text not null check (property_type in ('Residential','Commercial')),
  location text not null,
  description text not null,
  photo_paths text[] default '{}',
  status text not null default 'new'
);

alter table public.estimate_requests enable row level security;

-- Visitors may submit, never read.
create policy "anon can insert leads" on public.estimate_requests
  for insert to anon with check (true);

-- Storage: create a PRIVATE bucket named `project-photos`, then:
create policy "anon can upload project photos" on storage.objects
  for insert to anon with check (bucket_id = 'project-photos');
