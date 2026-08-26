-- FAQ items for home page (admin-editable)
create table if not exists faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into faq_items (question, answer, sort_order, active)
select * from (values
  (
    'האם אתם המייד קפה הראשון בישראל?'::text,
    'כן! Unique Maid Cafe (יוניק מייד קפה) מביא את חוויית המייד קפה היפנית המקורית ישירות לישראל.'::text,
    0,
    true
  ),
  (
    'איפה אפשר למצוא מייד קפה בישראל?'::text,
    'אנחנו מקיימים אירועי פופ-אפ מתחלפים ברחבי הארץ. עקבו אחרינו ברשתות החברתיות כדי לדעת מתי המייד קפה הקרוב מגיע אליכם.'::text,
    1,
    true
  )
) as seed(question, answer, sort_order, active)
where not exists (select 1 from faq_items limit 1);

alter table faq_items enable row level security;

drop policy if exists "faq_items_public_read" on faq_items;
create policy "faq_items_public_read"
  on faq_items for select
  to anon, authenticated
  using (active = true);
