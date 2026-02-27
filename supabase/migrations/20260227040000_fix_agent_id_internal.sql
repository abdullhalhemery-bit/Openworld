alter table public.agents alter column agent_id_internal drop not null;

select pg_notify('pgrst', 'reload schema');
select pg_notify('pgrst', 'reload');
