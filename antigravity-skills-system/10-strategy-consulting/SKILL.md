---
name: strategy-consulting
description: MBB-level Strategy Consultant role. Creates high-stakes presentations, executive summaries, and strategic narratives using the Pyramid Principle. Triggers when creating presentations, pitch decks, executive summaries, strategic reports, or when user mentions "presentation", "deck", "pitch", "slides", "executive summary", "strategy", "stakeholder", or needs to communicate to leadership/investors.
---

# Strategy Consulting

Craft compelling strategic narratives and presentations.

## Core Philosophy: BLUF

**Bottom Line Up Front.** Executives don't read mysteries. They want the answer first.

1. Start with the answer
2. Group supporting arguments
3. Support with data

## The SCQA Framework

Before writing any content, define:

| Element | Question | Example |
|---------|----------|---------|
| **Situation** | What is the status quo? | "We're growing at 10% YoY" |
| **Complication** | What changed? | "Competitor X took 5% market share" |
| **Question** | What must we solve? | "How do we regain dominance?" |
| **Answer** | The solution | "Launch Product Y in Q2" |

## Slide Design Rules

### The Squint Test

Every slide must pass: if you squint, can you get the message?

1. **Action Title:** Starts with verb, states the conclusion
2. **Visual Evidence:** Charts > bullets
3. **So What Box:** Clear takeaway

### Title Patterns

```markdown
❌ Bad (descriptive):
"Market Analysis"
"Q3 Results"
"Customer Feedback"

✅ Good (action):
"Market analysis reveals 20% opportunity in Southeast Asia"
"Q3 exceeded targets by 15% driven by enterprise sales"
"Customer feedback confirms pricing as primary barrier"
```

## Slide Templates

### Title Slide

```markdown
---
# [Project Name]: [Outcome Statement]
## [Audience] | [Date]

[Optional: Hero image or key metric]
---
```

### Executive Summary Slide

```markdown
---
# Recommendation: [Clear Action Statement]

**We recommend [action] to achieve [outcome].**

| Key Point | Evidence |
|-----------|----------|
| Why now | [Data point] |
| Expected gain | [Metric] |
| Required investment | [Cost/effort] |

**Next step:** [Specific action with owner and date]
---
```

### Data Slide

```markdown
---
# [Insight title with conclusion]

[Chart/graph that proves the title]

**Key takeaway:** [One sentence that reinforces the title]

Source: [Data source, date]
---
```

### Comparison Slide

```markdown
---
# [Option A] outperforms [Option B] on key metrics

| Metric | Option A | Option B | Δ |
|--------|----------|----------|---|
| Revenue | $10M | $7M | +43% |
| Cost | $2M | $3M | -33% |
| Timeline | 6 mo | 12 mo | -50% |

**Recommendation:** Proceed with Option A
---
```

### Risk Slide

```markdown
---
# Key risks are manageable with proposed mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [Risk 1] | Medium | High | [Strategy] |
| [Risk 2] | Low | Medium | [Strategy] |
| [Risk 3] | High | Low | [Strategy] |

**Overall assessment:** Acceptable risk profile
---
```

### Timeline/Roadmap Slide

```markdown
---
# Implementation roadmap: 12-week plan

| Phase | Timeline | Milestones |
|-------|----------|------------|
| Foundation | Weeks 1-4 | MVP, Core team |
| Build | Weeks 5-8 | Beta launch, First customers |
| Scale | Weeks 9-12 | GA, Revenue targets |

**Critical path:** [Key dependencies]
---
```

## Presentation Structure

### 10-Slide Pitch Deck

1. **Title** - Company, tagline, date
2. **Problem** - Pain point with evidence
3. **Solution** - Your answer
4. **Market** - TAM/SAM/SOM
5. **Product** - How it works
6. **Traction** - Evidence of success
7. **Business Model** - How you make money
8. **Competition** - Your advantage
9. **Team** - Why you'll win
10. **Ask** - What you need

### Strategic Recommendation

1. **Executive Summary** - BLUF recommendation
2. **Situation** - Current state
3. **Complication** - What changed
4. **Analysis** - Data and insights
5. **Options** - Alternatives considered
6. **Recommendation** - Preferred path
7. **Implementation** - How to execute
8. **Risks** - What could go wrong
9. **Next Steps** - Immediate actions

## Data Visualization

### Chart Selection

| Data Type | Best Chart |
|-----------|-----------|
| Trend over time | Line chart |
| Part of whole | Pie/donut (≤5 segments) |
| Comparison | Bar chart |
| Correlation | Scatter plot |
| Process | Flow diagram |
| Hierarchy | Tree/org chart |

### Chart Principles

1. **One message per chart**
2. **Title states the insight**
3. **Highlight the key data point**
4. **Remove chartjunk (gridlines, 3D, etc.)**
5. **Source your data**

## Writing Style

### Executive Summary Formula

```
[Recommendation] because [3 reasons].

Specifically:
1. [Reason 1] - [Evidence]
2. [Reason 2] - [Evidence]  
3. [Reason 3] - [Evidence]

This will result in [outcome] by [timeline].
```

### Bullet Point Rules

- Maximum 3-5 bullets per slide
- Each bullet: one complete thought
- Parallel structure (all verbs or all nouns)
- No sub-bullets (flatten or split slide)

## Marp Template

```yaml
---
marp: true
theme: default
paginate: true
backgroundColor: #ffffff
style: |
  h1 { color: #1e293b; font-family: 'Inter', sans-serif; }
  p, li { color: #475569; font-family: 'Inter', sans-serif; }
  section { padding: 40px 60px; }
  table { font-size: 0.9em; }
---

# Slide 1: Title
## Subtitle

---

# Slide 2: Action Title Here

Content goes here.

---
```

## Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| "Outline" titles | "Introduction", "Body" | Action titles |
| Wall of bullets | Unreadable | Max 5 bullets |
| No data | Unpersuasive | Add evidence |
| Buried lead | Key point missed | BLUF structure |
| Fancy transitions | Distracting | Content is king |

## Handoff Criteria

Presentation is ready when:
- [ ] SCQA framework defined
- [ ] Every slide has action title
- [ ] Data visualizations support claims
- [ ] Executive summary is standalone
- [ ] Timing rehearsed (1-2 min/slide)
- [ ] Backup slides for questions

## References

- `references/presentation-frameworks.md` - Additional frameworks
