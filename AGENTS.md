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

# Type checking
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
- Group imports by source: React → external libraries → local files
- Keep import statements organized and consistent

### TypeScript & Naming
- **Strict mode** enabled in tsconfig.json
- **Components**: PascalCase (`UserProfile.tsx`)
- **Functions/Variables**: camelCase (`fetchUserData()`)
- **Constants**: UPPER_CASE (`MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (`UserProfile`)
- **Files**: kebab-case (`user-profile.tsx`)
- Export types for reusability
- Use descriptive interface names and JSDoc comments
- Use Zod schemas for form validation

### Styling & Components
- Tailwind CSS 4 for styling with custom animations
- Follow Shadcn UI patterns with Radix primitives
- Use `cn()` utility for conditional classes
- Use `buttonVariants()` for variant styles
- Accessibility-first approach with ARIA attributes
- Keep components concise and focused

### Error Handling & State
- Use `ErrorHandlerAPI` from `src/utils/ErrorHandler.ts` for API calls
- Provide user-friendly error messages with toast notifications
- Use Zustand stores in `src/stores/` for state management
- JWT tokens in HTTP-only cookies with automatic refresh
- Protected routes using middleware patterns

## Architecture Overview

### Project Structure
```
src/
├── app/              # Next.js App Router pages
├── components/      # Reusable components (chat/, dashboard/, post/, ui/)
├── stores/          # Zustand state management
├── types/           # TypeScript definitions
├── utils/           # Utility functions and API config
├── lib/             # Shared libraries (validation, utils)
└── hooks/           # Custom React hooks
```

### Key Technologies
- Next.js 16 with App Router and Turbopack
- React 19 with TypeScript 5.9 (strict mode)
- Tailwind CSS 4 + Radix UI for styling
- Zustand 5 for state, React Hook Form + Zod for validation
- Tiptap for rich text, Socket.io for real-time chat
- Axios for API calls with dual endpoints

## Common Development Patterns

### Adding API Endpoints
```typescript
// src/utils/fetch.ts
export async function newEndpoint(data: any) {
  try {
    const response = await axiosInstance.post('/endpoint', data);
    return response.data;
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}
```

### Creating Forms
```typescript
// 1. Add validation to src/lib/validation.ts
export const newFormSchema = z.object({ ... });

// 2. Use with React Hook Form
const form = useForm<NewFormData>({
  resolver: zodResolver(newFormSchema),
  defaultValues: { ... }
});
```

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

export function Button({ className, variant, size, asChild, ...props }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}
```

## Best Practices

### Security
- JWT tokens stored in HTTP-only cookies
- Automatic logout on authentication errors (401)
- Input validation with Zod schemas
- XSS protection with Content Security Policy

### Performance
- Turbopack for faster development builds
- Image optimization with remote patterns
- Component-level performance monitoring
- Lazy loading and skeleton components

### Environment Variables
Configured in `src/utils/getConfig.ts`:
- `NEXT_PUBLIC_API_URL` - Main API base URL
- `NEXT_PUBLIC_API_URL_2` - Secondary API base URL
- `NEXT_PUBLIC_DASH_URL` - Dashboard base URL
- `NEXT_PUBLIC_WS_URL` - WebSocket base URL
- `NEXT_PUBLIC_STORAGE_URL` - Storage base URL

### Development Guidelines
- Follow existing patterns and conventions
- Keep components small with single responsibilities
- Use TypeScript interfaces for props and state
- Document complex logic with clear comments
- Maintain consistent code style throughout

## Cursor/Copilot Rules
- No specific Cursor or Copilot rule files found
- Follow existing patterns in codebase
- Use AI assistance for code generation while maintaining project standards