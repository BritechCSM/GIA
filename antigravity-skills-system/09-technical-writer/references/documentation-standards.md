# Documentation Standards Reference

## Style Guide

### Voice and Tone

**Use:**
- Second person ("you")
- Active voice
- Present tense
- Direct instructions

**Avoid:**
- First person ("we", "I")
- Passive voice
- Future tense
- Vague language

```markdown
❌ "The file will be created by the system when we run the command."
✅ "Run the command to create the file."

❌ "Users can configure settings by..."
✅ "Configure settings by..."
```

### Sentence Structure

- **Lead with the goal:** "To create a user, call the `createUser` function."
- **One action per step:** Don't combine multiple actions.
- **Short sentences:** Maximum 25 words per sentence.

### Capitalization

| Element | Style | Example |
|---------|-------|---------|
| Headings | Sentence case | "Getting started" |
| UI elements | Match UI exactly | "Click **Save**" |
| Code | Exact match | "`createUser()`" |
| Products | Title case | "Next.js", "Supabase" |

### Punctuation

- **Lists:** No periods for short items, periods for full sentences
- **Code blocks:** No punctuation after inline code
- **Headings:** No periods

```markdown
✅ Short list:
- Item one
- Item two
- Item three

✅ Sentence list:
- This is a complete sentence.
- This is another complete sentence.

❌ Mixed:
- Short item.
- Another sentence
```

## File Structure

### Documentation Directory

```
docs/
├── index.md              # Documentation home
├── getting-started/
│   ├── installation.md
│   ├── quick-start.md
│   └── configuration.md
├── guides/
│   ├── authentication.md
│   ├── database.md
│   └── deployment.md
├── api/
│   ├── overview.md
│   ├── users.md
│   └── posts.md
├── reference/
│   ├── configuration.md
│   ├── environment.md
│   └── cli.md
└── troubleshooting/
    ├── common-errors.md
    └── faq.md
```

### Page Structure

```markdown
# Page Title

Brief description (1-2 sentences).

## Overview (optional)

Context if needed before steps.

## Prerequisites (if applicable)

What's needed before starting.

## Main Content

Organized by logical sections.

### Subsection 1

Content...

### Subsection 2

Content...

## Related

- [Link to related page](./related.md)
- [Another related page](./another.md)
```

## Code Documentation

### Inline Comments

```typescript
// ✅ Explain WHY, not WHAT
// Retry 3 times because the service occasionally returns 503 during deployments
const result = await retry(fetchData, 3);

// ❌ Obvious comment
// Set the name variable to "John"
const name = "John";
```

### JSDoc Standards

```typescript
/**
 * Creates a new user in the database.
 * 
 * @param data - User creation data
 * @param data.email - Valid email address
 * @param data.name - Display name (2-100 characters)
 * @returns The created user object with generated ID
 * @throws {ValidationError} If email is invalid
 * @throws {ConflictError} If email already exists
 * 
 * @example
 * ```ts
 * const user = await createUser({
 *   email: 'john@example.com',
 *   name: 'John Doe',
 * });
 * console.log(user.id); // "usr_abc123"
 * ```
 */
export async function createUser(data: CreateUserInput): Promise<User> {
  // Implementation
}
```

### README Badges

```markdown
![Build Status](https://github.com/user/repo/actions/workflows/ci.yml/badge.svg)
![Coverage](https://codecov.io/gh/user/repo/branch/main/graph/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/npm/v/package.svg)
```

## API Documentation

### Endpoint Template

```markdown
## Endpoint Name

Brief description of what this endpoint does.

### Request

\`\`\`
METHOD /path/:param
\`\`\`

#### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer token |
| `Content-Type` | Yes | `application/json` |

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `param` | string | Description |

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |

#### Request Body

\`\`\`json
{
  "field": "value"
}
\`\`\`

### Response

#### Success (200)

\`\`\`json
{
  "data": {}
}
\`\`\`

#### Errors

| Code | Condition |
|------|-----------|
| 400 | Invalid input |
| 401 | Unauthorized |

### Example

\`\`\`bash
curl -X POST https://api.example.com/users \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}'
\`\`\`
```

## Changelog

### Format (Keep a Changelog)

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- New feature description

### Changed
- Change description

### Fixed
- Bug fix description

## [1.0.0] - 2024-01-15

### Added
- Initial release
- Feature A
- Feature B

### Security
- Security improvement

[Unreleased]: https://github.com/user/repo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/user/repo/releases/tag/v1.0.0
```

## Versioning Documentation

### When to Update

| Code Change | Doc Action |
|-------------|------------|
| New feature | Add documentation |
| API change | Update + changelog |
| Bug fix | Update if behavior changed |
| Deprecation | Add warning, update examples |
| Removal | Remove docs, add migration guide |

### Deprecation Notice

```markdown
> ⚠️ **Deprecated:** `oldFunction()` is deprecated and will be removed in v2.0.
> Use `newFunction()` instead.
> 
> **Migration:**
> ```diff
> - oldFunction(data);
> + newFunction({ data, newOption: true });
> ```
```

## Review Checklist

Before merging documentation:

- [ ] Spell check passed
- [ ] Links verified (no 404s)
- [ ] Code examples tested
- [ ] Screenshots current
- [ ] No placeholder text
- [ ] Consistent formatting
- [ ] Proper heading hierarchy
- [ ] Mobile-friendly (if web)
