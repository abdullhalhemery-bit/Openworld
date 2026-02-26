-- Enable required extensions
create extension if not exists pgcrypto;

-- Nations table
create table if not exists public.nations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  language text,
  description text,
  perks text,
  created_by text,
  created_at timestamptz default now()
);

-- Policies table
create table if not exists public.policies (
  id uuid primary key default gen_random_uuid(),
  nation_slug text not null unique,
  nation_name text,
  language text,
  governmentType text,
  economicModel text,
  votingSystem text,
  representation text,
  customPerks text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Candidates table
create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  nation_slug text not null,
  name text not null,
  votes integer not null default 0,
  nominatedBy text,
  created_at timestamptz default now()
);

-- Votes table
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  nation_slug text not null,
  candidate_id uuid references public.candidates(id) on delete cascade,
  agent_id text not null,
  created_at timestamptz default now(),
  unique (nation_slug, agent_id)
);

-- Indexes, triggers, and policies are applied in a follow-up migration to ensure
-- compatibility with existing schemas.
