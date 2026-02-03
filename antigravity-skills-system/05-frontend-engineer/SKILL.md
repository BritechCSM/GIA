---
name: frontend-engineer
description: Senior Frontend Engineer role. Builds production-ready React/TypeScript applications with proper state management, error handling, and performance optimization. Triggers when implementing UI, writing React components, debugging frontend issues, or when user mentions "implement", "build", "code", "React", "component", "frontend", "client-side", or needs working application code.
---

# Frontend Engineer

Build production-ready, performant, and maintainable frontend applications.

## Core Stack

```
Framework:    React 18+ (Functional Components, Hooks)
Language:     TypeScript (Strict mode)
Styling:      Tailwind CSS
State:        React Query (server) + Zustand/Context (client)
Forms:        React Hook Form + Zod
Icons:        Lucide React
```

## Component Architecture

### File Structure

```
src/
├── components/
│   ├── ui/              # Reusable primitives (Button, Input, Card)
│   └── features/        # Feature-specific components
├── hooks/               # Custom hooks
├── lib/                 # Utilities and configurations
├── types/               # TypeScript type definitions
└── app/ or pages/       # Routes
```

### Component Template

```tsx
// components/features/UserCard.tsx
import { memo } from 'react';
import type { User } from '@/types';

interface UserCardProps {
  user: User;
  onSelect?: (user: User) => void;
}

export const UserCard = memo(function UserCard({ 
  user, 
  onSelect 
}: UserCardProps) {
  return (
    <button
      onClick={() => onSelect?.(user)}
      className="
        w-full text-left
        bg-white border border-gray-100 rounded-xl p-4
        hover:shadow-md hover:border-gray-200
        transition-all duration-200
      "
    >
      <div className="flex items-center gap-3">
        <img 
          src={user.avatar} 
          alt=""
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-medium text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
    </button>
  );
});
```

## State Management Patterns

### Server State (React Query)

```tsx
// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { User, CreateUserInput } from '@/types';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get<User[]>('/users'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => api.post<User>('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

### Client State (Zustand)

```tsx
// stores/uiStore.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  modalOpen: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  modalOpen: null,
  openModal: (id) => set({ modalOpen: id }),
  closeModal: () => set({ modalOpen: null }),
}));
```

## Error Handling

### Error Boundary

```tsx
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error caught:', error, info);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Something went wrong
          </h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### Async Error Pattern

```tsx
// Always handle loading, error, and success states
function UserList() {
  const { data, isLoading, error, refetch } = useUsers();

  if (isLoading) {
    return <UserListSkeleton />;
  }

  if (error) {
    return (
      <ErrorState 
        message="Failed to load users"
        onRetry={refetch}
      />
    );
  }

  if (!data?.length) {
    return <EmptyState message="No users yet" />;
  }

  return (
    <div className="space-y-3">
      {data.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

## Form Handling

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name too short').max(100),
});

type FormData = z.infer<typeof schema>;

function CreateUserForm({ onSuccess }: { onSuccess: () => void }) {
  const { mutate, isPending } = useCreateUser();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Name"
        error={errors.name?.message}
        {...register('name')}
      />
      <Button type="submit" loading={isPending}>
        Create User
      </Button>
    </form>
  );
}
```

## Performance Patterns

### Memoization

```tsx
// Memoize expensive computations
const filteredItems = useMemo(
  () => items.filter(item => item.status === filter),
  [items, filter]
);

// Memoize callbacks passed to children
const handleSelect = useCallback(
  (item: Item) => setSelected(item.id),
  []
);

// Memoize components that receive objects/arrays
const ExpensiveList = memo(function ExpensiveList({ items }: Props) {
  return items.map(item => <Item key={item.id} {...item} />);
});
```

### Code Splitting

```tsx
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
```

## Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| `any` type | Loses type safety | Define proper interfaces |
| Prop drilling | Maintenance nightmare | Use Context or Zustand |
| useEffect for derived state | Extra renders | Use useMemo instead |
| Index as key | Breaks reconciliation | Use stable unique IDs |
| Inline objects in JSX | Re-renders children | Extract or memoize |

## References

For detailed patterns, see:
- `references/react-patterns.md` - Advanced React patterns
- `references/css-patterns.md` - Layout and styling fixes

## Handoff Criteria

Before passing to QA:
- [ ] TypeScript compiles with no errors
- [ ] All components have proper types
- [ ] Loading/error/empty states handled
- [ ] Forms validated with Zod
- [ ] No console errors in dev
- [ ] Mobile responsive verified
