-- ═══════════════════════════════════════════════════════════
--  BUECON — Catalog Leads Table
--  Run this once in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

create table if not exists catalog_leads (
  id             bigint primary key generated always as identity,
  name           text not null,
  email          text not null,
  phone          text not null,
  company        text,
  city           text,
  user_type      text,
  consent        boolean default true,
  downloaded_at  timestamptz default now()
);

-- Index for fast admin queries
create index if not exists catalog_leads_downloaded_at_idx
  on catalog_leads (downloaded_at desc);

-- Allow anonymous inserts (visitors submit the form)
alter table catalog_leads enable row level security;

create policy "Anyone can insert catalog leads"
  on catalog_leads for insert
  to anon
  with check (true);

create policy "Authenticated can read all leads"
  on catalog_leads for select
  to anon
  using (true);

-- (Optional) Allow reading with the anon key from admin panel
-- If your admin panel uses the anon key (which it does), the above select policy is needed.
