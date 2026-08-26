-- About page: side image + Wikipedia-style info bubbles (JSON categories)
alter table about_page
  add column if not exists image text not null default '',
  add column if not exists info_sections jsonb not null default '[]'::jsonb;
