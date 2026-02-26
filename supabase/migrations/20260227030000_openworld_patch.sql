-- Ensure columns exist on existing tables
alter table public.nations add column if not exists slug text;
alter table public.nations add column if not exists language text;
alter table public.nations add column if not exists description text;
alter table public.nations add column if not exists perks text;
alter table public.nations add column if not exists created_by text;

alter table public.policies add column if not exists nation_slug text;
alter table public.policies add column if not exists nation_name text;
alter table public.policies add column if not exists language text;
alter table public.policies add column if not exists governmentType text;
alter table public.policies add column if not exists economicModel text;
alter table public.policies add column if not exists votingSystem text;
alter table public.policies add column if not exists representation text;
alter table public.policies add column if not exists customPerks text;

alter table public.candidates add column if not exists nation_slug text;
alter table public.candidates add column if not exists votes integer default 0;
alter table public.candidates add column if not exists nominatedBy text;

alter table public.votes add column if not exists nation_slug text;
alter table public.votes add column if not exists agent_id text;

-- Add unique constraints if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'nations_slug_idx'
  ) THEN
    CREATE INDEX nations_slug_idx ON public.nations (slug);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'candidates_nation_idx'
  ) THEN
    CREATE INDEX candidates_nation_idx ON public.candidates (nation_slug);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'votes_nation_idx'
  ) THEN
    CREATE INDEX votes_nation_idx ON public.votes (nation_slug);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'votes_nation_agent_unique'
  ) THEN
    ALTER TABLE public.votes
      ADD CONSTRAINT votes_nation_agent_unique UNIQUE (nation_slug, agent_id);
  END IF;
END $$;

-- RLS + policies (idempotent)
alter table public.nations enable row level security;
alter table public.policies enable row level security;
alter table public.candidates enable row level security;
alter table public.votes enable row level security;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public read nations') THEN
    CREATE POLICY "public read nations" ON public.nations FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public write nations') THEN
    CREATE POLICY "public write nations" ON public.nations FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public read policies') THEN
    CREATE POLICY "public read policies" ON public.policies FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public write policies') THEN
    CREATE POLICY "public write policies" ON public.policies FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public update policies') THEN
    CREATE POLICY "public update policies" ON public.policies FOR UPDATE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public read candidates') THEN
    CREATE POLICY "public read candidates" ON public.candidates FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public write candidates') THEN
    CREATE POLICY "public write candidates" ON public.candidates FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public read votes') THEN
    CREATE POLICY "public read votes" ON public.votes FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public write votes') THEN
    CREATE POLICY "public write votes" ON public.votes FOR INSERT WITH CHECK (true);
  END IF;
END $$;
