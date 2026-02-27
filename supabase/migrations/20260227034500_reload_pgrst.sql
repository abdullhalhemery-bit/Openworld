-- Ensure column exists (idempotent)
alter table public.agents add column if not exists agent_id text;

-- Ask PostgREST to reload schema cache
select pg_notify('pgrst', 'reload schema');
select pg_notify('pgrst', 'reload');
