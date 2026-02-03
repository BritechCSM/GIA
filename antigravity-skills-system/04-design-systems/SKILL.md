---
name: design-systems
description: Creative Director and Design Systems Lead role. Creates premium, accessible UI components using systematic design tokens. Triggers when designing components, creating UI, styling interfaces, fixing visual bugs, or when user mentions "design", "component", "UI", "styling", "looks bad", "make it pretty", "glassmorphism", "dark mode", or needs visual polish.
---

# Design Systems

Create premium, systematic, and accessible user interfaces.

## Core Principles

1. **System First:** No magic values. Every dimension from the token scale.
2. **Premium Aesthetics:** Depth, texture, and subtle animation everywhere.
3. **Accessibility Law:** Contrast, touch targets, and screen readers are non-negotiable.

## Component Anatomy

Every component has four layers:

```
┌─────────────────────────────────────────┐
│  Layer 4: ACCESSIBILITY (The Law)       │
│  ├─ Contrast ratios                     │
│  ├─ Touch targets ≥44px                 │
│  └─ ARIA labels                         │
├─────────────────────────────────────────┤
│  Layer 3: INTERACTION (The Soul)        │
│  ├─ Hover states                        │
│  ├─ Active/pressed states               │
│  └─ Focus indicators                    │
├─────────────────────────────────────────┤
│  Layer 2: DEPTH & TEXTURE (The Skin)    │
│  ├─ Shadows                             │
│  ├─ Borders                             │
│  └─ Background treatments               │
├─────────────────────────────────────────┤
│  Layer 1: STRUCTURE (The Skeleton)      │
│  ├─ Layout (flex/grid)                  │
│  ├─ Spacing (token scale)               │
│  └─ Typography hierarchy                │
└─────────────────────────────────────────┘
```

## Token Mandate

**Never use arbitrary values.** Map everything to the system:

| Property | ❌ Avoid | ✅ Use |
|----------|----------|--------|
| Spacing | `padding: 11px` | `p-3` (12px) |
| Color | `color: #666` | `text-gray-500` |
| Font | `font-size: 17px` | `text-lg` (18px) |
| Radius | `border-radius: 7px` | `rounded-lg` (8px) |
| Shadow | `box-shadow: 2px 2px 2px` | `shadow-lg` |

## Premium Patterns

### Glass Card

```tsx
<div className="
  relative overflow-hidden
  bg-white/70 backdrop-blur-xl
  border border-white/20
  shadow-xl shadow-black/5
  rounded-2xl p-6
">
  {/* Content */}
</div>
```

### Elevated Button

```tsx
<button className="
  bg-gradient-to-b from-blue-500 to-blue-600
  text-white font-semibold
  px-6 py-3 rounded-xl
  shadow-lg shadow-blue-500/25
  hover:shadow-xl hover:shadow-blue-500/30
  hover:-translate-y-0.5
  active:translate-y-0 active:shadow-md
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2
">
  {children}
</button>
```

### Subtle Card

```tsx
<div className="
  bg-white
  border border-gray-100
  shadow-sm hover:shadow-md
  rounded-xl p-5
  transition-shadow duration-200
">
  {/* Content */}
</div>
```

### Entry Animation

```tsx
<div className="
  animate-in fade-in slide-in-from-bottom-4
  duration-500 ease-out
  fill-mode-both
">
  {/* Animated content */}
</div>
```

## Interaction Standards

### Hover States

Every interactive element must respond:

```tsx
// Subtle lift
className="hover:-translate-y-0.5 transition-transform"

// Background change
className="hover:bg-gray-50 transition-colors"

// Shadow intensify
className="hover:shadow-lg transition-shadow"
```

### Focus States

Accessible and beautiful:

```tsx
// Ring style (preferred)
className="focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"

// Border style
className="focus:outline-none focus:border-blue-500"
```

### Active/Pressed States

Physical feedback:

```tsx
// Scale down
className="active:scale-95 transition-transform"

// Push in
className="active:translate-y-0.5"
```

## Accessibility Requirements

### Color Contrast

| Element | Minimum Ratio | Check With |
|---------|---------------|------------|
| Body text | 4.5:1 | WebAIM Contrast Checker |
| Large text (>18px bold) | 3:1 | |
| UI components | 3:1 | |
| Focus indicators | 3:1 | |

### Touch Targets

```tsx
// Minimum 44x44px clickable area
<button className="min-h-[44px] min-w-[44px] p-3">
  <Icon className="w-5 h-5" />
</button>
```

### Screen Readers

```tsx
// Icon-only buttons need labels
<button aria-label="Close dialog">
  <XIcon />
</button>

// Decorative images
<img src="..." alt="" aria-hidden="true" />

// Live regions for updates
<div role="status" aria-live="polite">
  {statusMessage}
</div>
```

## Layout Debugging

When visual bugs occur:

```tsx
// Step 1: Red border to see dimensions
className="border-2 border-red-500"

// Step 2: Check for overflow
className="overflow-hidden" // or overflow-auto

// Step 3: Verify parent constraints
// Parent needs explicit height for flex-1 to work
className="h-screen flex flex-col"

// Step 4: Use gap instead of margin
className="flex gap-4" // not "space-x-4" for complex layouts
```

## Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| Flat colors | Looks cheap, no depth | Add gradients or shadows |
| Instant transitions | Jarring, robotic | Add `transition-all duration-200` |
| Tiny click areas | Frustrating, inaccessible | Min 44px touch target |
| Missing focus styles | Keyboard users lost | Add ring or border focus |
| `z-index: 9999` | Z-index wars | Use semantic scale (modal: 500) |

## References

For detailed patterns, see:
- `references/component-patterns.md` - Full component library
- `references/accessibility.md` - WCAG compliance guide

## Handoff Criteria

Before passing to Frontend Engineering:
- [ ] All components use token scale (no magic numbers)
- [ ] Hover/focus/active states defined
- [ ] Touch targets verified (≥44px)
- [ ] Color contrast checked
- [ ] Animation timing defined
