# Product Frameworks Reference

## RICE Scoring Examples

### High Priority Example
```
Feature: One-click checkout
Reach: 80% of users (8)
Impact: Massive - 40% conversion lift (3)
Confidence: 90% - A/B test data (0.9)
Effort: 2 weeks (2)

Score: (8 × 3 × 0.9) / 2 = 10.8 ← High priority
```

### Low Priority Example
```
Feature: Dark mode
Reach: 15% request it (1.5)
Impact: Minimal - aesthetic only (0.5)
Confidence: 60% - survey data (0.6)
Effort: 1 week (1)

Score: (1.5 × 0.5 × 0.6) / 1 = 0.45 ← Low priority
```

## Jobs-to-be-Done Framework

Template for deeper problem understanding:

```
When [situation/trigger],
I want to [motivation/goal],
So I can [expected outcome].
```

**Example:**
```
When I'm rushing to leave for work,
I want to quickly see my day's schedule,
So I can mentally prepare and not miss meetings.
```

## Kano Model Categories

| Category | User Reaction | Strategy |
|----------|---------------|----------|
| **Must-Have** | Angry if missing, neutral if present | Implement first, no negotiation |
| **Performance** | More is better, linear satisfaction | Optimize based on resources |
| **Delighters** | Neutral if missing, delighted if present | Add after basics are solid |

## MoSCoW Prioritization

| Priority | Definition | Commitment |
|----------|------------|------------|
| **Must** | Non-negotiable for launch | 100% delivery |
| **Should** | Important but not critical | 90% delivery |
| **Could** | Nice to have | Best effort |
| **Won't** | Explicitly out of scope | Document for future |

## Opportunity Scoring

```
Opportunity Score = Importance + (Importance - Satisfaction)
```

| Score Range | Interpretation |
|-------------|----------------|
| > 15 | Critical opportunity |
| 10-15 | Strong opportunity |
| 5-10 | Moderate opportunity |
| < 5 | Low priority |
