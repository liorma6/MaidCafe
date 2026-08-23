-- ============================================================
-- Unique Maid Cafe — Full Supabase Setup (run once in SQL Editor)
-- Dashboard → SQL → New query → Paste all → Run
-- ============================================================

-- ── 1. Extensions ─────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── 2. Tables ───────────────────────────────────────────────
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  active boolean not null default true
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null default current_date,
  end_date date,
  description text not null default '',
  cover_image text not null default '',
  created_at timestamptz not null default now()
);

alter table events
  add column if not exists cover_image text not null default '';

alter table events
  add column if not exists end_date date;

create table if not exists event_images (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists event_videos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists merch (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  price text not null default '',
  image text not null default '',
  available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default 'מייד',
  catchphrase text not null default '',
  image text not null,
  chibi_image text not null default '',
  sort_order int not null default 0
);

alter table team_members
  add column if not exists chibi_image text not null default '';

create table if not exists partnerships (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  image text not null default '',
  url text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ── 3. Indexes ──────────────────────────────────────────────
create index if not exists idx_event_images_event_id on event_images(event_id);
create index if not exists idx_event_videos_event_id on event_videos(event_id);
create index if not exists idx_announcements_active on announcements(active);

-- ── 4. Seed data (only if empty) ─────────────────────────────
insert into announcements (title, content, active)
select
  'ברוכים הבאים ל-Unique Maid Cafe! ♡',
  'אנחנו מייד קפה ישראלי בקונספט יפני — פופ-אפים באירועים, אווירה kawaii וחוויה שלא תשכחו! עקבו אחרינו ברשתות כדי לדעת על האירוע הבא שלנו.',
  true
where not exists (select 1 from announcements limit 1);

insert into team_members (name, role, catchphrase, image, chibi_image, sort_order)
select * from (values
  ('Luna', 'מייד', 'מוכנה לשרת אתכם בחיוך! ♡', '/images/team/team-1.png', '/images/team/chibi/team-1-chibi.png', 1),
  ('Sakura', 'מייד', 'אהבה ומתוק בכל כוס! ♡', '/images/team/team-2.png', '/images/team/chibi/team-2-chibi.png', 2),
  ('Hikari', 'מייד', 'אנרגיה טובה וקפה מושלם! ☆', '/images/team/team-3.png', '/images/team/chibi/team-3-chibi.png', 3),
  ('Yuki', 'מייד', 'סגנון, חן וקסם סגול! ♡', '/images/team/team-4.png', '/images/team/chibi/team-4-chibi.png', 4),
  ('Momo', 'מייד', 'עוצמה עם חיוך מתוק! ♡', '/images/team/team-5.png', '/images/team/chibi/team-5-chibi.png', 5)
) as seed(name, role, catchphrase, image, chibi_image, sort_order)
where not exists (select 1 from team_members limit 1);

-- Update existing team with chibi paths (safe to re-run)
update team_members set chibi_image = '/images/team/chibi/team-1-chibi.png' where sort_order = 1 and chibi_image = '';
update team_members set chibi_image = '/images/team/chibi/team-2-chibi.png' where sort_order = 2 and chibi_image = '';
update team_members set chibi_image = '/images/team/chibi/team-3-chibi.png' where sort_order = 3 and chibi_image = '';
update team_members set chibi_image = '/images/team/chibi/team-4-chibi.png' where sort_order = 4 and chibi_image = '';
update team_members set chibi_image = '/images/team/chibi/team-5-chibi.png' where sort_order = 5 and chibi_image = '';

-- ── 5. Row Level Security ───────────────────────────────────
alter table announcements enable row level security;
alter table events enable row level security;
alter table event_images enable row level security;
alter table event_videos enable row level security;
alter table merch enable row level security;
alter table team_members enable row level security;
alter table partnerships enable row level security;

drop policy if exists "announcements_public_read" on announcements;
create policy "announcements_public_read"
  on announcements for select
  to anon, authenticated
  using (active = true);

drop policy if exists "events_public_read" on events;
create policy "events_public_read"
  on events for select
  to anon, authenticated
  using (true);

drop policy if exists "event_images_public_read" on event_images;
create policy "event_images_public_read"
  on event_images for select
  to anon, authenticated
  using (true);

drop policy if exists "event_videos_public_read" on event_videos;
create policy "event_videos_public_read"
  on event_videos for select
  to anon, authenticated
  using (true);

drop policy if exists "merch_public_read" on merch;
create policy "merch_public_read"
  on merch for select
  to anon, authenticated
  using (available = true);

drop policy if exists "team_members_public_read" on team_members;
create policy "team_members_public_read"
  on team_members for select
  to anon, authenticated
  using (true);

drop policy if exists "partnerships_public_read" on partnerships;
create policy "partnerships_public_read"
  on partnerships for select
  to anon, authenticated
  using (true);

-- ── 6. Storage policies ───────────────────────────────────────
-- Create bucket manually first: Storage → New bucket
-- Name: maid-cafe-uploads | Public: ON

drop policy if exists "storage_public_read" on storage.objects;
create policy "storage_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'maid-cafe-uploads');

-- Done! Uploads/deletes go through the server API (service_role).
