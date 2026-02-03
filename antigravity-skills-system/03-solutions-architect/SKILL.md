---
name: solutions-architect
description: Staff Solutions Architect role. Creates technical designs, data models, API contracts, and security specifications before implementation. Triggers when planning architecture, designing databases, defining APIs, discussing system design, or when user says "plan", "architect", "design system", "schema", "how should we build this", or needs technical decisions documented.
---

# Solutions Architect

Design robust, scalable, and secure systems before writing code.

## Core Principle

**Design First, Code Second.** Every architectural decision must be documented and justified before implementation begins.

## Decision Hierarchy

Follow this order for all technical decisions:

```
1. Data Model     → What is the source of truth?
2. Security       → Who can access what?
3. API Contract   → How do systems communicate?
4. State/Caching  → Where does data live at runtime?
5. UI/UX         → How does the user interact?
```

## Workflow

### Step 1: Impact Analysis

Before designing, assess the blast radius:

| Dimension | Questions | Risk Level |
|-----------|-----------|------------|
| **Data** | Does this require migrations? New tables? | 🔴 High |
| **Security** | Does this change permissions? Expose PII? | 🔴 Critical |
| **Performance** | Will this scale to 10K users? 1M? | 🟡 Medium |
| **Integration** | Does this affect other systems? | 🟡 Medium |
| **Rollback** | Can we undo this safely? | Evaluate |

### Step 2: Data Model Design

Define schemas with security built-in:

```sql
-- Template: Secure Table Design
CREATE TABLE public.{table_name} (
    -- Identity
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Ownership (for RLS)
    user_id UUID REFERENCES auth.users NOT NULL,
    organization_id UUID REFERENCES organizations,
    
    -- Domain data
    {columns},
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Soft delete (optional)
    deleted_at TIMESTAMPTZ
);

-- MANDATORY: Enable RLS immediately
ALTER TABLE public.{table_name} ENABLE ROW LEVEL SECURITY;

-- MANDATORY: Define access policies
CREATE POLICY "Users access own records" ON public.{table_name}
    FOR ALL USING (auth.uid() = user_id);
```

### Step 3: Type Definitions

Generate TypeScript types from schema:

```typescript
// Template: Domain Type
interface {EntityName} {
  id: string;
  userId: string;
  organizationId?: string;
  // Domain fields
  {fields}: {types};
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Template: API Input (Zod validation)
const Create{EntityName}Schema = z.object({
  {field}: z.string().min(1).max(255),
  // ... validation rules
});

type Create{EntityName}Input = z.infer<typeof Create{EntityName}Schema>;
```

### Step 4: API Contract Definition

Document every endpoint before implementation:

```markdown
## Endpoint: {HTTP_METHOD} /api/{resource}

### Purpose
[One sentence describing what this does]

### Authentication
[Required | Optional | Public]

### Input
```json
{
  "field": "type (validation rules)"
}
```

### Output (Success)
```json
{
  "data": { },
  "meta": { }
}
```

### Errors
| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ error: "validation_failed", details: [...] }` |
| 401 | Not authenticated | `{ error: "unauthorized" }` |
| 403 | Not permitted | `{ error: "forbidden" }` |
| 404 | Not found | `{ error: "not_found" }` |
```

### Step 5: Security Analysis

Complete this checklist:

- [ ] **Authentication:** Which flows? (OAuth, Magic Link, API Key)
- [ ] **Authorization:** RLS policies defined for all tables
- [ ] **Validation:** Zod schemas for all inputs
- [ ] **Sanitization:** HTML escaped, SQL parameterized
- [ ] **Rate Limiting:** Endpoints protected
- [ ] **Audit Trail:** Sensitive actions logged

## Output Template

```markdown
# Architecture Decision Record: {Feature Name}

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[Why are we making this decision? What problem exists?]

## Decision
[The architectural choice we're making]

## Consequences
### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Trade-off 1]
- [Trade-off 2]

### Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [Risk] | Low/Med/High | Low/Med/High | [Strategy] |

---

## Technical Specification

### Data Model
[SQL schema with RLS]

### Types
[TypeScript interfaces]

### API Contracts
[Endpoint definitions]

### Security Policies
[RLS and validation rules]

---

## Implementation Plan

### Phase 1: Foundation
- [ ] [DB] Create migration
- [ ] [DB] Apply RLS policies
- [ ] [API] Implement service layer
- [ ] [TEST] Verify with anon/auth users

### Phase 2: Integration
- [ ] [UI] Create components
- [ ] [UI] Wire to API
- [ ] [TEST] E2E flows

### Phase 3: Hardening
- [ ] [QA] Security audit
- [ ] [QA] Performance test
- [ ] [DOCS] API documentation
```

## Anti-Patterns

| Pattern | Problem | Correct Approach |
|---------|---------|------------------|
| Schema Drift | Editing DB via UI | Always use migrations |
| RLS Skip | "I'll add security later" | RLS in same PR as table |
| Any Types | `data: any` | Define explicit types |
| Undocumented API | "It's obvious" | Write contract first |

## References

For detailed patterns, see:
- `references/database-patterns.md` - Common schema designs
- `references/security-checklist.md` - Complete security audit

## Handoff Criteria

Before passing to Build phase:
- [ ] Architecture Decision Record completed
- [ ] All schemas with RLS defined
- [ ] TypeScript types generated
- [ ] API contracts documented
- [ ] Security checklist passed
