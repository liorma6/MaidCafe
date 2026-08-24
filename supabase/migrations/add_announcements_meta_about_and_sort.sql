-- Announcements: pin, category, manual order
alter table announcements
  add column if not exists pinned boolean not null default false,
  add column if not exists category text not null default '',
  add column if not exists sort_order int not null default 0;

-- Merch: manual order
alter table merch
  add column if not exists sort_order int not null default 0;

-- About page (editable by admin)
create table if not exists about_page (
  id text primary key default 'main',
  title text not null default 'מי אנחנו',
  content text not null default '',
  updated_at timestamptz not null default now()
);

insert into about_page (id, title, content)
values (
  'main',
  'מי אנחנו',
  'Unique Maid Cafe הוא מייד קפה ישראלי בקונספט יפני. אנחנו מגיעים לאירועים, פסטיבלים וכנסים ומביאים חוויה kawaii מתוקה לקהל.'
)
on conflict (id) do nothing;

alter table about_page enable row level security;

drop policy if exists "about_page_public_read" on about_page;
create policy "about_page_public_read"
  on about_page for select
  to anon, authenticated
  using (true);
