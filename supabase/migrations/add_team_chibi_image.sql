-- Add chibi_image column and seed default chibi paths for existing team

alter table team_members
  add column if not exists chibi_image text not null default '';

update team_members set chibi_image = '/images/team/chibi/team-1-chibi.png' where sort_order = 1 and chibi_image = '';
update team_members set chibi_image = '/images/team/chibi/team-2-chibi.png' where sort_order = 2 and chibi_image = '';
update team_members set chibi_image = '/images/team/chibi/team-3-chibi.png' where sort_order = 3 and chibi_image = '';
update team_members set chibi_image = '/images/team/chibi/team-4-chibi.png' where sort_order = 4 and chibi_image = '';
update team_members set chibi_image = '/images/team/chibi/team-5-chibi.png' where sort_order = 5 and chibi_image = '';
