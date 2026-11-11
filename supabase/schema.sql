-- SCENARA database. Paste this whole file into Supabase → SQL Editor → New query → Run.
-- Safe to run more than once.

-- ───────── Profiles ─────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  role text not null default '',
  city text not null default '',
  bio text not null default '',
  avatar_url text,
  cover_url text,
  kit text[] not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "profiles readable" on public.profiles;
create policy "profiles readable" on public.profiles for select using (true);
drop policy if exists "own profile insert" on public.profiles;
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- create a profile row automatically on sign-up
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, role, city)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'name', ''),
          coalesce(new.raw_user_meta_data->>'role', ''),
          coalesce(new.raw_user_meta_data->>'city', ''))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────── Showcase works ─────────
create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  kind text not null default '',
  year int,
  credit text not null default '',
  image_url text,
  video_url text,
  created_at timestamptz not null default now()
);
alter table public.works enable row level security;
drop policy if exists "works readable" on public.works;
create policy "works readable" on public.works for select using (true);
drop policy if exists "own works write" on public.works;
create policy "own works write" on public.works for all using (auth.uid() = owner) with check (auth.uid() = owner);

-- ───────── Connections ─────────
create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  requester uuid not null references public.profiles(id) on delete cascade,
  addressee uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted')),
  created_at timestamptz not null default now(),
  unique (requester, addressee),
  check (requester <> addressee)
);
alter table public.connections enable row level security;
drop policy if exists "see own connections" on public.connections;
create policy "see own connections" on public.connections for select using (auth.uid() in (requester, addressee));
drop policy if exists "request connection" on public.connections;
create policy "request connection" on public.connections for insert with check (auth.uid() = requester and status = 'pending');
drop policy if exists "accept connection" on public.connections;
create policy "accept connection" on public.connections for update using (auth.uid() = addressee);
drop policy if exists "remove connection" on public.connections;
create policy "remove connection" on public.connections for delete using (auth.uid() in (requester, addressee));

-- ───────── Messages ─────────
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender uuid not null references public.profiles(id) on delete cascade,
  recipient uuid not null references public.profiles(id) on delete cascade,
  body text not null check (length(body) between 1 and 4000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;
drop policy if exists "see own messages" on public.messages;
create policy "see own messages" on public.messages for select using (auth.uid() in (sender, recipient));
drop policy if exists "send messages" on public.messages;
create policy "send messages" on public.messages for insert with check (auth.uid() = sender);
drop policy if exists "mark read" on public.messages;
create policy "mark read" on public.messages for update using (auth.uid() = recipient);

-- ───────── Collaborate: projects and roles ─────────
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  kind text not null default '',
  description text not null default '',
  phase int not null default 0 check (phase between 0 and 3),
  dates text not null default '',
  cover_url text,
  created_at timestamptz not null default now()
);
alter table public.projects enable row level security;
drop policy if exists "projects readable" on public.projects;
create policy "projects readable" on public.projects for select using (true);
drop policy if exists "own projects write" on public.projects;
create policy "own projects write" on public.projects for all using (auth.uid() = owner) with check (auth.uid() = owner);

create table if not exists public.project_roles (
  id uuid primary key default gen_random_uuid(),
  project uuid not null references public.projects(id) on delete cascade,
  role text not null,
  member uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.project_roles enable row level security;
drop policy if exists "roles readable" on public.project_roles;
create policy "roles readable" on public.project_roles for select using (true);
drop policy if exists "owner manages roles" on public.project_roles;
create policy "owner manages roles" on public.project_roles for all
  using (exists (select 1 from public.projects p where p.id = project and p.owner = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project and p.owner = auth.uid()));

create table if not exists public.role_requests (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.project_roles(id) on delete cascade,
  applicant uuid not null references public.profiles(id) on delete cascade,
  note text not null default '',
  created_at timestamptz not null default now(),
  unique (role_id, applicant)
);
alter table public.role_requests enable row level security;
drop policy if exists "see role requests" on public.role_requests;
create policy "see role requests" on public.role_requests for select using (
  auth.uid() = applicant or exists (
    select 1 from public.project_roles r join public.projects p on p.id = r.project
    where r.id = role_id and p.owner = auth.uid()));
drop policy if exists "request role" on public.role_requests;
create policy "request role" on public.role_requests for insert with check (auth.uid() = applicant);
drop policy if exists "withdraw role request" on public.role_requests;
create policy "withdraw role request" on public.role_requests for delete using (
  auth.uid() = applicant or exists (
    select 1 from public.project_roles r join public.projects p on p.id = r.project
    where r.id = role_id and p.owner = auth.uid()));

-- ───────── Opportunities ─────────
create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  org text not null default '',
  location text not null default '',
  kind text not null default 'Job',
  rate text not null default '',
  dates text not null default '',
  description text not null default '',
  created_at timestamptz not null default now()
);
alter table public.opportunities enable row level security;
drop policy if exists "opps readable" on public.opportunities;
create policy "opps readable" on public.opportunities for select using (true);
drop policy if exists "own opps write" on public.opportunities;
create policy "own opps write" on public.opportunities for all using (auth.uid() = owner) with check (auth.uid() = owner);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  opportunity uuid not null references public.opportunities(id) on delete cascade,
  applicant uuid not null references public.profiles(id) on delete cascade,
  note text not null default '',
  created_at timestamptz not null default now(),
  unique (opportunity, applicant)
);
alter table public.applications enable row level security;
drop policy if exists "see applications" on public.applications;
create policy "see applications" on public.applications for select using (
  auth.uid() = applicant or exists (select 1 from public.opportunities o where o.id = opportunity and o.owner = auth.uid()));
drop policy if exists "apply" on public.applications;
create policy "apply" on public.applications for insert with check (auth.uid() = applicant);
drop policy if exists "withdraw application" on public.applications;
create policy "withdraw application" on public.applications for delete using (auth.uid() = applicant);

-- ───────── Photo storage ─────────
insert into storage.buckets (id, name, public) values ('media', 'media', true)
  on conflict (id) do nothing;
drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media own upload" on storage.objects;
create policy "media own upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "media own update" on storage.objects;
create policy "media own update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "media own delete" on storage.objects;
create policy "media own delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);

-- realtime for messages
do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null; when undefined_object then null; end $$;

-- table access for the app (rules above still decide which rows)
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
