alter table public.agents add column if not exists name text;

select pg_notify('pgrst', 'reload schema');
select pg_notify('pgrst', 'reload');
