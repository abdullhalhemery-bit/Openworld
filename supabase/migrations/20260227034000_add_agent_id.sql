alter table public.agents add column if not exists agent_id text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'agents_agent_id_idx'
  ) THEN
    CREATE UNIQUE INDEX agents_agent_id_idx ON public.agents (agent_id);
  END IF;
END $$;
