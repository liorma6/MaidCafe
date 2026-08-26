-- Reset visitor counters (run once after bot-filter fix)
truncate table unique_visitors;

update site_stats
set
  views = 0,
  daily_views = 0,
  daily_date = null
where id = 'main';
