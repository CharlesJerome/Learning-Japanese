-- Apply once in the project's Supabase SQL Editor.
begin;
create table public.study_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  card_key text not null check (length(card_key) between 1 and 160),
  completed_at timestamptz not null default now(),
  primary key (user_id, card_key)
);
create table public.study_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme text not null default 'system' check (theme in ('light', 'dark', 'system'))
);
alter table public.study_progress enable row level security;
alter table public.study_preferences enable row level security;
revoke all on public.study_progress, public.study_preferences from anon, authenticated;
grant select, insert on public.study_progress to authenticated;
grant select, insert, update on public.study_preferences to authenticated;
create policy "Read own practice" on public.study_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "Save own practice" on public.study_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Read own settings" on public.study_preferences for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own settings" on public.study_preferences for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own settings" on public.study_preferences for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
commit;
