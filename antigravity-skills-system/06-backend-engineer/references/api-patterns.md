# API Patterns Reference

## RESTful Design

### Resource Naming

```
GET    /api/users          # List users
POST   /api/users          # Create user
GET    /api/users/:id      # Get user
PUT    /api/users/:id      # Replace user
PATCH  /api/users/:id      # Update user fields
DELETE /api/users/:id      # Delete user

# Nested resources
GET    /api/users/:id/posts        # User's posts
POST   /api/users/:id/posts        # Create post for user

# Actions (when REST doesn't fit)
POST   /api/users/:id/activate     # Custom action
POST   /api/posts/:id/publish      # Custom action
```

### Query Parameters

```typescript
// Pagination
?page=1&pageSize=20

// Filtering
?status=active&role=admin

// Sorting
?sort=created_at&order=desc

// Field selection
?fields=id,name,email

// Search
?q=search+term

// Include relations
?include=posts,comments
```

### HTTP Status Codes

| Code | When to Use |
|------|-------------|
| 200 | Success (GET, PUT, PATCH) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Bad Request (validation failed) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 422 | Unprocessable Entity |
| 429 | Rate Limited |
| 500 | Server Error |

## Rate Limiting

### Implementation

```typescript
// lib/rateLimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

// Create rate limiters
export const rateLimiters = {
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1m'),
    analytics: true,
  }),
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15m'),
  }),
};

// Usage in API route
export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success, limit, reset, remaining } = await rateLimiters.auth.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  }
  
  // Continue with request...
}
```

## Caching Strategies

### Response Caching

```typescript
// Static data (rarely changes)
export async function GET() {
  const data = await fetchStaticData();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

// User-specific data (no caching)
export async function GET() {
  const data = await fetchUserData();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'private, no-cache',
    },
  });
}
```

### Revalidation

```typescript
// Next.js ISR
export const revalidate = 60; // Revalidate every 60 seconds

// On-demand revalidation
import { revalidatePath, revalidateTag } from 'next/cache';

// In server action
revalidatePath('/products');
revalidateTag('products');
```

## File Upload Pattern

```typescript
// app/api/upload/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  // Validation
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  // Generate safe filename
  const ext = file.name.split('.').pop();
  const filename = `${user.id}/${Date.now()}.${ext}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filename, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(data.path);

  return NextResponse.json({ 
    success: true, 
    url: publicUrl,
    path: data.path,
  });
}
```

## Webhook Handling

```typescript
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  // Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
```

## Batch Operations

```typescript
// Batch create
export async function POST(request: NextRequest) {
  const { items } = await request.json();
  
  // Validate all items first
  const validated = items.map(item => ItemSchema.parse(item));
  
  // Batch insert
  const { data, error } = await supabase
    .from('items')
    .insert(validated)
    .select();

  if (error) throw error;
  
  return NextResponse.json({ success: true, data, count: data.length });
}

// Batch update with upsert
const { data } = await supabase
  .from('items')
  .upsert(items, { 
    onConflict: 'id',
    ignoreDuplicates: false,
  })
  .select();
```

## Long-Running Operations

```typescript
// Start async job
export async function POST(request: NextRequest) {
  const { data } = await request.json();
  
  // Create job record
  const { data: job } = await supabase
    .from('jobs')
    .insert({ 
      type: 'export',
      status: 'pending',
      payload: data,
    })
    .select()
    .single();

  // Trigger background processing (Edge Function, queue, etc.)
  await fetch(`${process.env.JOBS_URL}/process`, {
    method: 'POST',
    body: JSON.stringify({ jobId: job.id }),
  });

  return NextResponse.json({ 
    success: true, 
    jobId: job.id,
    statusUrl: `/api/jobs/${job.id}`,
  });
}

// Poll for status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', params.id)
    .single();

  return NextResponse.json({
    status: job.status,
    progress: job.progress,
    result: job.result,
  });
}
```
