# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 blog platform called "pilput" with TypeScript, featuring:
- User authentication and profiles with JWT tokens
- Rich text editing with Tiptap editor (YouTube, images, formatting)
- Real-time chat functionality with Socket.io
- Dashboard for post management with analytics
- Dark/light theme support with next-themes
- Performance monitoring and accessibility features
- Comprehensive form validation with Zod schemas

## Development Commands

```bash
# Install dependencies (uses Bun)
bun install

# Start development server
next dev

# Build for production
next build

# Start production server
next start

# Run linter
next lint

# Run type checking
npx tsc --noEmit
```

## Architecture

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── chat/              # Chat functionality
│   ├── dashboard/         # Admin dashboard
│   ├── [username]/        # User profiles
│   └── [username]/[slug]/ # Individual posts
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
- **Next.js 16** with App Router and Turbopack for fast builds
- **React 19** with React DOM
- **TypeScript 5.9** with strict typing and path aliases (`@/*`)
- **Tailwind CSS 4** for styling with custom animations
- **Radix UI** for accessible component primitives
- **Zustand 5** for state management
- **Tiptap** for rich text editing with multiple extensions
- **Socket.io Client** for real-time chat
- **React Hook Form + Zod** for form validation
- **Recharts** for data visualization
- **Framer Motion** for animations
- **Axios** for API calls with dual endpoints
- **Bun** as the package manager

### Environment Variables and Configuration

The application uses several environment variables configured in `src/utils/getCofig.ts`:

```typescript
NEXT_PUBLIC_API_URL=""        # Main API base URL
NEXT_PUBLIC_API_URL_2=""      # Secondary API base URL
NEXT_PUBLIC_DASH_URL=""       # Dashboard base URL
NEXT_PUBLIC_WS_URL=""         # WebSocket base URL for real-time features
NEXT_PUBLIC_STORAGE_URL=""    # Storage base URL for file uploads
NEXT_PUBLIC_MAIN_URL=""       # Main application URL
NEXT_PUBLIC_DOMAIN=""         # Main domain for cookie configuration
```

### State Management (Zustand)

**Core Stores:**
- `userStore.ts` - Authentication state management with automatic token refresh
- `postsStorage.ts` - Post caching and management
- `profilestorage.ts` - User profile state
- `chat-store.ts` - Chat functionality state
- `createPostStore.ts` - Post creation workflow state

**Usage Pattern:**
```typescript
import { authStore } from '@/stores/userStore';

const user = authStore(state => state.data);
const fetchUser = authStore(state => state.fetch);
```

### API Configuration

**Dual API Endpoints** in `src/utils/fetch.ts`:
```typescript
export const axiosInstence = axios.create({
  baseURL: Config.apibaseurl,    // Main API
});

export const axiosInstence2 = axios.create({
  baseURL: Config.apibaseurl2,   // Secondary API
});
```

**Authentication Flow:**
- JWT tokens stored in HTTP-only cookies
- Automatic token refresh on 401 errors
- Global error handling with user-friendly toast notifications
- Security headers configured in `next.config.ts`

### Key Features Architecture

**Authentication System:**
- JWT-based authentication with cookie storage
- Automatic token refresh and logout on auth errors
- Protected routes using Next.js middleware patterns
- Form validation with Zod schemas for registration/login

**Rich Text Editor (Tiptap):**
- Multiple extensions: Starter Kit, Heading, Image, YouTube, Color, Text Style, Underline, Placeholder
- Image upload capabilities with remote storage
- YouTube video embedding
- Custom styling with Tailwind CSS

**Real-time Chat:**
- Socket.io integration for real-time messaging
- Message validation and sanitization
- Typing indicators and online status
- Persistent chat history

**Dashboard Analytics:**
- Recharts integration for data visualization
- Performance monitoring utilities
- Real-time metrics updates
- Loading skeletons for better UX

**Form Validation:**
- Comprehensive Zod schemas in `src/lib/validation.ts`
- React Hook Form integration
- Client-side validation with custom error messages
- TypeScript types exported for all validation schemas

### Editor Configuration

The Tiptap editor includes these extensions:
- **Starter Kit**: Basic formatting (bold, italic, bullet lists, etc.)
- **Heading**: H1, H2, H3 heading support
- **Image**: Image embedding and upload capabilities
- **YouTube**: YouTube video embedding
- **Color**: Text color customization
- **Text Style**: Advanced text formatting
- **Underline**: Underline text formatting
- **Placeholder**: Placeholder text for empty editors

### Image Handling
Configured remote image patterns in `next.config.ts`:
- d42zd71vraxqs.cloudfront.net
- storage.pilput.dev

### Type Definitions
Located in `src/types/`:
- **post.ts** - Post, Comment, and Creator interfaces
- **user.ts** - User profile structure
- **writer.ts** - Writer-specific types
- **you.ts** - Authentication response types

### Performance & Accessibility

**Performance Optimizations:**
- Turbopack for faster development builds
- Image optimization with remote patterns
- Component-level performance monitoring in `src/utils/performance.ts`
- Lazy loading and skeleton components
- Optimized animations with throttling

