# Testing Checklist Reference

## Functional Testing

### Authentication Flows

| Test Case | Steps | Expected |
|-----------|-------|----------|
| Valid login | Enter correct credentials | Redirect to dashboard |
| Invalid login | Enter wrong password | Error message, no redirect |
| Session expiry | Wait for token expiry | Graceful re-auth prompt |
| Logout | Click logout | Clear session, redirect to login |
| Password reset | Request reset email | Email sent, link works |
| OAuth login | Click Google/GitHub | Complete OAuth flow |

### CRUD Operations

| Test Case | Steps | Expected |
|-----------|-------|----------|
| Create valid | Submit valid data | Item created, UI updated |
| Create invalid | Submit invalid data | Validation errors shown |
| Read list | Load list page | Items displayed correctly |
| Read detail | Click item | Detail view loads |
| Update item | Edit and save | Changes persisted |
| Delete item | Confirm delete | Item removed, UI updated |

### Authorization

| Test Case | Steps | Expected |
|-----------|-------|----------|
| Access own data | Load own resources | Data visible |
| Access others' data | Attempt via URL | 403 or empty result |
| Admin-only feature | Non-admin access | Hidden or blocked |
| Guest access | No auth, protected route | Redirect to login |

## Visual Testing

### Responsive Breakpoints

```
320px  - iPhone SE / small phones
375px  - iPhone standard
390px  - iPhone 12/13/14
428px  - iPhone Plus/Max
768px  - iPad portrait
1024px - iPad landscape / small desktop
1280px - Standard desktop
1440px - Large desktop
1920px - Full HD
```

### Per-Breakpoint Checklist

- [ ] No horizontal overflow
- [ ] Text is readable (16px+ on mobile)
- [ ] Touch targets ≥44px
- [ ] Images scale appropriately
- [ ] Navigation accessible
- [ ] Forms fully usable
- [ ] Modals fit screen

### Cross-Browser

| Browser | Versions | Priority |
|---------|----------|----------|
| Chrome | Latest 2 | HIGH |
| Safari | Latest 2 | HIGH |
| Firefox | Latest 2 | MEDIUM |
| Edge | Latest 2 | MEDIUM |
| Safari iOS | Latest 2 | HIGH |
| Chrome Android | Latest 2 | HIGH |

## Performance Testing

### Core Web Vitals

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | ≤2.5s | ≤4.0s | >4.0s |
| FID | ≤100ms | ≤300ms | >300ms |
| CLS | ≤0.1 | ≤0.25 | >0.25 |
| TTFB | ≤800ms | ≤1800ms | >1800ms |

### Load Testing Scenarios

```
Light:     10 concurrent users
Normal:    100 concurrent users  
Heavy:     1000 concurrent users
Spike:     10→1000→10 over 5 minutes
```

### Bundle Analysis

```bash
# Next.js
npm run build
# Check .next/analyze/client.html

# Vite
npm run build -- --analyze
```

**Size Budgets:**
- Initial JS: < 200KB
- Total JS: < 500KB
- CSS: < 100KB
- Images: WebP, max 200KB each

## Security Testing

### OWASP Top 10 Checklist

| Vulnerability | Test | Tool |
|--------------|------|------|
| Injection | SQL/NoSQL injection attempts | Manual + SQLMap |
| Broken Auth | Session hijacking, weak passwords | Manual |
| XSS | Script injection in inputs | Manual + OWASP ZAP |
| IDOR | Access others' resources by ID | Manual |
| Security Misconfig | Headers, error messages | SecurityHeaders.com |
| Sensitive Data | Check responses for PII | Manual |
| Missing Access Control | Test role boundaries | Manual |
| CSRF | Cross-site request attempts | Manual |

### Security Headers Check

```bash
curl -I https://yoursite.com
```

**Required Headers:**
```
Strict-Transport-Security: max-age=63072000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
```

## Accessibility Testing

### Automated Tools

1. **axe DevTools** - Browser extension
2. **Lighthouse** - Built into Chrome
3. **WAVE** - Web accessibility evaluator

### Manual Testing

| Test | Method | Pass Criteria |
|------|--------|---------------|
| Keyboard nav | Tab through page | All interactive elements reachable |
| Screen reader | Use VoiceOver/NVDA | Content understandable |
| Color contrast | Use contrast checker | 4.5:1 for text |
| Focus visible | Tab navigation | Focus ring visible |
| Alt text | Inspect images | All meaningful images have alt |

### Accessibility Checklist

- [ ] Skip link present
- [ ] Heading hierarchy correct (h1→h6)
- [ ] Form labels associated
- [ ] Error messages announced
- [ ] Color not sole indicator
- [ ] 200% zoom usable
- [ ] Reduced motion respected

## Error Handling Testing

### Error Scenarios

| Scenario | Test Method | Expected Behavior |
|----------|-------------|-------------------|
| Network offline | Disable network | Offline indicator, cached data |
| API 500 error | Mock error response | Error message, retry option |
| API timeout | Delay response | Loading state, timeout message |
| Invalid data | Return malformed JSON | Graceful fallback |
| Auth expired | Clear token mid-session | Re-auth prompt |

### Error Boundary Testing

```tsx
// Trigger error in component
throw new Error('Test error');

// Expected: Error boundary catches, shows fallback UI
```

## Regression Testing

### Pre-Release Checklist

- [ ] All critical user flows work
- [ ] No new console errors
- [ ] Performance metrics stable
- [ ] Previous bug fixes still work
- [ ] No visual regressions

### Smoke Test Suite

```
1. Load homepage
2. Sign in
3. Navigate to main feature
4. Perform primary action
5. Sign out
```

**Timing:** Run after every deployment, should complete in <5 minutes.

## Test Documentation

### Bug Report Template

```markdown
## Bug Title

### Environment
- Browser: 
- Device: 
- OS: 
- App Version:

### Steps to Reproduce
1. 
2. 
3. 

### Expected Behavior


### Actual Behavior


### Screenshots/Video


### Console Errors


### Severity
[ ] Critical - App unusable
[ ] High - Feature broken
[ ] Medium - Degraded experience  
[ ] Low - Minor issue

### Additional Context

```
