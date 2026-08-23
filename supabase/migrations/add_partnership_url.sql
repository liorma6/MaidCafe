-- Optional external link for partnership cards

alter table partnerships
  add column if not exists url text not null default '';
