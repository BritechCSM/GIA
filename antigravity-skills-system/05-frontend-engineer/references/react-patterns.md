# React Production Patterns

Common React issues and production-ready patterns.

## State Management Anti-Patterns

### Unnecessary Re-renders

```tsx
// ❌ Bad: Inline object creation causes re-render
function Parent() {
  return <Child style={{ margin: 10 }} />;
}

// ✅ Good: Memoize objects
const CHILD_STYLE = { margin: 10 };
function Parent() {
  return <Child style={CHILD_STYLE} />;
}

// ✅ Better: Use useMemo for computed values
function Parent() {
  const style = useMemo(() => ({ margin: 10 }), []);
  return <Child style={style} />;
}
```

### Missing Dependencies in Hooks

```tsx
// ❌ Bad: Missing dependencies
useEffect(() => {
  fetchData(userId);
}, []); // userId missing

// ✅ Good: Include all dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]);

// ✅ Alternative: If intentionally running once
useEffect(() => {
  const initialUserId = userId;
  fetchData(initialUserId);
}, []); // Clear intention
```

### Stale Closures

```tsx
// ❌ Bad: Stale count in interval
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // Always uses initial count
    }, 1000);
    return () => clearInterval(id);
  }, []); // Missing count dependency
}

// ✅ Good: Use functional update
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // Uses current count
    }, 1000);
    return () => clearInterval(id);
  }, []); // No dependencies needed
}
```

## Error Handling Patterns

### Error Boundaries

```tsx
// Error boundary component
class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-state">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<ErrorView />}>
  <UserDashboard />
</ErrorBoundary>
```

### Async Error Handling

```tsx
// ❌ Bad: Unhandled promise rejection
function DataComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(setData); // No error handling
  }, []);
}

// ✅ Good: Comprehensive error handling
function DataComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let cancelled = false;
    
    fetchData()
      .then(result => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err);
          console.error('Data fetch failed:', err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    
    return () => { cancelled = true; };
  }, []);
  
  if (loading) return <Skeleton />;
  if (error) return <ErrorState error={error} retry={() => {}} />;
  return <DataView data={data} />;
}
```

## Loading States

### Skeleton Screens

```tsx
// ✅ Good: Skeleton that matches content layout
function UserListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function UserList() {
  const { data, loading } = useUsers();
  
  if (loading) return <UserListSkeleton />;
  return data.map(user => <UserCard key={user.id} user={user} />);
}
```

### Optimistic Updates

```tsx
// ✅ Good: Optimistic update with rollback
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  
  const toggleTodo = async (id: string) => {
    const previous = todos;
    
    // Optimistic update
    setTodos(todos.map(t => 
      t.id === id ? { ...t, done: !t.done } : t
    ));
    
    try {
      await updateTodo(id);
    } catch (error) {
      // Rollback on error
      setTodos(previous);
      toast.error('Failed to update todo');
    }
  };
}
```

## Performance Optimization

### Memoization

```tsx
// ❌ Bad: Expensive recalculation on every render
function DataGrid({ data, filters }) {
  const filteredData = data.filter(item => 
    filters.every(f => f(item))
  ); // Runs on every render
  
  return <Grid data={filteredData} />;
}

// ✅ Good: Memoize expensive computations
function DataGrid({ data, filters }) {
  const filteredData = useMemo(
    () => data.filter(item => filters.every(f => f(item))),
    [data, filters]
  );
  
  return <Grid data={filteredData} />;
}
```

### Component Memoization

```tsx
// ❌ Bad: Child re-renders on parent state change
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <ExpensiveChild data={staticData} /> {/* Re-renders unnecessarily */}
    </>
  );
}

// ✅ Good: Memoize child component
const ExpensiveChild = memo(({ data }) => {
  // Complex rendering logic
  return <div>{/* ... */}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <ExpensiveChild data={staticData} /> {/* Only renders when data changes */}
    </>
  );
}
```

### Virtual Lists

```tsx
// ✅ Good: Virtualized long lists
import { FixedSizeList } from 'react-window';

function VirtualUserList({ users }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <UserCard user={users[index]} />
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={users.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

## Form Handling

### Controlled vs Uncontrolled

```tsx
// ✅ Good: Controlled form with validation
function LoginForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.includes('@')) {
      setError('Invalid email');
      return;
    }
    
    try {
      await login(email);
    } catch (err) {
      setError('Login failed');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        aria-invalid={!!error}
        aria-describedby="email-error"
      />
      {error && <span id="email-error" role="alert">{error}</span>}
      <button type="submit">Login</button>
    </form>
  );
}
```

## Cleanup Patterns

### Cleanup Effects

```tsx
// ✅ Good: Proper cleanup
function WebSocketComponent() {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const ws = new WebSocket('ws://...');
    
    ws.onmessage = (e) => {
      setMessages(m => [...m, e.data]);
    };
    
    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);
}

function TimerComponent() {
  useEffect(() => {
    const id = setInterval(() => {
      console.log('tick');
    }, 1000);
    
    // Cleanup interval
    return () => clearInterval(id);
  }, []);
}
```

### Abort Controllers

```tsx
// ✅ Good: Cancel fetch on unmount
function DataFetcher({ id }) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    fetch(`/api/data/${id}`, { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Fetch failed:', err);
        }
      });
    
    return () => controller.abort();
  }, [id]);
}
```

## Type Safety Patterns

```tsx
// ✅ Good: Type-safe props
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

function Button({ onClick, disabled, variant = 'primary', children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}

// ✅ Good: Discriminated unions for variant props
type AlertProps = 
  | { type: 'success'; message: string }
  | { type: 'error'; message: string; retry: () => void }
  | { type: 'warning'; message: string; action?: () => void };

function Alert(props: AlertProps) {
  return (
    <div className={`alert alert-${props.type}`}>
      {props.message}
      {props.type === 'error' && (
        <button onClick={props.retry}>Retry</button>
      )}
    </div>
  );
}
```

## Accessibility Patterns

```tsx
// ✅ Good: Accessible modal
function Modal({ isOpen, onClose, title, children }) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Trap focus inside modal
  useEffect(() => {
    if (!isOpen) return;
    
    const previousActive = document.activeElement as HTMLElement;
    contentRef.current?.focus();
    
    return () => {
      previousActive?.focus();
    };
  }, [isOpen]);
  
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={contentRef}
        className="modal-content"
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
        <button onClick={onClose} aria-label="Close modal">×</button>
      </div>
    </div>
  );
}
```
