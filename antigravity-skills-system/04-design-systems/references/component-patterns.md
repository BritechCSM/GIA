# Component Patterns Reference

## Buttons

### Primary Button

```tsx
const Button = ({ children, size = 'md', loading = false }) => (
  <button
    className={`
      inline-flex items-center justify-center gap-2
      bg-gradient-to-b from-blue-500 to-blue-600
      text-white font-semibold
      rounded-xl
      shadow-lg shadow-blue-500/25
      hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5
      active:translate-y-0 active:shadow-md
      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
      transition-all duration-200
      ${size === 'sm' ? 'px-4 py-2 text-sm' : ''}
      ${size === 'md' ? 'px-6 py-3 text-base' : ''}
      ${size === 'lg' ? 'px-8 py-4 text-lg' : ''}
    `}
    disabled={loading}
  >
    {loading && <Spinner className="w-4 h-4 animate-spin" />}
    {children}
  </button>
);
```

### Secondary Button

```tsx
const SecondaryButton = ({ children }) => (
  <button className="
    inline-flex items-center justify-center gap-2
    bg-white
    text-gray-700 font-medium
    border border-gray-200
    rounded-xl px-6 py-3
    shadow-sm
    hover:bg-gray-50 hover:border-gray-300
    active:bg-gray-100
    focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:ring-offset-2
    transition-all duration-200
  ">
    {children}
  </button>
);
```

### Ghost Button

```tsx
const GhostButton = ({ children }) => (
  <button className="
    inline-flex items-center justify-center gap-2
    text-gray-600 font-medium
    rounded-xl px-6 py-3
    hover:bg-gray-100 hover:text-gray-900
    active:bg-gray-200
    focus:outline-none focus:ring-2 focus:ring-gray-500/20
    transition-all duration-200
  ">
    {children}
  </button>
);
```

## Cards

### Standard Card

```tsx
const Card = ({ children, hover = true }) => (
  <div className={`
    bg-white
    border border-gray-100
    rounded-2xl p-6
    shadow-sm
    ${hover ? 'hover:shadow-md hover:border-gray-200 transition-all duration-200' : ''}
  `}>
    {children}
  </div>
);
```

### Glass Card

```tsx
const GlassCard = ({ children }) => (
  <div className="
    relative overflow-hidden
    bg-white/60 backdrop-blur-xl
    border border-white/30
    rounded-2xl p-6
    shadow-xl shadow-black/5
  ">
    {children}
  </div>
);
```

### Interactive Card

```tsx
const InteractiveCard = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="
      w-full text-left
      bg-white
      border border-gray-100
      rounded-2xl p-6
      shadow-sm
      hover:shadow-lg hover:border-gray-200 hover:-translate-y-1
      active:translate-y-0 active:shadow-md
      focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2
      transition-all duration-200
    "
  >
    {children}
  </button>
);
```

## Inputs

### Text Input

```tsx
const Input = ({ label, error, ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    <input
      className={`
        w-full px-4 py-3
        bg-white
        border rounded-xl
        text-gray-900 placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-offset-2
        transition-all duration-200
        ${error 
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
          : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
        }
      `}
      {...props}
    />
    {error && (
      <p className="text-sm text-red-600">{error}</p>
    )}
  </div>
);
```

### Select

```tsx
const Select = ({ label, options, ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    <select
      className="
        w-full px-4 py-3
        bg-white
        border border-gray-200 rounded-xl
        text-gray-900
        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2
        transition-all duration-200
        appearance-none
        bg-[url('data:image/svg+xml;...')] bg-no-repeat bg-[right_1rem_center]
      "
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);
```

## Badges

```tsx
const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <span className={`
      inline-flex items-center
      px-2.5 py-1
      text-xs font-medium
      rounded-full
      border
      ${variants[variant]}
    `}>
      {children}
    </span>
  );
};
```

## Modals

```tsx
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="
        relative
        w-full max-w-lg
        bg-white
        rounded-2xl
        shadow-2xl
        animate-in fade-in zoom-in-95 duration-200
      ">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
```

## Loading States

### Skeleton

```tsx
const Skeleton = ({ className }) => (
  <div className={`
    bg-gray-200 
    rounded-lg 
    animate-pulse
    ${className}
  `} />
);

// Usage
<div className="space-y-3">
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
  <Skeleton className="h-4 w-5/6" />
</div>
```

### Spinner

```tsx
const Spinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <svg
      className={`animate-spin text-current ${sizes[size]}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
};
```

## Empty States

```tsx
const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="
    flex flex-col items-center justify-center
    py-16 px-6
    text-center
  ">
    <div className="
      w-16 h-16
      flex items-center justify-center
      bg-gray-100
      rounded-full
      mb-4
    ">
      <Icon className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      {title}
    </h3>
    <p className="text-gray-500 mb-6 max-w-sm">
      {description}
    </p>
    {action}
  </div>
);
```
