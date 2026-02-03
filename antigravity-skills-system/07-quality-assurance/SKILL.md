---
name: quality-assurance
description: QA Lead and Release Engineer role. Performs comprehensive quality audits covering runtime stability, mobile responsiveness, security, and code quality. Triggers when reviewing code, preparing for deployment, debugging production issues, or when user mentions "QA", "review", "check", "audit", "production ready", "test", "bug", "fix", or needs quality verification before release.
---

# Quality Assurance

Enforce zero-defect policy through systematic quality verification.

## Core Mandate

Assume everything is broken until proven working. Verify:

1. **Runtime Stability:** Zero console errors
2. **Layout Integrity:** No breakage 320px → 4K
3. **Security Posture:** RLS active, inputs validated
4. **Performance:** Within budget

## Audit Protocol

### Step 1: Console Zero Policy

Open DevTools → Console → Refresh page.

**Blockers (Immediate Fix Required):**
- ❌ Any red error messages
- ❌ React key warnings
- ❌ Unhandled promise rejections
- ❌ 404 for assets/API calls

**Warnings (Fix Before Deploy):**
- ⚠️ Deprecation warnings
- ⚠️ Missing dependencies in useEffect

### Step 2: Mobile Hardening (320px Challenge)

Test at these breakpoints:

| Width | Device | Critical Checks |
|-------|--------|-----------------|
| 320px | iPhone SE | No horizontal scroll |
| 375px | iPhone standard | Touch targets ≥44px |
| 768px | Tablet | Layout transitions |
| 1024px | Desktop | Full functionality |

**Verification Checklist:**
- [ ] No horizontal scrollbar on `body`
- [ ] No clipped button text
- [ ] Modals scroll internally or fill screen
- [ ] Forms fully usable on mobile

### Step 3: Security Audit

**Database:**
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = false;
-- Must return 0 rows
```

**Authentication:**
- [ ] Clear storage → app redirects to login
- [ ] Expired token → graceful re-authentication
- [ ] Invalid token → no data leak

**Input Handling:**
```
Test: <script>alert('xss')</script>
Expected: Rendered as text, not executed

Test: ' OR 1=1 --
Expected: No SQL injection, parameterized
```

### Step 4: Code Quality Scan

**Critical Issues (Block Deploy):**

| Pattern | Detection | Risk |
|---------|-----------|------|
| `any` type | `grep -r ": any"` | Type safety loss |
| Hardcoded secrets | `grep -r "sk_live\|api_key="` | Security breach |
| Console.log | `grep -r "console.log"` | Debug code in prod |
| TODO in critical path | `grep -r "TODO\|FIXME"` | Incomplete code |

**High Priority (Fix Soon):**

| Pattern | Detection | Impact |
|---------|-----------|--------|
| Missing error boundary | Component audit | Crash propagation |
| No loading state | UI audit | Poor UX |
| Missing `key` prop | React warnings | Render bugs |

### Step 5: Performance Check

**Metrics Budget:**

| Metric | Target | Tool |
|--------|--------|------|
| LCP | < 2.5s | Lighthouse |
| FID | < 100ms | Lighthouse |
| CLS | < 0.1 | Lighthouse |
| Bundle size | < 200KB (initial) | Build output |

**Quick Checks:**
- [ ] Images in WebP/AVIF format
- [ ] Lazy loading for below-fold content
- [ ] No massive dependencies (moment.js, lodash full)

## Report Template

```markdown
# QA Validation Report

## Build: [version/commit]
## Date: [date]
## Status: 🔴 BLOCKED | 🟡 WARNING | 🟢 PASSED

---

## 1. Critical Blockers
> Must fix before any deployment

| Issue | Location | Severity | Fix |
|-------|----------|----------|-----|
| [Description] | [file:line] | CRITICAL | [Solution] |

## 2. High Priority
> Fix before production deployment

| Issue | Location | Severity | Fix |
|-------|----------|----------|-----|
| [Description] | [file:line] | HIGH | [Solution] |

## 3. Medium Priority
> Fix in next sprint

| Issue | Location | Severity | Fix |
|-------|----------|----------|-----|
| [Description] | [file:line] | MEDIUM | [Solution] |

## 4. Polish Items
> Nice to have improvements

| Issue | Location | Impact | Suggestion |
|-------|----------|--------|------------|
| [Description] | [file:line] | LOW | [Improvement] |

---

## Test Coverage Summary

| Area | Status | Notes |
|------|--------|-------|
| Console errors | ✅/❌ | |
| Mobile 320px | ✅/❌ | |
| Mobile 375px | ✅/❌ | |
| Tablet 768px | ✅/❌ | |
| Desktop 1024px | ✅/❌ | |
| RLS enabled | ✅/❌ | |
| Auth flows | ✅/❌ | |
| XSS protection | ✅/❌ | |
| Performance budget | ✅/❌ | |

---

## Sign-off

- [ ] All CRITICAL issues resolved
- [ ] All HIGH issues resolved or documented
- [ ] Security checklist passed
- [ ] Performance within budget

**Approved for deployment:** YES / NO
**Reviewer:** [name]
**Date:** [date]
```

## Common Fixes

### Mobile Overflow

```css
/* ❌ Causes horizontal scroll */
.container { width: 400px; }

/* ✅ Responsive */
.container { width: 100%; max-width: 400px; }
```

### Null Safety

```typescript
/* ❌ Crashes if user.profile is null */
return user.profile.name;

/* ✅ Safe access */
return user?.profile?.name ?? 'Anonymous';
```

### Z-Index Conflicts

```typescript
/* ❌ Z-index arms race */
className="z-[99999]"

/* ✅ Use portal for modals */
import { createPortal } from 'react-dom';
createPortal(<Modal />, document.body);
```

### Missing Loading State

```tsx
/* ❌ Shows nothing while loading */
if (!data) return null;

/* ✅ Skeleton feedback */
if (isLoading) return <Skeleton />;
if (error) return <ErrorState onRetry={refetch} />;
if (!data?.length) return <EmptyState />;
```

## References

- `references/testing-checklist.md` - Detailed testing procedures

## Handoff Criteria

Before passing to Deployment:
- [ ] QA report generated
- [ ] All CRITICAL/HIGH issues resolved
- [ ] Security audit passed
- [ ] Performance within budget
- [ ] Sign-off documented
