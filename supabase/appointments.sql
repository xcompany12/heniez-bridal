-- Jalankan sekali di Supabase: SQL Editor, lalu Run.

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  preferred_date date not null,
  preferred_time text not null check (preferred_time in ('morning', 'afternoon')),
  gown_slug text,
  size text,
  color text,
  notes text,
  status text not null default 'new'
    check (status in ('new', 'confirmed', 'done', 'cancelled'))
);

-- Keamanan: aktifkan RLS tanpa policy apa pun, jadi pengunjung tidak bisa
-- membaca atau menulis tabel ini langsung dari browser. Data hanya masuk
-- lewat server (Server Action) memakai secret key.
alter table public.appointments enable row level security;

grant select, insert, update, delete on table public.appointments to service_role;
