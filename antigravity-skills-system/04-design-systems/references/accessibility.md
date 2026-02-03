# Accessibility Reference

## WCAG 2.1 Quick Reference

### Level A (Minimum)

| Criterion | Requirement | Implementation |
|-----------|-------------|----------------|
| 1.1.1 Non-text Content | Alt text for images | `<img alt="Description">` |
| 1.3.1 Info and Relationships | Semantic HTML | Use `<nav>`, `<main>`, `<article>` |
| 1.4.1 Use of Color | Don't rely on color alone | Add icons or text labels |
| 2.1.1 Keyboard | All functionality via keyboard | Tab order, Enter/Space activation |
| 2.4.1 Bypass Blocks | Skip navigation link | `<a href="#main">Skip to content</a>` |

### Level AA (Target Standard)

| Criterion | Requirement | Implementation |
|-----------|-------------|----------------|
| 1.4.3 Contrast (Minimum) | 4.5:1 for text | Check with contrast tools |
| 1.4.4 Resize Text | 200% zoom without loss | Use relative units (rem) |
| 2.4.6 Headings and Labels | Descriptive headings | Clear, hierarchical h1-h6 |
| 2.4.7 Focus Visible | Visible focus indicator | Never `outline: none` without alternative |
| 3.2.3 Consistent Navigation | Same order across pages | Fixed nav structure |

## Focus Management

### Focus Indicators

```css
/* Never remove focus outlines without replacement */
/* ❌ Bad */
button:focus {
  outline: none;
}

/* ✅ Good */
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}

/* ✅ Better - with focus-visible */
button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}
```

### Focus Trapping (Modals)

```tsx
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0] as HTMLElement;
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return <div ref={modalRef}>{children}</div>;
}
```

## ARIA Patterns

### Live Regions

```tsx
// Announce dynamic content changes
<div role="status" aria-live="polite">
  {isLoading ? 'Loading...' : `${count} items found`}
</div>

// Urgent announcements
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

### Accessible Labels

```tsx
// Icon-only buttons
<button aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>

// Complex labels
<button aria-labelledby="btn-label btn-count">
  <span id="btn-label">Messages</span>
  <span id="btn-count">(5 unread)</span>
</button>

// Described by helper text
<input 
  aria-describedby="password-requirements"
  type="password"
/>
<p id="password-requirements">
  Must be at least 12 characters
</p>
```

### Expandable Content

```tsx
<button
  aria-expanded={isOpen}
  aria-controls="panel-content"
>
  Section Title
</button>
<div 
  id="panel-content"
  hidden={!isOpen}
>
  {content}
</div>
```

### Tabs

```tsx
<div role="tablist" aria-label="Account settings">
  <button
    role="tab"
    id="tab-profile"
    aria-selected={activeTab === 'profile'}
    aria-controls="panel-profile"
    tabIndex={activeTab === 'profile' ? 0 : -1}
  >
    Profile
  </button>
  <button
    role="tab"
    id="tab-security"
    aria-selected={activeTab === 'security'}
    aria-controls="panel-security"
    tabIndex={activeTab === 'security' ? 0 : -1}
  >
    Security
  </button>
</div>

<div
  role="tabpanel"
  id="panel-profile"
  aria-labelledby="tab-profile"
  hidden={activeTab !== 'profile'}
>
  {profileContent}
</div>
```

## Color Contrast

### Minimum Ratios

| Text Size | Normal Text | Bold Text |
|-----------|-------------|-----------|
| < 18px | 4.5:1 | 4.5:1 |
| 18px+ | 3:1 | 3:1 |
| 14px bold | 3:1 | 3:1 |

### Safe Color Combinations

```css
/* ✅ High contrast pairs */
--text-on-white: #1f2937;     /* gray-800, 12.6:1 */
--text-on-dark: #f9fafb;      /* gray-50, 15.2:1 */
--text-muted: #6b7280;        /* gray-500, 4.6:1 on white */

/* ⚠️ Check these carefully */
--text-disabled: #9ca3af;     /* gray-400, 3:1 - use for non-essential only */
```

### Testing Tools

1. **Browser DevTools**: Inspect → Accessibility panel
2. **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
3. **axe DevTools**: Browser extension for automated testing

## Touch Targets

### Minimum Sizes

```css
/* Mobile touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* With adequate spacing */
.button-group > * + * {
  margin-left: 8px; /* Prevents adjacent target overlap */
}
```

### Implementation

```tsx
// Small icon button with adequate touch area
<button className="
  p-3           /* 12px padding */
  min-h-[44px]  /* Ensures 44px minimum */
  min-w-[44px]
">
  <Icon className="w-5 h-5" /> {/* 20px icon */}
</button>
```

## Screen Reader Testing

### Quick Tests

1. **Tab through page**: Is order logical?
2. **Read headings (H key)**: Is hierarchy clear?
3. **Read links (K key)**: Are link texts descriptive?
4. **Check images**: Do decorative images have empty alt?

### Common Screen Readers

| Platform | Screen Reader | Shortcut |
|----------|---------------|----------|
| macOS | VoiceOver | Cmd + F5 |
| Windows | NVDA | Free download |
| Windows | Narrator | Win + Ctrl + Enter |
| iOS | VoiceOver | Settings → Accessibility |
| Android | TalkBack | Settings → Accessibility |

## Checklist

### Per Component

- [ ] Keyboard accessible (Tab, Enter, Space, Escape)
- [ ] Focus indicator visible
- [ ] Sufficient color contrast
- [ ] Touch target ≥ 44px
- [ ] ARIA labels where needed
- [ ] Works with screen reader

### Per Page

- [ ] Skip link present
- [ ] Heading hierarchy (h1 → h6)
- [ ] Main landmark identified
- [ ] Page title descriptive
- [ ] Language attribute set
- [ ] No keyboard traps
