-- Run in the Supabase SQL Editor as postgres AFTER supabase/schema.sql.
-- Creates two random, temporary auth.users fixtures inside one transaction.
-- Direct SQL does not request confirmation emails. No existing users are edited.
-- A successful run ends with ROLLBACK and leaves no fixtures, data, or helpers.
-- If the editor stops on an assertion error, issue ROLLBACK before further work.

begin;

create temporary table rls_test_users (
  label text primary key,
  id uuid not null default gen_random_uuid()
) on commit drop;
insert into rls_test_users (label) values ('alice'), ('bob');
grant select on rls_test_users to authenticated, anon;

insert into auth.users (
  id, aud, role, email, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
select id, 'authenticated', 'authenticated',
       'rls-validation-' || id::text || '@example.invalid', now(),
       '{"provider":"email","providers":["email"]}'::jsonb,
       '{}'::jsonb, now(), now()
from rls_test_users;

create function pg_temp.rls_assert(ok boolean, description text)
returns void language plpgsql security invoker as $function$
begin
  if ok is distinct from true then
    raise exception 'RLS validation failed: %', description;
  end if;
end;
$function$;

create function pg_temp.rls_expect_denied(statement text, description text)
returns void language plpgsql security invoker as $function$
declare denied boolean := false;
begin
  begin
    execute statement;
  exception when insufficient_privilege then
    denied := true;
  end;
  perform pg_temp.rls_assert(denied, description);
end;
$function$;

grant execute on function pg_temp.rls_assert(boolean, text) to authenticated, anon;
grant execute on function pg_temp.rls_expect_denied(text, text) to authenticated, anon;

-- User Alice: own writes succeed, and a completion retry does nothing.
set local role authenticated;
select set_config('request.jwt.claims', jsonb_build_object('sub', id, 'role', 'authenticated')::text, true),
       set_config('request.jwt.claim.sub', id::text, true)
from pg_temp.rls_test_users where label = 'alice';

do $test$
declare
  own_id uuid := (select id from pg_temp.rls_test_users where label = 'alice');
  other_id uuid := (select id from pg_temp.rls_test_users where label = 'bob');
  affected integer;
begin
  perform pg_temp.rls_assert(auth.uid() = own_id, 'Alice JWT identity is active');
  insert into public.study_progress (user_id, card_key)
    values (own_id, 'rls-validation-card')
    on conflict (user_id, card_key) do nothing;
  get diagnostics affected = row_count;
  perform pg_temp.rls_assert(affected = 1, 'Alice can insert her completion');

  insert into public.study_progress (user_id, card_key)
    values (own_id, 'rls-validation-card')
    on conflict (user_id, card_key) do nothing;
  get diagnostics affected = row_count;
  perform pg_temp.rls_assert(affected = 0, 'ignoreDuplicates completion retry is a no-op');
  perform pg_temp.rls_assert(
    (select count(*) = 1 from public.study_progress),
    'Alice can read exactly her completion, including when real user data exists');

  insert into public.study_preferences (user_id, theme) values (own_id, 'dark')
    on conflict (user_id) do update set theme = excluded.theme;
  insert into public.study_preferences (user_id, theme) values (own_id, 'light')
    on conflict (user_id) do update set theme = excluded.theme;
  perform pg_temp.rls_assert(
    (select theme = 'light' from public.study_preferences where user_id = own_id),
    'Alice can insert, update, and read her preference');

  perform pg_temp.rls_expect_denied(format(
    'insert into public.study_progress (user_id, card_key) values (%L, %L)',
    other_id, 'rls-validation-forbidden'), 'Alice cannot insert Bob completion');
  perform pg_temp.rls_expect_denied(format(
    'insert into public.study_preferences (user_id, theme) values (%L, %L)',
    other_id, 'dark'), 'Alice cannot insert Bob preferences');
  perform pg_temp.rls_expect_denied(format(
    'update public.study_progress set completed_at = now() where user_id = %L', own_id),
    'Completed practice is insert-only: Alice cannot update it');
  perform pg_temp.rls_expect_denied(format(
    'delete from public.study_progress where user_id = %L', own_id),
    'Completed practice is insert-only: Alice cannot delete it');
end;
$test$;

-- User Bob: cannot read/update Alice and can maintain his own data.
select set_config('request.jwt.claims', jsonb_build_object('sub', id, 'role', 'authenticated')::text, true),
       set_config('request.jwt.claim.sub', id::text, true)
from pg_temp.rls_test_users where label = 'bob';

do $test$
declare
  own_id uuid := (select id from pg_temp.rls_test_users where label = 'bob');
  other_id uuid := (select id from pg_temp.rls_test_users where label = 'alice');
  affected integer;
begin
  perform pg_temp.rls_assert(auth.uid() = own_id, 'Bob JWT identity is active');
  perform pg_temp.rls_assert(
    (select count(*) = 0 from public.study_progress), 'Bob cannot read Alice completion');
  perform pg_temp.rls_assert(
    (select count(*) = 0 from public.study_preferences), 'Bob cannot read Alice preferences');

  update public.study_preferences set theme = 'dark' where user_id = other_id;
  get diagnostics affected = row_count;
  perform pg_temp.rls_assert(affected = 0, 'Bob cannot update Alice preferences');
  perform pg_temp.rls_expect_denied(format(
    'insert into public.study_progress (user_id, card_key) values (%L, %L) on conflict (user_id, card_key) do nothing',
    other_id, 'rls-validation-card'), 'ignoreDuplicates cannot bypass cross-user insert checks');
  perform pg_temp.rls_expect_denied(format(
    'insert into public.study_preferences (user_id, theme) values (%L, %L) on conflict (user_id) do update set theme = excluded.theme',
    other_id, 'dark'), 'A preference upsert cannot modify another user');

  insert into public.study_progress (user_id, card_key)
    values (own_id, 'rls-validation-card') on conflict (user_id, card_key) do nothing;
  insert into public.study_preferences (user_id, theme) values (own_id, 'dark');
  perform pg_temp.rls_assert(
    (select count(*) = 1 from public.study_progress), 'Bob reads exactly his completion');
  perform pg_temp.rls_assert(
    (select count(*) = 1 from public.study_preferences), 'Bob reads exactly his preferences');

  -- Update WITH CHECK must also reject moving Bob's row to Alice's identity.
  perform pg_temp.rls_expect_denied(format(
    'update public.study_preferences set user_id = %L where user_id = %L', other_id, own_id),
    'Preferences cannot be reassigned to another identity');
end;
$test$;

-- Return to Alice to verify Bob's isolation attempts changed nothing.
select set_config('request.jwt.claims', jsonb_build_object('sub', id, 'role', 'authenticated')::text, true),
       set_config('request.jwt.claim.sub', id::text, true)
from pg_temp.rls_test_users where label = 'alice';

do $test$
declare
  own_id uuid := (select id from pg_temp.rls_test_users where label = 'alice');
  other_id uuid := (select id from pg_temp.rls_test_users where label = 'bob');
  affected integer;
begin
  perform pg_temp.rls_assert(
    (select count(*) = 1 from public.study_progress), 'Alice still reads only her completion');
  perform pg_temp.rls_assert(
    (select count(*) = 1 from public.study_preferences), 'Alice still reads only her preference');
  perform pg_temp.rls_assert(
    (select theme = 'light' from public.study_preferences where user_id = own_id),
    'Alice preference was unchanged by Bob');
  update public.study_preferences set theme = 'system' where user_id = other_id;
  get diagnostics affected = row_count;
  perform pg_temp.rls_assert(affected = 0, 'Alice cannot update Bob preferences');
end;
$test$;

-- An unauthenticated visitor has no access, even with a known fixture UUID.
reset role;
set local role anon;
select set_config('request.jwt.claims', '{}', true),
       set_config('request.jwt.claim.sub', '', true);

do $test$
declare known_id uuid := (select id from pg_temp.rls_test_users where label = 'alice');
begin
  perform pg_temp.rls_assert(auth.uid() is null, 'Anonymous request has no user identity');
  perform pg_temp.rls_expect_denied('select * from public.study_progress', 'Anonymous completion reads denied');
  perform pg_temp.rls_expect_denied('select * from public.study_preferences', 'Anonymous preference reads denied');
  perform pg_temp.rls_expect_denied(format(
    'insert into public.study_progress (user_id, card_key) values (%L, %L)', known_id, 'rls-validation-anon'),
    'Anonymous completion writes denied');
  perform pg_temp.rls_expect_denied(format(
    'insert into public.study_preferences (user_id, theme) values (%L, %L)', known_id, 'light'),
    'Anonymous preference inserts denied');
  perform pg_temp.rls_expect_denied(format(
    'update public.study_preferences set theme = %L where user_id = %L', 'dark', known_id),
    'Anonymous preference updates denied');
end;
$test$;

reset role;
-- Check both fixtures as the SQL Editor owner before removing all test work.
select pg_temp.rls_assert(
  (select count(*) = 2 from public.study_progress where user_id in (select id from rls_test_users)),
  'Exactly two fixture completions remain');
select pg_temp.rls_assert(
  (select theme = 'dark' from public.study_preferences where user_id = (select id from rls_test_users where label = 'bob')),
  'Bob preference was unchanged by Alice');

rollback;

-- Reaching this result means every assertion passed and every fixture rolled back.
select 'PASS: two-user isolation, insert-only completion, preference updates, and anonymous denial; fixtures rolled back.' as validation_result;
