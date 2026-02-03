---
name: brand-identity
description: Brand Voice Lead role. Ensures consistent tone, terminology, and communication style across all outputs (UI microcopy, marketing, documentation). Triggers when writing user-facing text, creating copy, defining tone of voice, or when user mentions "brand", "voice", "tone", "copy", "messaging", or needs text that represents a specific identity.
---

# Brand Identity

Maintain consistent voice and visual identity across all touchpoints.

## Core Identity Model

Define the brand through these dimensions:

```
Voice Attributes:  [3 adjectives that describe how we sound]
Personality:       [If the brand were a person, who?]
Values:            [What we stand for]
Anti-Values:       [What we explicitly reject]
```

## Writing Modes

### Mode 1: UX Microcopy (Interface Text)

**Goal:** Unblock the user with minimal friction.

**Principles:**
- Maximum 8 words per message
- Active voice, present tense
- State outcome, not process

**Patterns:**

| Context | ❌ Avoid | ✅ Use |
|---------|----------|--------|
| Success | "Operation completed successfully" | "Saved" |
| Error | "Invalid input provided" | "Check your email format" |
| Loading | "Please wait while we process" | "Loading..." |
| Empty | "No items to display" | "No results yet" |
| Action | "Click here to submit" | "Submit" |

### Mode 2: Marketing Copy (Conversion Text)

**Goal:** Convert through clarity and benefit.

**Structure:** Hook → Problem → Solution → CTA

**Patterns:**

| Element | Formula | Example |
|---------|---------|---------|
| Headline | [Outcome] without [Pain] | "Ship faster without the bugs" |
| Subhead | In [Time], with [Method] | "In minutes, with one command" |
| CTA | [Action] + [Benefit] | "Start free → Get 14 days" |

**Banned words:** revolutionary, disruptive, synergy, leverage, utilize, ecosystem, holistic, cutting-edge, game-changing, best-in-class

### Mode 3: Technical Documentation

**Goal:** Enable self-service success.

**Structure:** Objective → Prerequisites → Steps → Result

**Principles:**
- One action per step
- Code examples > descriptions
- Include expected output

## Quality Checklist

Before delivering any text:

1. **Jargon Audit:** Remove corporate buzzwords
2. **Passive Hunt:** Convert "was uploaded" → "you uploaded"
3. **Length Check:** No paragraph > 3 lines
4. **Read Aloud:** Does it sound human?
5. **Brand Fit:** Would [Brand Personality] say this?

## Formatting Standards

### Typography Hierarchy

```
Title:     Bold, largest, single line
Subtitle:  Medium weight, supporting context
Body:      Regular, readable line length (50-75 chars)
Caption:   Smaller, secondary information
```

### Visual Rhythm

- Paragraphs: 2-3 sentences maximum
- Lists: Use for 3+ related items
- White space: Generous, never cramped
- Bold: For scannability, not emphasis

## Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| Wall of Text | Unreadable, overwhelming | Break into chunks |
| Apologist | "We're sorry to inform..." | State facts directly |
| Generic | "Welcome to our platform" | "Welcome to [Name]" |
| Robot | "Your request has been processed" | "Done! Here's your [thing]" |
| Salesy | "Amazing opportunity!!!" | State value plainly |

## Resource Loading

If project includes brand resources, load them:
- `references/voice-guide.md` - Detailed tone examples
- `references/visual-tokens.json` - Colors, spacing, typography

## Handoff Criteria

Before passing to Design phase:
- [ ] Voice attributes defined (3 words)
- [ ] Writing samples for each mode
- [ ] Banned words list documented
- [ ] Terminology glossary if needed
