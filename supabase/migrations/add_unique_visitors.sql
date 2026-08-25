-- Unique visitors per IP per day + updated counter function
create table if not exists unique_visitors (
  ip_hash text not null,
  visit_date date not null default current_date,
  primary key (ip_hash, visit_date)
);

alter table unique_visitors disable row level security;

alter table site_stats
  add column if not exists daily_views integer not null default 0 check (daily_views >= 0),
  add column if not exists daily_date date;

drop function if exists increment_site_views();

create or replace function increment_all_views(visitor_ip_hash text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  did_insert boolean := false;
begin
  insert into unique_visitors (ip_hash, visit_date)
  values (visitor_ip_hash, current_date)
  on conflict (ip_hash, visit_date) do nothing
  returning true into did_insert;

  if did_insert then
    update site_stats
    set
      views = views + 1,
      daily_views = case
        when daily_date = current_date then daily_views + 1
        else 1
      end,
      daily_date = current_date
    where id = 'main';
  end if;
end;
$$;