**Accessibility Features:**
- Comprehensive ARIA attributes throughout components
- Keyboard navigation support with focus indicators
- Semantic HTML structure
- Screen reader friendly labels and descriptions
- High contrast and responsive design

## Development Workflow

### File Organization
- Use path aliases: `@/components/` instead of `../../../components/`
- Components follow Shadcn UI patterns with Radix primitives
- Zustand stores for state management (not Redux)
- Zod schemas for all form validation
- TypeScript strict mode enforced

### Error Handling
- Global error handling with `ErrorHandlerAPI` in `src/utils/ErrorHandler.ts`
- Automatic authentication error handling with redirect to login
- User-friendly toast notifications for all error types
- Network error detection and user feedback

### Testing Setup
**Current State:** No explicit testing framework configured
- ESLint with Next.js core web vitals for code quality
- TypeScript strict mode for type safety
- Manual testing through development workflow
- Consider adding Jest/Vitest for unit tests if needed

### Component Patterns
- **Shadcn UI Style**: Components follow the Shadcn UI pattern with:
  - `cn()` utility for conditional classes
  - `buttonVariants()` for variant styles
  - Clear separation of UI and logic
  - Accessibility-first approach

- **Custom Hooks**: Use `src/hooks/` for reusable logic
- **Utilities**: Place shared functions in `src/utils/`
- **Validation**: All forms use Zod schemas from `src/lib/validation.ts`

## Key Files and Directories

### Critical Configuration
- **Main Layout**: `src/app/layout.tsx` - Contains metadata and theme provider
- **TypeScript Config**: `tsconfig.json` - Strict mode with path aliases
- **Next.js Config**: `next.config.ts` - Remote images and security headers
- **API Configuration**: `src/utils/fetch.ts` and `src/utils/getCofig.ts`
- **Error Handling**: `src/utils/ErrorHandler.ts` - Global error management

### Validation & Types
- **Validation Schemas**: `src/lib/validation.ts` - Comprehensive Zod schemas for forms
- **Type Definitions**: `src/types/` - Complete TypeScript interfaces
- **Performance Monitoring**: `src/utils/performance.ts` for tracking metrics

### State Management
- **Authentication**: `src/stores/userStore.ts` - User state and auth flow
- **Posts**: `src/stores/postsStorage.ts` - Post caching and management
- **Chat**: `src/stores/chat-store.ts` - Real-time chat state

## Common Development Tasks

### 1. Adding New API Endpoints
```typescript
// Add to src/utils/fetch.ts
export async function newEndpoint(data: any) {
  try {
    const response = await axiosInstence.post('/endpoint', data);
    return response.data;
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}
```

### 2. Creating Forms
```typescript
// 1. Add validation schema to src/lib/validation.ts
export const newFormSchema = z.object({ ... });

// 2. Use in component with React Hook Form
const form = useForm<NewFormData>({
  resolver: zodResolver(newFormSchema),
  defaultValues: { ... }
});
```

### 3. Adding Components
- Place in appropriate subdirectory under `src/components/`
- Use Radix UI primitives for accessibility
- Follow Shadcn UI patterns with variants
- Add TypeScript props interfaces
- Include proper ARIA attributes

### 4. State Management
- Use Zustand stores in `src/stores/`
- Import and subscribe to state as needed
- Keep state minimal and focused
- Use middleware for complex state logic

### 5. Type Definitions
- Add to relevant files in `src/types/`
- Use descriptive interface names
- Include JSDoc comments for complex types
- Export types for reusability

### 6. Form Validation
- Extend existing schemas in `src/lib/validation.ts`
- Use Zod for client-side validation
- Export TypeScript types for form data
- Include custom error messages

### 7. Error Handling
- Use `ErrorHandlerAPI` from `src/utils/ErrorHandler.ts` for API calls
- Handle specific error cases appropriately
- Provide user-friendly error messages
- Log errors for debugging

### 8. Performance Optimization
- Use Turbopack development server for fast feedback
- Implement loading skeletons for async operations
- Monitor performance with utilities in `src/utils/performance.ts`
- Optimize images and animations

## Security Considerations

### Authentication
- JWT tokens stored in HTTP-only cookies
- Automatic logout on authentication errors
- Protected routes using middleware patterns
- Input validation with Zod schemas

### Security Headers
- Configured in `next.config.ts` with security middleware
- CSRF protection through SameSite cookies
- XSS protection with Content Security Policy
- Frame options and content type protection

### Input Validation
- All forms use Zod validation schemas
- Server-side validation should mirror client-side
- Sanitize user inputs before processing
- Rate limiting considerations for API endpoints

## Deployment

### Build Configuration
- Uses Turbopack for optimized production builds
- Environment variables required for all API endpoints
- Remote image domains configured in Next.js config
- Security headers automatically applied

### Platform Support
- Deployable to Vercel, Netlify, or any Node.js hosting
- Docker support available through standard Next.js setup
- Environment variable configuration required for all deployments