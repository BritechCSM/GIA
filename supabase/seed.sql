-- Seed Data for GIA

-- 1. Organizations
INSERT INTO public.organizations (id, name, slug)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Acme Corp', 'acme-corp'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Wayne Enterprises', 'wayne-enterprises')
ON CONFLICT (id) DO NOTHING;

-- 2. Profiles & Memberships (Simulated for existing fake users)
-- User 1: Alice (Admin for Acme) - ID: c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33
-- User 2: Bob (Member for Acme) - ID: d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44

-- We cannot easily insert into auth.users without admin API, so we assume these exist or will be claimed.

INSERT INTO public.data_sources (id, organization_id, name, type, connection_string_encrypted, schema_cache)
VALUES
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sales Database', 'postgres', 'encrypted_connection_string_placeholder', '{"tables": ["orders", "products", "customers"]}'),
    ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Marketing Analytics', 'snowflake', 'encrypted_connection_string_placeholder', '{"tables": ["campaigns", "leads"]}');

INSERT INTO public.analysis_sessions (id, organization_id, user_id, data_source_id, title, summary)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Q3 Performance Analysis', 'Analyzing sales trends for Q3 shows a 15% increase in revenue.'),
    ('22222222-2222-2222-2222-222222222222', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Campaign ROI Review', 'Reviewing the ROI of the "Summer Sale" campaign.');

INSERT INTO public.messages (id, session_id, role, content, created_at)
VALUES
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'user', 'Show me the sales by region for Q3.', NOW() - INTERVAL '1 hour'),
    ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'assistant', 'Here are the sales by region for Q3. The North region led with $1.2M.', NOW() - INTERVAL '59 minutes');

-- Insert Dummy Memberships
INSERT INTO public.memberships (user_id, organization_id, role)
VALUES
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'owner'); -- Alice (Owner)
    
-- Helper function to assign verify data to current user (for testing)
CREATE OR REPLACE FUNCTION public.claim_seed_data(org_id uuid)
RETURNS void AS $$
BEGIN
    -- Link current user to the organization
    INSERT INTO public.memberships (user_id, organization_id, role)
    VALUES (auth.uid(), org_id, 'owner')
    ON CONFLICT (user_id, organization_id) DO UPDATE SET role = 'owner';
    
    -- Update sessions to belong to current user
    UPDATE public.analysis_sessions
    SET user_id = auth.uid()
    WHERE organization_id = org_id AND user_id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
