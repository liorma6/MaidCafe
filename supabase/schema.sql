-- Run this in Supabase SQL Editor (Dashboard → SQL → New query)

create extension if not exists "pgcrypto";

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
  description text not null default '',
  cover_image text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists event_images (
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
  sort_order int not null default 0
);

create index if not exists idx_event_images_event_id on event_images(event_id);
create index if not exists idx_announcements_active on announcements(active);

-- Seed: welcome announcement (skip if already exists)
insert into announcements (title, content, active)
select
  'ברוכים הבאים ל-Unique Maid Cafe! ♡',
  'אנחנו מייד קפה ישראלי בקונספט יפני — פופ-אפים באירועים, אווירה kawaii וחוויה שלא תשכחו! עקבו אחרינו ברשתות כדי לדעת על האירוע הבא שלנו.',
  true
where not exists (select 1 from announcements limit 1);

-- Seed: team members (static images from /public/images/team/)
insert into team_members (name, role, catchphrase, image, sort_order)
select * from (values
  ('Luna', 'מייד', 'מוכנה לשרת אתכם בחיוך! ♡', '/images/team/team-1.png', 1),
  ('Sakura', 'מייד', 'אהבה ומתוק בכל כוס! ♡', '/images/team/team-2.png', 2),
  ('Hikari', 'מייד', 'אנרגיה טובה וקפה מושלם! ☆', '/images/team/team-3.png', 3),
  ('Yuki', 'מייד', 'סגנון, חן וקסם סגול! ♡', '/images/team/team-4.png', 4),
  ('Momo', 'מייד', 'עוצמה עם חיוך מתוק! ♡', '/images/team/team-5.png', 5)
) as seed(name, role, catchphrase, image, sort_order)
where not exists (select 1 from team_members limit 1);

-- Storage bucket (create in Dashboard → Storage → New bucket)
-- Name: maid-cafe-uploads
-- Public bucket: ON
-- Allowed MIME types: image/*
