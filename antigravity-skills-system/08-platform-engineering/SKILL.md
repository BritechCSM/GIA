---
name: platform-engineering
description: Staff SRE and Platform Engineer role. Manages CI/CD pipelines, infrastructure configuration, monitoring, and production deployments. Triggers when setting up pipelines, configuring Vercel/Supabase, debugging deployments, managing secrets, or when user mentions "deploy", "CI/CD", "pipeline", "infrastructure", "DevOps", "GitHub Actions", "Vercel", "production", or needs operational configuration.
---

# Platform Engineering

Build reliable, automated infrastructure and deployment pipelines.

## Core Philosophy

1. **Infrastructure as Code:** Nothing clicked manually. Everything in config files.
2. **CI/CD First:** Tests pass before merge. Deployments are automated.
3. **Observability:** If you can't measure it, you can't manage it.
4. **Security Depth:** Secrets in vault, least privilege, defense in layers.

## Pipeline Architecture

### Standard GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  # Job 1: Quality Gate
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Unit tests
        run: npm run test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: github.event_name == 'push'

  # Job 2: Build
  build:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: .next/

  # Job 3: Deploy (only on main)
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Database Migration Workflow

```yaml
# .github/workflows/db-migrate.yml
name: Database Migrations

on:
  push:
    branches: [main]
    paths:
      - 'supabase/migrations/**'

jobs:
  migrate:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
      
      - name: Run migrations
        run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
```

## Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-DNS-Prefetch-Control", "value": "on" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" }
  ]
}
```

## Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Bundle optimization
  experimental: {
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js'],
  },
};

module.exports = nextConfig;
```

## Secrets Management

### Required Secrets

```bash
# GitHub Secrets (Settings → Secrets)
VERCEL_TOKEN           # Vercel API token
VERCEL_ORG_ID          # Vercel organization ID
VERCEL_PROJECT_ID      # Vercel project ID
SUPABASE_ACCESS_TOKEN  # Supabase CLI token
SUPABASE_DB_PASSWORD   # Database password

# Vercel Environment Variables
NEXT_PUBLIC_SUPABASE_URL     # Public Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Public anon key
SUPABASE_SERVICE_ROLE_KEY    # Server-only, never expose
```

### Environment Structure

```
.env.local          # Local development (gitignored)
.env.example        # Template for team
.env.production     # Vercel production (set via dashboard)
.env.preview        # Vercel preview (set via dashboard)
```

## Monitoring & Observability

### Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'local',
    checks: {} as Record<string, boolean>,
  };

  // Database check
  try {
    const supabase = await createClient();
    await supabase.from('_health').select('count').single();
    checks.checks.database = true;
  } catch {
    checks.checks.database = false;
    checks.status = 'degraded';
  }

  return NextResponse.json(checks, {
    status: checks.status === 'healthy' ? 200 : 503,
  });
}
```

### Logging Standards

```typescript
// lib/logger.ts
const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    }));
  },
  
  error: (message: string, error?: Error, meta?: object) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      ...meta,
    }));
  },
  
  warn: (message: string, meta?: object) => {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    }));
  },
};

export default logger;
```

## Incident Response

### Rollback Procedure

```bash
# 1. Identify last good deployment
vercel ls --prod

# 2. Rollback to specific deployment
vercel rollback [deployment-url]

# 3. Or redeploy from specific commit
git revert HEAD
git push origin main
```

### Debugging Production

```bash
# Real-time logs
vercel logs --prod -f

# Specific function logs
vercel logs --prod --filter="api/users"

# Supabase logs
supabase logs --project-ref [ref]
```

## Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| Manual deploys | Inconsistent, error-prone | CI/CD pipeline |
| Secrets in code | Security breach | Environment variables |
| No rollback plan | Extended outage | Documented procedure |
| Skip staging | Prod bugs | Preview deployments |
| No health checks | Silent failures | `/api/health` endpoint |

## References

- `references/ci-cd-templates.md` - Additional pipeline templates

## Handoff Criteria

Before declaring production-ready:
- [ ] CI/CD pipeline passing
- [ ] All secrets in vault (not code)
- [ ] Security headers configured
- [ ] Health check endpoint live
- [ ] Rollback procedure documented
- [ ] Monitoring/alerts configured
