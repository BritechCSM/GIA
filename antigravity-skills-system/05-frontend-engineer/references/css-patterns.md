# CSS Layout Patterns & Anti-Patterns

Reference for common CSS layout issues and their solutions.

## Flexbox Layout Issues

### Footer Floating to Middle of Screen

**Problem**: Footer doesn't stick to bottom when content is short

```css
/* ❌ Bad */
.container {
  display: flex;
  flex-direction: column;
}
```

**Solution**: Use min-h-screen and flex-1 properly
```css
/* ✅ Good */
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* or min-h-screen in Tailwind */
}

.main-content {
  flex: 1; /* or flex-1 in Tailwind */
}

.footer {
  flex-shrink: 0; /* or shrink-0 in Tailwind */
}
```

### Content Overflow in Scrollable Containers

**Problem**: Content grows beyond parent causing page scroll instead of container scroll

```tsx
/* ❌ Bad */
<div className="flex flex-col h-full">
  <div className="space-y-4">
    {/* Content here can grow infinitely */}
  </div>
</div>
```

**Solution**: Add overflow control and height constraints
```tsx
/* ✅ Good */
<div className="flex flex-col h-full overflow-hidden">
  <div className="flex-1 overflow-y-auto">
    {/* Content scrolls within container */}
  </div>
</div>
```

### Nested Flex Containers Losing Height

**Problem**: Child flex container collapses when parent doesn't define height

```tsx
/* ❌ Bad */
<div className="flex flex-col"> {/* No height */}
  <div className="flex-1"> {/* Can't grow - parent has no height */}
    <Content />
  </div>
</div>
```

**Solution**: Define height at top level
```tsx
/* ✅ Good */
<div className="flex flex-col h-screen">
  <div className="flex-1 min-h-0"> {/* min-h-0 allows shrinking */}
    <Content />
  </div>
</div>
```

## Grid Layout Issues

### Grid Items Overflowing

**Problem**: Grid items with long content break grid structure

```css
/* ❌ Bad */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
```

**Solution**: Add minmax to prevent overflow
```css
/* ✅ Good */
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
```

## Position Issues

### Fixed Elements Covering Content

**Problem**: Fixed navbar/footer overlays content without spacing

```css
/* ❌ Bad */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
}
.content {
  /* No top padding */
}
```

**Solution**: Add padding equal to fixed element height
```css
/* ✅ Good */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 64px;
}
.content {
  padding-top: 64px;
}
```

## Overflow Issues

### Horizontal Scroll on Mobile

**Problem**: Content wider than viewport causes horizontal scroll

Common culprits:
- Fixed width elements wider than mobile viewport
- Negative margins without container constraints
- 100vw causing scroll due to scrollbar width
- Viewport units on child of scrollable parent

```css
/* ❌ Bad */
.container {
  width: 100vw; /* Causes scroll if vertical scrollbar present */
}

.card {
  width: 400px; /* Too wide for mobile */
}
```

**Solution**: Use 100% width or max-width with container queries
```css
/* ✅ Good */
.container {
  width: 100%;
  max-width: 100vw; /* Safety net */
  overflow-x: hidden;
}

.card {
  width: 100%;
  max-width: 400px;
}
```

### Text Overflow Handling

```css
/* Single line truncation */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Multi-line truncation (WebKit) */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## Mobile-Specific Patterns

### iOS Safari 100vh Issue

**Problem**: 100vh includes browser chrome, causing content cutoff

```css
/* ❌ Bad */
.fullscreen {
  height: 100vh;
}
```

**Solution**: Use dvh (dynamic viewport height) or JS fallback
```css
/* ✅ Good (Modern browsers) */
.fullscreen {
  height: 100dvh; /* Dynamic viewport height */
}

/* Fallback */
.fullscreen {
  height: 100vh;
  height: 100dvh;
}
```

### Touch Target Sizing

```css
/* iOS/Android minimum touch target */
.button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

/* Small icon buttons need padding */
.icon-button {
  padding: 12px; /* Even if icon is 20px */
}
```

### Prevent iOS Text Zoom

```css
/* Prevent iOS from zooming on focus */
input, select, textarea {
  font-size: 16px; /* Minimum to prevent zoom */
}
```

## Animation Performance

### GPU Acceleration

```css
/* ❌ Bad: Triggers layout recalculation */
.animated {
  transition: height 0.3s, width 0.3s;
}

/* ✅ Good: GPU-accelerated properties */
.animated {
  transition: transform 0.3s, opacity 0.3s;
  will-change: transform; /* Hint to browser */
}
```

### Reducing Layout Thrashing

```jsx
// ❌ Bad: Multiple style reads/writes
elements.forEach(el => {
  const height = el.offsetHeight; // Read
  el.style.height = height + 10 + 'px'; // Write
});

// ✅ Good: Batch reads, then writes
const heights = elements.map(el => el.offsetHeight);
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px';
});
```

## Z-Index Management

Create a z-index scale to prevent stacking conflicts:

```css
:root {
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-tooltip: 700;
  --z-notification: 800;
}
```

## Common Tailwind Mistakes

```tsx
// ❌ Bad: Missing overflow control
<div className="h-full">
  <div className="space-y-4">
    {/* Grows indefinitely */}
  </div>
</div>

// ✅ Good: Proper overflow management
<div className="h-full flex flex-col overflow-hidden">
  <div className="flex-1 overflow-y-auto space-y-4">
    {/* Scrolls within container */}
  </div>
</div>

// ❌ Bad: Absolute positioning without relative parent
<div>
  <button className="absolute top-4 right-4">X</button>
</div>

// ✅ Good: Relative parent context
<div className="relative">
  <button className="absolute top-4 right-4">X</button>
</div>
```
