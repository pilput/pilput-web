# AGENTS.md - Development Guidelines for Next.js Turbo Blog Platform

## Build/Lint/Test Commands

### Development Commands
```bash
# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Run linter
bun run lint

# Type checking (run after lint)
bunx tsc --noEmit

# Install dependencies
bun install
```

### Testing
- No explicit testing framework configured
- Use `next lint` for code quality checks
- TypeScript strict mode provides type safety
- Manual testing through development workflow

## Code Style Guidelines

### Imports & Organization
- Use path aliases: `@/components/` instead of relative paths
- Group imports by source in this order: React → external libraries → internal packages → local files
- Keep import statements organized and consistent
- Example import order:
```typescript
import * as React from "react"
import { useState, useEffect } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/userStore"
import type { Auth } from "@/types/you"
```

### TypeScript & Naming
- **Strict mode** enabled in tsconfig.json
- **Components**: PascalCase (`UserProfile.tsx`)
- **Functions/Variables**: camelCase (`fetchUserData()`, `isLoading`)
- **Constants**: UPPER_CASE (`MAX_RETRIES`) for true constants, camelCase for store state
- **Types/Interfaces**: PascalCase (`UserProfile`, `AuthState`)
- **Files**: kebab-case (`user-profile.tsx`)
- Export types for reusability: `export type PostFormData = z.infer<typeof postSchema>`
- Use Zod schemas for form validation in `src/lib/validation.ts`
- Use descriptive interface names with JSDoc comments for complex types

### Styling & Components
- Tailwind CSS 4 for styling with custom animations
- Follow Shadcn UI patterns with Radix primitives
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Use `buttonVariants()` for variant styles
- Accessibility-first approach with ARIA attributes
- Keep components concise and focused (under 100 lines preferred)
- Components receive `className` prop for custom styling

### Button Component Pattern (Shadcn UI)
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function Button({ className, variant, size, asChild, ...props }) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}

export { Button, buttonVariants }
```

## Error Handling & State

### API Error Handling
- Use `ErrorHandlerAPI` from `src/utils/ErrorHandler.ts` for API calls
- It handles network errors, 401 auth errors (with auto-logout), and status-specific messages
- Toast notifications are shown automatically
- Always return `error.response` for further handling if needed

### State Management
- Use Zustand stores in `src/stores/` for global state
- Store naming convention: `*Store.ts` (e.g., `userStore.ts`, `postsStore.ts`)
- Export store as named export: `export const authStore = create<authDataState>()(...)`
- JWT tokens stored in HTTP-only cookies with automatic refresh via middleware

### Form Validation Pattern
```typescript
// 1. Add validation schema to src/lib/validation.ts
export const loginSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

// 2. Use with React Hook Form
const form = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: { identifier: "", password: "" }
});
```

## Architecture Overview

### Project Structure
```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable components (chat/, dashboard/, post/, ui/)
│   └── ui/          # Shadcn UI components
├── stores/          # Zustand state management (*Store.ts files)
├── types/           # TypeScript definitions
├── utils/           # Utility functions (ErrorHandler.ts, fetch.ts, Auth.ts)
├── lib/             # Shared libraries (validation.ts, utils.ts)
└── hooks/           # Custom React hooks
```

### Key Technologies
- Next.js 16 with App Router and Turbopack
- React 19 with TypeScript 5.9 (strict mode)
- Tailwind CSS 4 + Radix UI for styling
- Zustand 5 for state, React Hook Form + Zod for validation
- Tiptap for rich text editing
- Native `fetch` via clients in `src/utils/fetch.ts` (`apiClient`, `apiClientSecondary`, `apiClientApp`)
- Sonner for toast notifications
- HTTP streaming for real-time chat

## Common Development Patterns

### Adding API Endpoints
```typescript
// src/utils/fetch.ts or appropriate fetch file
export async function newEndpoint(data: any) {
  try {
    const response = await apiClient.post('/endpoint', data);
    return response.data;
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}
```

### Zustand Store Pattern
```typescript
import { create } from "zustand";
import { apiClientApp } from "@/utils/fetch";
import type { Auth } from "@/types/you";

interface AuthState {
  data: Auth;
  fetch: () => void;
  error: boolean;
}

export const authStore = create<AuthState>()((set) => ({
  data: { username: "loading...", email: "Loading...", image: "placeholder/spinner.gif", ... },
  fetch: async () => {
    try {
      const { data } = await apiClientApp.get("/v1/users/me");
      set({ data: data.data, error: false });
    } catch (error) {
      set({ error: true });
    }
  },
  error: false,
}));
```

### Utility Functions
- `cn()` - Merge Tailwind classes: `cn("text-red-500", isActive && "bg-primary")`
- `formatCurrency()` - Format numbers as currency with locale support
- `formatNumber()` - Format numbers with thousand separators
- `formatThousandsForInput()` - Format input while typing
- `parseThousandsFromInput()` - Parse formatted input back to raw number

## Best Practices

### Security
- JWT tokens stored in HTTP-only cookies (never localStorage)
- Automatic logout and redirect on 401 authentication errors
- Input validation with Zod schemas on all forms
- Use `getToken()` and `RemoveToken()` from `@/utils/Auth`

### Performance
- Turbopack for faster development builds
- Image optimization with remote patterns configured in next.config.ts
- Lazy loading and skeleton components for heavy components
- Use `React.Suspense` for async components

### Environment Variables
Configured in `src/utils/getConfig.ts`:
- `NEXT_PUBLIC_API_URL` - Main API base URL
- `NEXT_PUBLIC_API_URL_2` - Secondary API base URL
- `NEXT_PUBLIC_DASH_URL` - Dashboard base URL
- `NEXT_PUBLIC_STORAGE_URL` - Storage base URL

### Development Guidelines
- Follow existing patterns and conventions in codebase
- Keep components small with single responsibilities
- Use TypeScript interfaces for props and state
- Maintain consistent code style throughout
- Run `bunx tsc --noEmit` before committing to catch type errors

## Cursor/Copilot Rules
- No specific Cursor or Copilot rule files found
- Follow existing patterns in codebase
- Use AI assistance for code generation while maintaining project standards
