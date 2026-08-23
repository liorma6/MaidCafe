-- Run in Supabase SQL Editor if events table already exists without cover_image

alter table events
  add column if not exists cover_image text not null default '';
