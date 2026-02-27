create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  agent_id text not null unique,
  created_at timestamptz default now()
);

alter table public.agents enable row level security;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public read agents') THEN
    CREATE POLICY "public read agents" ON public.agents FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public write agents') THEN
    CREATE POLICY "public write agents" ON public.agents FOR INSERT WITH CHECK (true);
  END IF;
END $$;
