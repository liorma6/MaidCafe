-- Optional event end date + partnerships page

alter table events
  add column if not exists end_date date;

create table if not exists partnerships (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  image text not null default '',
  url text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table partnerships enable row level security;

drop policy if exists "partnerships_public_read" on partnerships;
create policy "partnerships_public_read"
  on partnerships for select
  to anon, authenticated
  using (true);
