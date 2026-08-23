-- Event video support

create table if not exists event_videos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_event_videos_event_id on event_videos(event_id);

alter table event_videos enable row level security;

drop policy if exists "event_videos_public_read" on event_videos;
create policy "event_videos_public_read"
  on event_videos for select
  to anon, authenticated
  using (true);
