-- ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- For UUIDs
CREATE EXTENSION IF NOT EXISTS "vector";   -- For RAG context

-- ENUMS
CREATE TYPE connection_type AS ENUM ('postgres', 'mysql', 'sqlserver', 'snowflake');
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system', 'tool');
CREATE TYPE artifact_type AS ENUM ('chart', 'csv', 'sql', 'python_notebook');

-- ORGANIZATIONS (Tenant Isolation)
CREATE TABLE public.organizations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- USER_ORG_MAPPING (Many-to-Many for users in orgs)
CREATE TABLE public.users_organizations (
    user_id uuid REFERENCES auth.users NOT NULL,
    organization_id uuid REFERENCES public.organizations NOT NULL,
    role text DEFAULT 'member', -- 'admin', 'member'
    PRIMARY KEY (user_id, organization_id)
);

-- DATA SOURCES (Encrypted Connections)
CREATE TABLE public.data_sources (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid REFERENCES public.organizations NOT NULL,
    name text NOT NULL,
    type connection_type NOT NULL,
    connection_string_encrypted text NOT NULL, -- AES-256 GCM
    schema_cache jsonb, -- Cached schema for LLM context
    created_at timestamptz DEFAULT now()
);

-- SESSIONS (Conversation Context)
CREATE TABLE public.analysis_sessions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid REFERENCES public.organizations NOT NULL,
    user_id uuid REFERENCES auth.users NOT NULL,
    data_source_id uuid REFERENCES public.data_sources,
    title text,
    summary text,
    created_at timestamptz DEFAULT now()
);

-- MESSAGES (Chat History)
CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id uuid REFERENCES public.analysis_sessions NOT NULL,
    role message_role NOT NULL,
    content text NOT NULL,
    tool_calls jsonb, 
    tool_outputs jsonb,
    created_at timestamptz DEFAULT now()
);

-- ARTIFACTS (Generated Assets)
CREATE TABLE public.artifacts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id uuid REFERENCES public.messages NOT NULL,
    type artifact_type NOT NULL,
    data jsonb NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- RLS POLICIES
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;

-- POLICY: Organization Access
CREATE POLICY "Users view own organizations" ON public.organizations
    FOR SELECT USING (
        id IN (SELECT organization_id FROM public.users_organizations WHERE user_id = auth.uid())
    );

-- POLICY: Data Sources (Org Isolated)
CREATE POLICY "Users access own org data sources" ON public.data_sources
    FOR ALL USING (
        organization_id IN (SELECT organization_id FROM public.users_organizations WHERE user_id = auth.uid())
    );

-- POLICY: Sessions (Org Isolated)
CREATE POLICY "Users access own org sessions" ON public.analysis_sessions
    FOR ALL USING (
        organization_id IN (SELECT organization_id FROM public.users_organizations WHERE user_id = auth.uid())
    );

-- POLICY: Messages (Session Linked)
CREATE POLICY "Users access messages in own sessions" ON public.messages
    FOR ALL USING (
        session_id IN (
            SELECT id FROM public.analysis_sessions 
            WHERE organization_id IN (SELECT organization_id FROM public.users_organizations WHERE user_id = auth.uid())
        )
    );

-- POLICY: Artifacts (Message Linked)
CREATE POLICY "Users access artifacts in own messages" ON public.artifacts
    FOR ALL USING (
        message_id IN (
            SELECT id FROM public.messages
            WHERE session_id IN (
                SELECT id FROM public.analysis_sessions
                WHERE organization_id IN (SELECT organization_id FROM public.users_organizations WHERE user_id = auth.uid())
            )
        )
    );
