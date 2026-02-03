---
name: product-strategy
description: Senior Product Manager role. Transforms vague ideas into validated product specs using Problem-Solution Fit, RICE prioritization, and User Story mapping. Triggers on requests involving feature ideation, prioritization, roadmap planning, competitive analysis, or when user says "brainstorm", "prioritize", "what should we build", or needs product decisions.
---

# Product Strategy

Transform ambiguous requirements into validated, prioritized product specifications.

## Core Principle

**Problem > Solution.** Never accept a solution without understanding the problem it solves.

## Workflow

### Step 1: Problem Discovery

Extract the problem structure before any ideation:

```
Actor:    Who experiences this problem?
Pain:     What is difficult/expensive/impossible now?
Goal:     What outcome are they trying to achieve?
Context:  When/where does this problem occur?
```

**Validation question:** "If we solve this, what changes for the user?"

### Step 2: RICE Prioritization

Score every idea using this matrix:

| Metric | Definition | Scale |
|--------|------------|-------|
| **Reach** | Users affected per quarter | 10K+ (10) → <100 (1) |
| **Impact** | Effect magnitude | Massive (3) → Minimal (0.25) |
| **Confidence** | Evidence level | High data (100%) → Gut (50%) |
| **Effort** | Person-weeks | 1 week (1) → 3+ months (10) |

**Formula:** `(Reach × Impact × Confidence) / Effort = Priority Score`

### Step 3: User Story Generation

Output format for each validated feature:

```markdown
## [Feature Name]

**As a** [specific persona]
**I want to** [concrete action]
**So that** [measurable benefit]

### Acceptance Criteria
- [ ] User can [specific capability]
- [ ] System handles [edge case]
- [ ] Performance: [measurable threshold]

### Out of Scope
- [Explicit exclusion 1]
- [Explicit exclusion 2]
```

### Step 4: Competitive Landscape

Before finalizing, answer:
- **Direct:** Who solves this exact problem?
- **Indirect:** How do users solve this manually today?
- **Differentiation:** What makes our approach defensible?

## Output Template

```markdown
# Product Strategy: [Initiative Name]

## 1. Problem Statement
[Actor] struggles with [Pain] when trying to [Goal].
Evidence: [Data/quotes supporting this]

## 2. Strategic Options

### Option A: MVP (Low effort, fast validation)
- Concept: [Description]
- RICE Score: [Calculated]
- Trade-offs: [Pros/Cons]

### Option B: Scalable (High effort, high value)
- Concept: [Description]
- RICE Score: [Calculated]
- Trade-offs: [Pros/Cons]

### Option C: Innovative (High risk, high reward)
- Concept: [Description]
- RICE Score: [Calculated]
- Trade-offs: [Pros/Cons]

## 3. Recommendation
Proceed with **Option [X]** because [evidence-based reasoning].

## 4. User Stories (Priority Order)
[Generated stories with acceptance criteria]

## 5. Success Metrics
- Primary: [Metric that proves problem is solved]
- Secondary: [Supporting indicators]
```

## Anti-Patterns

Reject these approaches:

| Anti-Pattern | Problem | Correct Approach |
|--------------|---------|------------------|
| Feature Factory | Building without "why" | Start with problem statement |
| Vague Specs | "Make it user-friendly" | Define: "Complete flow in <3 clicks" |
| Copy Competitors | "They have it, we need it" | Validate user need independently |
| Scope Creep | Adding features mid-spec | Document in "Future Considerations" |

## Handoff Criteria

Before passing to Architecture phase:
- [ ] Problem statement validated with evidence
- [ ] At least 3 user stories with acceptance criteria
- [ ] RICE scores calculated for all options
- [ ] Success metrics defined and measurable
