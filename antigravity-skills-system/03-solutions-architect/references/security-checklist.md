# Security Checklist Reference

## Pre-Implementation Audit

### Authentication

- [ ] **Auth Provider Configured**
  - OAuth providers (Google, GitHub, etc.)
  - Magic link / passwordless
  - API key management

- [ ] **Session Management**
  - Token expiration set (recommended: 1 hour access, 7 days refresh)
  - Refresh token rotation enabled
  - Secure cookie flags (HttpOnly, Secure, SameSite)

- [ ] **Password Policy** (if applicable)
  - Minimum 12 characters
  - Complexity requirements
  - Breach database check (HaveIBeenPwned API)

### Authorization

- [ ] **RLS Enabled on ALL Tables**
  ```sql
  -- Verify with:
  SELECT tablename, rowsecurity 
  FROM pg_tables 
  WHERE schemaname = 'public';
  ```

- [ ] **Policies Follow Least Privilege**
  - SELECT policies for read access
  - INSERT policies for create access
  - UPDATE policies for modify access
  - DELETE policies for remove access

- [ ] **Service Role Isolated**
  - Never exposed to client
  - Only used in trusted server context

### Input Validation

- [ ] **Schema Validation**
  ```typescript
  // Every endpoint has Zod schema
  const InputSchema = z.object({
    email: z.string().email().max(255),
    name: z.string().min(1).max(100),
    // Reject unknown keys
  }).strict();
  ```

- [ ] **File Upload Validation**
  - MIME type whitelist
  - File size limits
  - Filename sanitization
  - Virus scanning (if applicable)

- [ ] **SQL Injection Prevention**
  - Parameterized queries only
  - No string concatenation in queries

### Data Protection

- [ ] **PII Encryption**
  - Sensitive fields encrypted at rest
  - Encryption keys in secure vault

- [ ] **Data Masking**
  ```typescript
  // Mask in API responses
  function maskEmail(email: string): string {
    const [user, domain] = email.split('@');
    return `${user[0]}***@${domain}`;
  }
  ```

- [ ] **Backup Encryption**
  - Backups encrypted with separate key
  - Point-in-time recovery tested

### API Security

- [ ] **Rate Limiting**
  ```typescript
  // Per-endpoint limits
  const limits = {
    'POST /auth/login': { requests: 5, window: '15m' },
    'POST /api/*': { requests: 100, window: '1m' },
    'GET /api/*': { requests: 1000, window: '1m' },
  };
  ```

- [ ] **CORS Configuration**
  ```typescript
  // Explicit origin whitelist
  const corsOptions = {
    origin: ['https://app.example.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  };
  ```

- [ ] **Security Headers**
  ```typescript
  // Required headers
  const securityHeaders = {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'",
  };
  ```

### Infrastructure

- [ ] **Secrets Management**
  - No secrets in code
  - No secrets in version control
  - Environment variables or vault

- [ ] **Network Security**
  - Database not publicly accessible
  - VPC/private networking configured
  - Firewall rules minimal

- [ ] **Dependency Security**
  ```bash
  # Run before every deploy
  npm audit --audit-level=high
  # Must return 0 vulnerabilities
  ```

## Runtime Monitoring

### Logging Requirements

- [ ] **Security Events Logged**
  - Authentication attempts (success/failure)
  - Authorization failures
  - Input validation failures
  - Unusual access patterns

- [ ] **Log Security**
  - No PII in logs
  - No secrets in logs
  - Log retention policy defined

### Alerting

- [ ] **Security Alerts Configured**
  - Multiple failed login attempts
  - Unusual geographic access
  - Privilege escalation attempts
  - API abuse patterns

## Compliance Checklist

### GDPR (if applicable)

- [ ] Data processing agreement documented
- [ ] Right to deletion implemented
- [ ] Data export capability
- [ ] Consent management

### SOC 2 (if applicable)

- [ ] Access controls documented
- [ ] Change management process
- [ ] Incident response plan
- [ ] Vendor security assessment

## Sign-Off

| Area | Reviewed By | Date | Status |
|------|-------------|------|--------|
| Authentication | | | ⬜ |
| Authorization | | | ⬜ |
| Data Protection | | | ⬜ |
| API Security | | | ⬜ |
| Infrastructure | | | ⬜ |

**Overall Status:** ⬜ Pending | ⬜ Approved | ⬜ Blocked
