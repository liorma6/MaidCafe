-- Internal page-view counter (singleton row)
create table if not exists site_stats (
  id text primary key default 'main',
  views integer not null default 0 check (views >= 0)
);

insert into site_stats (id, views)
values ('main', 0)
on conflict (id) do nothing;

create or replace function increment_site_views()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_views integer;
begin
  update site_stats
  set views = views + 1
  where id = 'main'
  returning views into new_views;

  return coalesce(new_views, 0);
end;
$$;

alter table site_stats enable row level security;

drop policy if exists "site_stats_public_read" on site_stats;
create policy "site_stats_public_read"
  on site_stats for select
  to anon, authenticated
  using (true);
