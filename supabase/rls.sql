-- Run AFTER schema.sql in Supabase SQL Editor
-- Enables Row Level Security: public read, writes only via service_role (server API)

-- ── Enable RLS on all tables ──────────────────────────────────────────────
alter table announcements enable row level security;
alter table events enable row level security;
alter table event_images enable row level security;
alter table merch enable row level security;
alter table team_members enable row level security;

-- ── Public READ policies (anon + authenticated) ─────────────────────────
-- Writes are blocked for these roles; the Next.js server uses service_role
-- which bypasses RLS, so admin CMS mutations still work.

create policy "announcements_public_read"
  on announcements for select
  to anon, authenticated
  using (active = true);

create policy "events_public_read"
  on events for select
  to anon, authenticated
  using (true);

create policy "event_images_public_read"
  on event_images for select
  to anon, authenticated
  using (true);

create policy "merch_public_read"
  on merch for select
  to anon, authenticated
  using (available = true);

create policy "team_members_public_read"
  on team_members for select
  to anon, authenticated
  using (true);

-- ── Storage bucket policies (maid-cafe-uploads) ───────────────────────────
-- Create the bucket first: Storage → New bucket → maid-cafe-uploads (Public)

create policy "storage_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'maid-cafe-uploads');

-- Uploads/deletes go through the server API with service_role only.
