---
name: backend-engineer
description: Senior Backend Engineer role. Builds secure, scalable server-side logic with proper validation, error handling, and database operations. Triggers when implementing APIs, server actions, database queries, authentication flows, or when user mentions "API", "endpoint", "backend", "server", "database query", "Supabase", "Edge Function", or needs server-side code.
---

# Backend Engineer

Build secure, performant, and maintainable server-side applications.

## Core Stack

```
Runtime:      Node.js / Edge Runtime
Framework:    Next.js API Routes / Server Actions
Database:     Supabase (PostgreSQL)
Validation:   Zod
Auth:         Supabase Auth
```

## API Design Principles

1. **Validate Everything:** All inputs through Zod schemas
2. **Fail Fast:** Return early on errors
3. **Typed Responses:** Consistent response envelope
4. **Audit Trail:** Log security-sensitive operations

## Response Envelope

```typescript
// types/api.ts

interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Helpers
export const success = <T>(data: T, meta?: SuccessResponse<T>['meta']): SuccessResponse<T> => 
  ({ success: true, data, meta });

export const error = (code: string, message: string, details?: unknown): ErrorResponse => 
  ({ success: false, error: { code, message, details } });
```

## Server Action Pattern

```typescript
// actions/users.ts
'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// 1. Schema
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.enum(['user', 'admin']).default('user'),
});

// 2. Result type
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// 3. Implementation
export async function createUser(
  input: z.infer<typeof CreateUserSchema>
): Promise<ActionResult<{ id: string }>> {
  // Validate
  const parsed = CreateUserSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  // Auth check
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  // Database operation
  const { data, error: dbError } = await supabase
    .from('users')
    .insert({
      ...parsed.data,
      created_by: user.id,
    })
    .select('id')
    .single();

  if (dbError) {
    console.error('DB Error:', dbError);
    return { success: false, error: 'Failed to create user' };
  }

  revalidatePath('/users');
  return { success: true, data: { id: data.id } };
}
```

## API Route Pattern

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const query = QuerySchema.parse(params);

    const supabase = await createClient();
    
    let dbQuery = supabase
      .from('users')
      .select('*', { count: 'exact' })
      .range(
        (query.page - 1) * query.pageSize,
        query.page * query.pageSize - 1
      )
      .order('created_at', { ascending: false });

    if (query.search) {
      dbQuery = dbQuery.ilike('name', `%${query.search}%`);
    }

    const { data, error, count } = await dbQuery;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      meta: { total: count ?? 0, page: query.page, pageSize: query.pageSize },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', details: err.issues } },
        { status: 400 }
      );
    }
    console.error('API Error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } },
      { status: 500 }
    );
  }
}
```

## Database Patterns

### Joins and Relations

```typescript
// Single join
const { data } = await supabase
  .from('posts')
  .select(`
    id, title,
    author:users(id, name, avatar)
  `);

// Nested joins
const { data } = await supabase
  .from('posts')
  .select(`
    id, title,
    comments(
      id, content,
      author:users(name)
    )
  `);
```

### Transactions via RPC

```typescript
// Call database function
const { error } = await supabase.rpc('transfer_funds', {
  from_account_id: fromId,
  to_account_id: toId,
  amount: 100.00,
});
```

## Middleware Pattern

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/settings', '/api/protected'];
const AUTH_ROUTES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Redirect unauthenticated users from protected routes
  if (!user && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users from auth routes
  if (user && AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

## Error Handling Hierarchy

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: unknown) {
    super('VALIDATION_ERROR', message, 400);
  }
}

export class AuthError extends AppError {
  constructor(message = 'Unauthorized') {
    super('UNAUTHORIZED', message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} not found`, 404);
  }
}

// Usage in API
try {
  // operation
} catch (err) {
  if (err instanceof AppError) {
    return NextResponse.json(
      { success: false, error: { code: err.code, message: err.message } },
      { status: err.statusCode }
    );
  }
  throw err; // Re-throw unexpected errors
}
```

## Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| Raw SQL strings | SQL injection | Use parameterized queries |
| No input validation | Security vulnerability | Zod on every endpoint |
| Catching all errors | Hides bugs | Specific error handling |
| Console.log in prod | No observability | Structured logging |
| N+1 queries | Performance | Use joins or batch |

## References

- `references/api-patterns.md` - Advanced API patterns

## Handoff Criteria

Before passing to QA:
- [ ] All endpoints have Zod validation
- [ ] Error responses follow envelope
- [ ] RLS policies tested
- [ ] No sensitive data in logs
- [ ] Rate limiting configured
