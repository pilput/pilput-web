# AGENTS.md - Development Guidelines for Next.js Turbo Blog Platform

## Build/Lint/Test Commands

### Development Commands
```bash
# Start development server with Turbopack (fast builds)
next dev --turbopack

# Build for production with Turbopack
next build --turbopack

# Start production server
next start

# Run linter
next lint

# Install dependencies
npm install

# Run type checking
npx tsc --noEmit
```

### Testing
- No explicit testing framework configured
- Use `next lint` for code quality checks
- TypeScript strict mode provides type safety
- Manual testing through development workflow

## Code Style Guidelines

### Imports
- Use path aliases: `@/components/` instead of relative paths
- Group imports by source (React, external libraries, local files)
- Keep import statements organized and consistent

### Formatting
- Use Tailwind CSS for styling with custom animations
- Follow Shadcn UI patterns with Radix primitives
- Use `cn()` utility for conditional classes
- Use `buttonVariants()` for variant styles
- Keep component files concise and focused

### TypeScript
- Strict mode enabled in tsconfig.json
- Use descriptive interface names
- Export types for reusability
- Include JSDoc comments for complex types
- Use Zod schemas for form validation

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Functions**: camelCase (e.g., `fetchUserData()`)
- **Variables**: camelCase (e.g., `userData`)
- **Constants**: UPPER_CASE (e.g., `MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (e.g., `UserProfile`)
- **Files**: kebab-case (e.g., `user-profile.tsx`)

### Error Handling
- Use `ErrorHandlerAPI` from `src/utils/ErrorHandler.ts` for API calls
- Handle specific error cases appropriately
- Provide user-friendly error messages
- Log errors for debugging
- Use toast notifications for user feedback

### State Management (Zustand)
- Use Zustand stores in `src/stores/`
- Import and subscribe to state as needed
- Keep state minimal and focused
- Use middleware for complex state logic

### Component Patterns
- Follow Shadcn UI Style with Radix primitives
- Clear separation of UI and logic
- Accessibility-first approach
- Use custom hooks for reusable logic
- Place shared functions in `src/utils/`

## Architecture Overview

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/            # Reusable components
│   ├── chat/             # Real-time chat components
│   ├── dashboard/        # Analytics and management
│   ├── landing/          # Marketing/homepage
│   ├── post/             # Blog post components
│   ├── ui/               # Base UI components (Shadcn UI style)
│   └── header/           # Navigation components
├── stores/               # Zustand state management
├── types/                # TypeScript definitions
├── utils/                # Utility functions and API config
├── lib/                  # Shared libraries (validation, utils)
└── hooks/                # Custom React hooks
```

### Key Technologies
- Next.js 16 with App Router and Turbopack
- React 19 with React DOM
- TypeScript 5.9 with strict typing
- Tailwind CSS 4 for styling
- Radix UI for accessible components
- Zustand 5 for state management
- Tiptap for rich text editing
- Socket.io Client for real-time chat
- React Hook Form + Zod for validation
- Axios for API calls

### Environment Variables
Configured in `src/utils/getConfig.ts`:
- `NEXT_PUBLIC_API_URL` - Main API base URL
- `NEXT_PUBLIC_API_URL_2` - Secondary API base URL
- `NEXT_PUBLIC_DASH_URL` - Dashboard base URL
- `NEXT_PUBLIC_WS_URL` - WebSocket base URL
- `NEXT_PUBLIC_STORAGE_URL` - Storage base URL
- `NEXT_PUBLIC_MAIN_URL` - Main application URL
- `NEXT_PUBLIC_DOMAIN` - Main domain

## Development Best Practices

### Form Validation
- Use Zod schemas in `src/lib/validation.ts`
- Export TypeScript types for all validation schemas
- Include custom error messages
- Client-side validation with React Hook Form

### API Configuration
- Dual API endpoints in `src/utils/fetch.ts`
- Authentication with JWT tokens in HTTP-only cookies
- Automatic token refresh on 401 errors
- Global error handling with user-friendly messages

### Security
- JWT tokens stored in HTTP-only cookies
- Automatic logout on authentication errors
- Protected routes using middleware patterns
- Input validation with Zod schemas
- CSRF protection through SameSite cookies
- XSS protection with Content Security Policy

### Performance
- Turbopack for faster development builds
- Image optimization with remote patterns
- Component-level performance monitoring
- Lazy loading and skeleton components
- Optimized animations with throttling

### Accessibility
- Comprehensive ARIA attributes
- Keyboard navigation support
- Semantic HTML structure
- Screen reader friendly labels
- High contrast and responsive design

## Common Development Tasks

### Adding New API Endpoints
```typescript
// Add to src/utils/fetch.ts
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
// 1. Add validation schema to src/lib/validation.ts
export const newFormSchema = z.object({ ... });

// 2. Use in component with React Hook Form
const form = useForm<NewFormData>({
  resolver: zodResolver(newFormSchema),
  defaultValues: { ... }
});
```

### Adding Components
- Place in appropriate subdirectory under `src/components/`
- Use Radix UI primitives for accessibility
- Follow Shadcn UI patterns with variants
- Add TypeScript props interfaces
- Include proper ARIA attributes

### Type Definitions
- Add to relevant files in `src/types/`
- Use descriptive interface names
- Include JSDoc comments for complex types
- Export types for reusability

## Code Examples

### Button Component (Shadcn UI Pattern)
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
        // ... other variants
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        // ... other sizes
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export function Button({ className, variant, size, asChild, ...props }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### Zustand Store Example
```typescript
import { create } from "zustand"
import { axiosInstance2 } from "@/utils/fetch"
import { getToken, RemoveToken } from "@/utils/Auth"

interface authDataState {
  data: Auth
  fetch: () => void
  error: boolean
}

export const authStore = create<authDataState>()((set) => ({
  data: { username: "loading...", email: "Loading..." },
  fetch: async () => {
    try {
      const { data } = await axiosInstance2.get("/v1/users/me", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      set({ data: response.data, error: false })
    } catch (error) {
      if (error.response?.status === 401) {
        RemoveToken()
      }
      set({ error: true })
    }
  },
  error: false,
}))
```

### Error Handling Pattern
```typescript
import { deleteCookie } from "cookies-next"
import { toast } from "react-hot-toast"

export const ErrorHandlerAPI = (error: any) => {
  console.error("API Error:", error)
  
  // Handle network errors
  if (!error.response) {
    toast.error("Network error. Please check your connection.")
    return { data: { message: "Network error", success: false } }
  }
  
  // Handle authentication errors
  if (error.response?.status === 401) {
    deleteCookie("token")
    window.location.href = "/login"
    toast.error("Session expired. Please log in again.")
  }
  
  // Handle specific status codes
  switch (error.response.status) {
    case 400:
      toast.error("Bad request. Please check your input.")
      break
    case 500:
      toast.error("Server error. Please try again later.")
      break
    default:
      toast.error(error?.response?.data?.message || "An unexpected error occurred.")
  }
  
  return error.response
}
```

## Additional Notes

- No Cursor or Copilot specific rules found in the codebase
- Follow existing patterns and conventions when adding new code
- Keep components small and focused on single responsibilities
- Use TypeScript interfaces for props and state
- Document complex logic with clear comments
- Maintain consistent code style throughout the project