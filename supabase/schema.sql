-- Run once in the Supabase SQL editor.
create table trucks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'available' check (status in ('available', 'pending', 'sold')),
  year int not null,
  make text not null,
  model text not null,
  body text not null check (body in ('dump', 'box', 'service', 'flatbed', 'tow', 'pickup')),
  price int,               -- null shows "Call for price"
  miles int not null,
  engine text not null default '',
  transmission text not null default '',
  gvwr text not null default '',
  description text not null default '',
  image_url text,          -- e.g. a public URL from a Supabase Storage bucket
  vin text,
  featured boolean not null default false,
  sold_at timestamptz,
  views int not null default 0
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  truck_id text,
  name text not null check (length(name) <= 100),
  phone text not null check (length(phone) <= 30),
  email text check (length(email) <= 200),
  message text check (length(message) <= 2000),
  source text not null default 'contact' check (source in ('truck', 'finance', 'contact')),
  status text not null default 'new' check (status in ('new', 'contacted', 'won', 'lost')),
  notes text not null default ''
);

alter table trucks enable row level security;
alter table leads enable row level security;

-- Public site can read listed trucks and submit leads; it can never read leads back.
create policy "public reads listed trucks" on trucks for select to anon using (status <> 'sold');
create policy "public submits leads" on leads for insert to anon with check (true);

-- Admin: staff sign in with Supabase Auth (invite-only) and get full access.
create policy "staff manage trucks" on trucks for all to authenticated using (true) with check (true);
create policy "staff manage leads" on leads for all to authenticated using (true) with check (true);
