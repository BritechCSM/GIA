-- ENABLE EXTENSIONS
create extension if not exists "pgcrypto"; -- For UUIDs
create extension if not exists "vector";   -- For RAG context

-- ENUMS
create type connection_type as enum ('postgres', 'mysql', 'sqlserver', 'snowflake');
create type message_role as enum ('user', 'assistant', 'system', 'tool');
create type artifact_type as enum ('chart', 'csv', 'sql', 'python_notebook');

-- ORGANIZATIONS (Tenant Isolation)
create table public.organizations (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- DATA SOURCES (Encrypted Connections)
create table public.data_sources (
    id uuid default gen_random_uuid() primary key,
    organization_id uuid references public.organizations not null,
    name text not null,
    type connection_type not null,
    connection_string_encrypted text not null, -- AES-256 GCM
    schema_cache jsonb, -- Cached schema for LLM context
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- SESSIONS (Conversation Context)
create table public.analysis_sessions (
    id uuid default gen_random_uuid() primary key,
    organization_id uuid references public.organizations not null,
    user_id uuid references auth.users not null,
    data_source_id uuid references public.data_sources,
    title text,
    summary text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- MESSAGES (Chat History)
create table public.messages (
    id uuid default gen_random_uuid() primary key,
    session_id uuid references public.analysis_sessions not null,
    role message_role not null,
    content text not null,
    tool_calls jsonb,
    tool_outputs jsonb,
    created_at timestamptz default now()
);

-- RLS POLICIES (MANDATORY)
alter table public.organizations enable row level security;
alter table public.data_sources enable row level security;
alter table public.analysis_sessions enable row level security;
alter table public.messages enable row level security;

-- Org Isolation Policy
-- Note: This assumes a `users_organizations` table exists mapping users to orgs.
-- If not present, we will create a simple placeholder or modify strategy based on auth.users metadata.
-- For MVP, let's assume direct ownership or simple org mapping.
-- As per ADR "Users access own org data". We need the mapping table.

create table public.users_organizations (
  user_id uuid references auth.users not null,
  organization_id uuid references public.organizations not null,
  role text default 'member',
  primary key (user_id, organization_id)
);

alter table public.users_organizations enable row level security;

create policy "Users can see own memberships" on public.users_organizations
  for select using (auth.uid() = user_id);

create policy "Users access own org data" on public.data_sources
    for all using (
        organization_id in (
            select organization_id from public.users_organizations
            where user_id = auth.uid()
        )
    );

create policy "Users access own sessions" on public.analysis_sessions
    for all using (auth.uid() = user_id);

create policy "Users access own messages" on public.messages
    for all using (
        session_id in (
            select id from public.analysis_sessions
            where user_id = auth.uid()
        )
    );
