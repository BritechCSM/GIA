# Antigravity Skills System

## Architecture Overview

This is a professional-grade skill system following Silicon Valley engineering standards. Skills are organized by **Software Development Lifecycle (SDLC) phases** to enforce process discipline.

## Skill Execution Order (SDLC Phases)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SOFTWARE DEVELOPMENT LIFECYCLE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PHASE 1: DISCOVERY          PHASE 2: DESIGN           PHASE 3: BUILD      │
│  ┌──────────────────┐        ┌──────────────────┐      ┌──────────────────┐ │
│  │ 01-product-      │   →    │ 03-solutions-    │  →   │ 05-frontend-     │ │
│  │    strategy      │        │    architect     │      │    engineer      │ │
│  ├──────────────────┤        ├──────────────────┤      ├──────────────────┤ │
│  │ 02-brand-        │        │ 04-design-       │      │ 06-backend-      │ │
│  │    identity      │        │    systems       │      │    engineer      │ │
│  └──────────────────┘        └──────────────────┘      └──────────────────┘ │
│                                                                             │
│  PHASE 4: QUALITY            PHASE 5: DEPLOY           PHASE 6: DOCUMENT   │
│  ┌──────────────────┐        ┌──────────────────┐      ┌──────────────────┐ │
│  │ 07-quality-      │   →    │ 08-platform-     │  →   │ 09-technical-    │ │
│  │    assurance     │        │    engineering   │      │    writer        │ │
│  └──────────────────┘        └──────────────────┘      └──────────────────┘ │
│                                                                             │
│  PHASE 7: COMMUNICATE                                                       │
│  ┌──────────────────┐                                                       │
│  │ 10-strategy-     │                                                       │
│  │    consulting    │                                                       │
│  └──────────────────┘                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
antigravity-skills/
├── SYSTEM_ARCHITECTURE.md
├── 01-product-strategy/
│   ├── SKILL.md
│   └── references/
│       └── frameworks.md
├── 02-brand-identity/
│   ├── SKILL.md
│   └── references/
│       ├── voice-guide.md
│       └── visual-tokens.json
├── 03-solutions-architect/
│   ├── SKILL.md
│   └── references/
│       ├── database-patterns.md
│       └── security-checklist.md
├── 04-design-systems/
│   ├── SKILL.md
│   └── references/
│       ├── component-patterns.md
│       └── accessibility.md
├── 05-frontend-engineer/
│   ├── SKILL.md
│   └── references/
│       ├── react-patterns.md
│       └── css-patterns.md
├── 06-backend-engineer/
│   ├── SKILL.md
│   └── references/
│       └── api-patterns.md
├── 07-quality-assurance/
│   ├── SKILL.md
│   └── references/
│       └── testing-checklist.md
├── 08-platform-engineering/
│   ├── SKILL.md
│   └── references/
│       └── ci-cd-templates.md
├── 09-technical-writer/
│   ├── SKILL.md
│   └── references/
│       └── documentation-standards.md
└── 10-strategy-consulting/
    ├── SKILL.md
    └── references/
        └── presentation-frameworks.md
```

## Model Compatibility

Each skill is designed to work with:
- **Claude** (Anthropic) - Primary target
- **Gemini** (Google) - Full compatibility with guardrails

## Usage Protocol

1. **Identify Phase**: Determine current SDLC phase
2. **Activate Skill**: Load the corresponding skill
3. **Follow Process**: Execute skill workflow sequentially
4. **Handoff**: Pass artifacts to next phase skill

## Quality Gates

Each phase has mandatory quality gates before proceeding:

| Phase | Gate Requirement |
|-------|-----------------|
| Discovery → Design | Problem Statement + User Stories defined |
| Design → Build | Architecture Decision Record approved |
| Build → Quality | Feature complete, no blocking errors |
| Quality → Deploy | All tests passing, security audit clean |
| Deploy → Document | Production deployment verified |
