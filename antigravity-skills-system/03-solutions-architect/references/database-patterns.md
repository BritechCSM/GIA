# Database Patterns Reference

## Multi-Tenant Patterns

### Row-Level Isolation (Recommended)

```sql
-- Every table includes organization_id
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    title TEXT NOT NULL,
    content JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS enforces tenant isolation
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members access org documents" ON documents
    FOR ALL 
    USING (
        organization_id IN (
            SELECT organization_id FROM memberships 
            WHERE user_id = auth.uid()
        )
    );
```

### Schema-Per-Tenant (High Isolation)

```sql
-- Use for compliance requirements (HIPAA, etc.)
CREATE SCHEMA tenant_{org_id};

-- Clone table structure to tenant schema
CREATE TABLE tenant_{org_id}.documents (
    LIKE public.documents_template INCLUDING ALL
);
```

## Soft Delete Pattern

```sql
-- Add soft delete column
ALTER TABLE {table} ADD COLUMN deleted_at TIMESTAMPTZ;

-- Create index for performance
CREATE INDEX idx_{table}_deleted ON {table}(deleted_at) 
    WHERE deleted_at IS NULL;

-- RLS automatically excludes deleted
CREATE POLICY "Exclude deleted" ON {table}
    FOR SELECT
    USING (deleted_at IS NULL AND auth.uid() = user_id);

-- Soft delete function
CREATE FUNCTION soft_delete_{table}(record_id UUID)
RETURNS void AS $$
    UPDATE {table} SET deleted_at = now() WHERE id = record_id;
$$ LANGUAGE sql SECURITY DEFINER;
```

## Audit Trail Pattern

```sql
-- Audit log table
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    user_id UUID REFERENCES auth.users(id),
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger function
CREATE FUNCTION audit_trigger() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, old_data, new_data, user_id)
    VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) END,
        CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) END,
        auth.uid()
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to sensitive tables
CREATE TRIGGER audit_{table}
    AFTER INSERT OR UPDATE OR DELETE ON {table}
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();
```

## Optimistic Locking Pattern

```sql
-- Add version column
ALTER TABLE {table} ADD COLUMN version INTEGER DEFAULT 1;

-- Update with version check
UPDATE {table}
SET 
    {columns} = {values},
    version = version + 1,
    updated_at = now()
WHERE id = {id} AND version = {expected_version}
RETURNING *;

-- If no rows returned, version conflict occurred
```

## JSONB Patterns

### Flexible Metadata

```sql
CREATE TABLE items (
    id UUID PRIMARY KEY,
    type TEXT NOT NULL,
    -- Common fields
    title TEXT NOT NULL,
    -- Type-specific fields
    metadata JSONB DEFAULT '{}',
    -- Indexing
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index specific JSON paths
CREATE INDEX idx_items_metadata_status 
    ON items ((metadata->>'status'));

-- GIN index for containment queries
CREATE INDEX idx_items_metadata_gin 
    ON items USING GIN (metadata);
```

### Query Patterns

```sql
-- Exact match
SELECT * FROM items WHERE metadata->>'status' = 'active';

-- Contains key
SELECT * FROM items WHERE metadata ? 'priority';

-- Contains object
SELECT * FROM items WHERE metadata @> '{"tags": ["urgent"]}';

-- Nested access
SELECT * FROM items WHERE metadata->'settings'->>'theme' = 'dark';
```

## Performance Indexes

```sql
-- Partial index (most common)
CREATE INDEX idx_{table}_active ON {table}(created_at DESC)
    WHERE deleted_at IS NULL;

-- Composite index (common filters)
CREATE INDEX idx_{table}_user_status ON {table}(user_id, status)
    WHERE deleted_at IS NULL;

-- Covering index (avoid table lookup)
CREATE INDEX idx_{table}_list ON {table}(user_id, created_at DESC)
    INCLUDE (title, status);
```

## Common Relationships

### One-to-Many with Cascade

```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### Many-to-Many with Junction

```sql
CREATE TABLE post_tags (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (post_id, tag_id)
);
```

### Self-Referential (Tree Structure)

```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES categories(id),
    name TEXT NOT NULL,
    path LTREE, -- Requires ltree extension
    depth INTEGER GENERATED ALWAYS AS (nlevel(path)) STORED
);

-- Query all descendants
SELECT * FROM categories WHERE path <@ 'root.parent.child';
```
