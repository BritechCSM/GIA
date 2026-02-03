---
name: technical-writer
description: Senior Technical Writer role. Creates clear, maintainable documentation including API docs, READMEs, guides, and internal documentation. Triggers when writing documentation, creating READMEs, documenting APIs, explaining code, or when user mentions "document", "README", "docs", "explain", "how to", "guide", or needs technical writing.
---

# Technical Writer

Create clear, accurate, and maintainable technical documentation.

## Core Principles

1. **Accuracy First:** Documentation that lies is worse than none.
2. **User-Centric:** Write for the reader's context, not your knowledge.
3. **Maintainable:** Docs that aren't updated become dangerous.
4. **Scannable:** Headers, lists, and code blocks for quick navigation.

## Document Types

### README.md Template

```markdown
# Project Name

One-line description of what this does.

## Quick Start

\`\`\`bash
# Install
npm install

# Run development server
npm run dev

# Open http://localhost:3000
\`\`\`

## Features

- ✅ Feature one
- ✅ Feature two
- ✅ Feature three

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 |
| Database | Supabase |
| Styling | Tailwind CSS |
| Auth | Supabase Auth |

## Project Structure

\`\`\`
src/
├── app/           # Routes and pages
├── components/    # React components
├── lib/           # Utilities and configs
└── types/         # TypeScript types
\`\`\`

## Environment Variables

Copy \`.env.example\` to \`.env.local\`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

| Variable | Description | Required |
|----------|-------------|----------|
| \`NEXT_PUBLIC_SUPABASE_URL\` | Supabase project URL | Yes |
| \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` | Supabase anon key | Yes |

## Development

\`\`\`bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
\`\`\`

## Deployment

Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Contributing

1. Fork the repo
2. Create feature branch (\`git checkout -b feature/amazing\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push branch (\`git push origin feature/amazing\`)
5. Open Pull Request

## License

MIT © [Author]
```

### API Documentation Template

```markdown
# API Reference

Base URL: \`https://api.example.com/v1\`

## Authentication

All requests require Bearer token:

\`\`\`
Authorization: Bearer <token>
\`\`\`

---

## Users

### List Users

\`\`\`
GET /users
\`\`\`

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| \`page\` | integer | 1 | Page number |
| \`pageSize\` | integer | 20 | Items per page (max 100) |
| \`search\` | string | - | Search by name or email |

**Response:**

\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
\`\`\`

### Create User

\`\`\`
POST /users
\`\`\`

**Request Body:**

\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
\`\`\`

**Response:** \`201 Created\`

\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

### Error Responses

| Code | Description |
|------|-------------|
| 400 | Invalid request body |
| 401 | Missing or invalid auth |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Server error |

**Error Format:**

\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [...]
  }
}
\`\`\`
```

### How-To Guide Template

```markdown
# How to [Accomplish Task]

This guide shows you how to [task] in [context].

## Prerequisites

Before you begin:
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

## Steps

### Step 1: [First Action]

Brief explanation of what this step accomplishes.

\`\`\`bash
# Command to run
example-command --flag
\`\`\`

**Expected output:**

\`\`\`
Success message or output
\`\`\`

### Step 2: [Second Action]

Explanation of the next step.

\`\`\`typescript
// Code example
const result = doSomething();
\`\`\`

> 💡 **Tip:** Helpful hint for this step.

### Step 3: [Third Action]

Final step explanation.

## Verification

To verify everything works:

1. Check that [condition 1]
2. Confirm [condition 2]
3. Test [functionality]

## Troubleshooting

### Error: [Common Error Message]

**Cause:** Why this happens.

**Solution:** How to fix it.

\`\`\`bash
# Fix command
\`\`\`

### Error: [Another Error]

**Cause:** Explanation.

**Solution:** Resolution steps.

## Next Steps

- [Related guide 1]
- [Related guide 2]
- [Advanced topic]
```

## Writing Standards

### Code Examples

Always provide:
- Complete, runnable examples
- Expected output
- Error handling where relevant

```typescript
// ✅ Good: Complete example
import { createUser } from '@/actions/users';

async function example() {
  const result = await createUser({
    name: 'John',
    email: 'john@example.com',
  });
  
  if (result.success) {
    console.log('Created:', result.data.id);
  } else {
    console.error('Failed:', result.error);
  }
}

// ❌ Bad: Incomplete, no context
createUser({ name: 'John' });
```

### Tables for Structured Data

| Use Tables For | Don't Use Tables For |
|----------------|---------------------|
| Parameter lists | Long prose |
| Comparisons | Single items |
| Status/options | Nested data |
| Quick reference | Detailed explanations |

### Callouts

```markdown
> 💡 **Tip:** Helpful suggestion

> ⚠️ **Warning:** Something to be careful about

> ❌ **Danger:** Could break things

> 📝 **Note:** Additional context
```

## Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| Wall of text | Unreadable | Use headers, lists, code blocks |
| Outdated examples | Broken code | Test examples regularly |
| Jargon overload | Excludes beginners | Define terms or link glossary |
| Missing prereqs | Frustration | List requirements upfront |
| No error docs | Users stuck | Document common errors |

## Documentation Checklist

Before publishing:

- [ ] **Accurate:** All code examples tested
- [ ] **Complete:** No missing steps
- [ ] **Structured:** Clear headings and flow
- [ ] **Scannable:** Lists and tables where appropriate
- [ ] **Linked:** Related docs connected
- [ ] **Versioned:** Matches current codebase

## References

- `references/documentation-standards.md` - Style guide details

## Handoff Criteria

Documentation is complete when:
- [ ] README covers setup and structure
- [ ] API endpoints documented
- [ ] Error codes and messages listed
- [ ] Common workflows have guides
- [ ] Examples are tested and working
