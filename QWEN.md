# pilput - Enhanced Next.js Publishing Platform

## Project Overview

**pilput** is a modern, open publishing platform built with Next.js 16+ that allows creators to write, publish, and share articles without restrictions. The platform emphasizes performance, accessibility, and user experience with features like rich text editing, real-time chat, analytics dashboards, and comprehensive content management.

### Key Technologies
- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript 5.9+ (strict mode)
- **Styling**: Tailwind CSS 4 + Shadcn UI components (Radix UI primitives)
- **Animations**: Framer Motion, React Three Fiber (3D)
- **State Management**: Zustand 5
- **Forms**: React Hook Form 7 + Zod 4 validation
- **Rich Text Editor**: TipTap 3 with custom extensions
- **HTTP Client**: Axios with custom instances
- **Charts**: Recharts for data visualization
- **Theme**: next-themes for dark/light mode
- **Package Manager**: Bun (recommended) or npm

### Core Features
- **Rich Text Editor**: TipTap-based with headings (H1-H3), images, YouTube embeds, links, underline, character count, and slash commands
- **Authentication**: JWT-based with cookie storage and automatic session refresh
- **Blog/Posts**: Create, edit, publish articles with tags, cover images, view counts, likes, and comments
- **Dashboard**: User analytics with charts, post performance metrics
- **Chat Interface**: Real-time messaging with AI model selection
- **Profile System**: User profiles with custom URLs (`/[username]`)
- **Tags System**: Content categorization with up to 5 tags per post
- **Accessibility**: ARIA attributes, keyboard navigation, focus indicators, screen reader support
- **SEO**: Comprehensive metadata, OpenGraph, Twitter cards, sitemap, robots.txt
- **Performance**: Component render tracking, API monitoring, loading skeletons, mouse movement throttling

## Building and Running

### Prerequisites
- Node.js 18+ or Bun 1.0+
- npm or Bun package manager

### Installation
```bash
# Clone the repository
cd next-turbo

# Install dependencies (Bun recommended)
bun install
# or
npm install
```

### Development
```bash
# Run development server
bun run dev
# or
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

### Production
```bash
# Build for production
bun run build
# or
npm run build

# Start production server
bun run start
# or
npm run start
```

### Docker (Production-Ready)
```bash
# Build Docker image
docker build -t pilput -f Dockerfile-bun .

# Run container
docker run -p 3000:3000 pilput
```

### Linting & Type Checking
```bash
# Run ESLint
bun run lint

# Type checking (recommended before commits)
bunx tsc --noEmit
```

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── [username]/           # Dynamic user profile pages
│   ├── about/                # About page
│   ├── account/              # Account management
│   ├── blog/                 # Blog listing and post pages
│   ├── chat/                 # Chat interface
│   ├── contact/              # Contact page
│   ├── dashboard/            # User analytics dashboard
│   ├── forbidden/            # 403 access denied page
│   ├── login/                # Login page
│   ├── privacy/              # Privacy policy
│   ├── profile/              # User profile pages
│   ├── register/             # Registration page
│   ├── tags/                 # Tag management pages
│   ├── global.css            # Global styles
│   ├── layout.tsx            # Root layout with metadata
│   ├── page.tsx              # Home page (landing)
│   ├── not-found.tsx         # 404 page
│   ├── robots.ts             # Dynamic robots.txt
│   └── sitemap.ts            # Dynamic sitemap
├── components/               # React components
│   ├── account/              # Account-related components
│   ├── auth/                 # Authentication components
│   ├── blog/                 # Blog-specific components
│   ├── chat/                 # Chat interface components
│   ├── common/               # Shared common components
│   ├── dashboard/            # Dashboard components
│   ├── error/                # Error handling components
│   ├── footer/               # Footer components
│   ├── header/               # Header/Navigation components
│   ├── home/                 # Homepage components
│   ├── landing/              # Landing page sections
│   ├── layouts/              # Layout wrappers
│   ├── post/                 # Post editor and display
│   │   ├── Editor.tsx        # TipTap rich text editor
│   │   ├── MenuBar.tsx       # Editor toolbar
│   │   ├── FloatingTextMenu.tsx  # Floating formatting menu
│   │   ├── SlashCommandMenu.tsx  # Slash command menu
│   │   ├── PostContent.tsx   # Post content renderer
│   │   ├── PostItem.tsx      # Post card component
│   │   ├── Comment.tsx       # Comment component
│   │   └── ...               # Other post components
│   ├── profile/              # Profile components
│   ├── tags/                 # Tag components
│   ├── ui/                   # Shadcn UI primitives
│   ├── user/                 # User-related components
│   └── writer/               # Writer-specific components
├── data/                     # Static data files
├── hooks/                    # Custom React hooks
├── lib/                      # Library files
│   └── validation.ts         # Zod validation schemas
├── stores/                   # Zustand state stores
│   ├── chat-store.ts         # Chat state management
│   ├── createPostStore.ts    # Post creation state
│   ├── holdingsStore.ts      # Holdings/portfolio state
│   ├── posts-store.ts        # Posts cache/storage
│   ├── profile-store.ts      # Profile data state
│   ├── updatePostStore.ts    # Post update state
│   └── userStore.ts          # User authentication state
├── test/                     # Test files
├── types/                    # TypeScript type definitions
│   ├── holding-comparison.ts # Holding comparison types
│   ├── holding.ts            # Holding/portfolio types
│   ├── post.ts               # Post-related types
│   ├── user.ts               # User types
│   ├── writer.ts             # Writer types
│   └── you.ts                # Auth user types
├── utils/                    # Utility functions
│   ├── Auth.ts               # Authentication utilities (token management)
│   ├── ErrorHandler.ts       # Centralized error handling API
│   ├── fetch.ts              # Axios instance configuration
│   ├── getConfig.ts          # App configuration management
│   ├── getImage.ts           # Image URL utilities
│   ├── sanitize.ts           # Input sanitization
│   └── slug.ts               # URL slug generation
└── proxy.ts                  # Proxy configuration
```

## Key Configuration Files

### `next.config.ts`
- **Image Optimization**: Configured remote patterns for Cloudfront, storage providers, GitHub, Google, Unsplash
- **Security Headers**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: geolocation=(), microphone=(), camera=()`

### `tsconfig.json`
- **Strict Mode**: Enabled
- **Path Aliases**: `@/*` → `./src/*`
- **Module Resolution**: `bundler`
- **Target**: ES2017

### `components.json` (Shadcn UI)
- **Style**: new-york
- **Icon Library**: Lucide
- **Base Color**: Neutral
- **CSS Variables**: Enabled

### `package.json` Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint ."
}
```

## Validation Schemas (`src/lib/validation.ts`)

Comprehensive Zod schemas for form validation:

| Schema | Purpose | Key Validations |
|--------|---------|-----------------|
| `postSchema` | Post creation | Title (1-100 chars), body (1-5000), slug (URL-friendly), photo URL, tags (max 5) |
| `registerSchema` | User registration | Username (3-20, alphanumeric+underscore), email, password (8+ chars, mixed case+number), names |
| `addUserSchema` | Admin user creation | Same as register + password confirmation |
| `editUserSchema` | User editing | First/last name, username, email |
| `loginSchema` | User login | Identifier (username/email), password |
| `chatMessageSchema` | Chat messages | Content (1-1000 chars) |
| `commentSchema` | Comments | Text (1-500 chars) |
| `holdingFormSchema` | Holdings management | Name, platform, type, currency, amounts, dates |
| `duplicateHoldingSchema` | Holdings duplication | Date ranges, overwrite flag |

All schemas export inferred TypeScript types (e.g., `PostFormData`, `RegisterFormData`).

## State Management (Zustand)

### `userStore.ts` (`authStore`)
- Manages authenticated user data
- Auto-fetches `/v1/users/me` with JWT token
- Handles 401 errors with automatic token removal and redirect to login

### `createPostStore.ts` / `updatePostStore.ts`
- Manages post creation/update state
- Tracks form data, loading states, errors

### `chat-store.ts`
- Chat conversation state
- Message history, model selection

### `holdingsStore.ts`
- Portfolio/holdings management
- Track investments, values, performance

### `posts-store.ts`
- Posts caching and storage
- Optimizes repeated fetches

### `profile-store.ts`
- User profile data management

## Authentication Flow

1. **Token Storage**: JWT stored in cookie (`token`)
2. **API Requests**: Axios interceptors add `Authorization: Bearer <token>`
3. **Session Expiry**: 
   - 401 errors trigger automatic logout
   - Token removed, user redirected to `/login?redirect=<current>`
4. **Utilities** (`src/utils/Auth.ts`):
   - `getToken()`: Retrieve current token
   - `logOut()` / `RemoveToken()`: Clear token cookie with domain scope

## Error Handling (`src/utils/ErrorHandler.ts`)

Centralized `ErrorHandlerAPI` provides:
- **Network Errors**: User-friendly "check connection" message
- **Auth Errors** (401, JWT errors): Auto-logout + redirect to login
- **HTTP Status Codes**:
  - 400: Bad request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not found
  - 500/502/503: Server errors
- **Toast Notifications**: All errors shown via `sonner` toasts

## Rich Text Editor (`src/components/post/Editor.tsx`)

**TipTap-based** with extensions:
- **StarterKit**: Basic formatting (bold, italic, lists, blockquotes, code)
- **Headings**: H1, H2, H3
- **Underline**: Text underlining
- **Images**: Inline images with rounded styling
- **YouTube**: Embedded videos with controls
- **Links**: Clickable links (openOnClick: false)
- **Text Align**: Left, center, right, justify
- **Character Count**: Word/character counter with percentage indicator
- **Placeholder**: Empty editor hint text
- **Slash Commands**: `/` to open command menu

**UI Components**:
- `MenuBar`: Top toolbar with formatting buttons
- `FloatingTextMenu`: Contextual menu on text selection
- `SlashCommandMenu`: Command palette on `/` trigger

## API Configuration (`src/utils/fetch.ts`)

Three Axios instances for different API endpoints:
```typescript
apiClient          // baseURL: Config.apibaseurl (Railway default)
apiClientSecondary // baseURL: Config.apibaseurl2 (api.pilput.net)
apiClientApp       // baseURL: Config.apibaseurl3 (hono.pilput.net)
```

All instances use `ErrorHandlerAPI` for consistent error handling.

## SEO & Metadata (`src/app/layout.tsx`)

Comprehensive metadata configuration:
- **Title**: Default + template (`%s | pilput`)
- **Description**: Platform description with keywords
- **OpenGraph**: Type, locale, images, site name
- **Twitter Cards**: Summary large image with creator handle
- **Robots**: Index, follow, max-image-preview: large
- **Icons**: Favicon configurations
- **Canonical URLs**: Proper alternate links
- **Font**: Space Grotesk from Google Fonts

## Performance Optimizations

1. **Component Rendering**: Track render times for optimization
2. **API Monitoring**: Log API call performance metrics
3. **Loading Skeletons**: `PostItemPulse`, `PostListPulse` for skeleton screens
4. **Mouse Throttling**: Reduce CPU usage from mouse movement listeners
5. **Reduced Animations**: Simplified particle effects in Hero component
6. **Image Optimization**: Next.js Image component with remote patterns
7. **Standalone Output**: Docker-optimized build output

## Accessibility Features

- **ARIA Attributes**: Throughout interactive components
- **Keyboard Navigation**: Focus rings, tab order, shortcut keys
- **Focus Indicators**: Visible focus states on buttons, links
- **Semantic HTML**: Proper heading hierarchy, landmark regions
- **Screen Reader Labels**: `aria-label`, `aria-labelledby`, `aria-describedby`
- **Dialog Accessibility**: `aria-modal`, `aria-expanded` states
- **Current Page Indication**: `aria-current="page"` on active nav items

## Development Conventions

### TypeScript
- Strict mode enforced
- Path aliases for clean imports (`@/components/`, `@/utils/`)
- Types inferred from Zod schemas where applicable
- Export types for reusability: `export type PostFormData = z.infer<typeof postSchema>`

### Import Organization
Group imports in this order:
1. React
2. External libraries
3. Internal packages (`@/`)
4. Local files

Example:
```typescript
import * as React from "react"
import { useState } from "react"
import { Slot } from "@radix-ui/react-slot"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { authStore } from "@/stores/userStore"
import type { Auth } from "@/types/you"
```

### Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **Functions/Variables**: camelCase (`fetchUserData`, `isLoading`)
- **Constants**: UPPER_CASE for true constants
- **Types/Interfaces**: PascalCase (`Post`, `AuthState`)
- **Files**: kebab-case (`user-profile.tsx`)

### Styling
- **Tailwind CSS**: Utility-first with responsive prefixes
- **Shadcn/UI**: Component library with consistent design tokens
- **Dark Mode**: Automatic theme switching via `next-themes`
- **cn() Utility**: Merge conditional classes: `cn("base", isActive && "active")`

### Code Organization
- Components grouped by feature/domain
- Reusable UI primitives in `components/ui/`
- Container/presentational pattern where appropriate
- Custom hooks for shared logic

## Environment Configuration

Configuration managed via `src/utils/getConfig.ts`:

| Variable | Default | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | `https://axum-pilput.up.railway.app` | Primary API |
| `NEXT_PUBLIC_API_URL_2` | `https://api.pilput.net` | Secondary API |
| `NEXT_PUBLIC_API_URL_3` | `https://hono.pilput.net` | Tertiary API |
| `NEXT_PUBLIC_WS_URL` | `https://api.pilput.net` | WebSocket URL |
| `NEXT_PUBLIC_STORAGE_URL` | `https://d42zd71vraxqs.cloudfront.net` | Storage/CDN |
| `NEXT_PUBLIC_MAIN_URL` | `https://pilput.net` | Site URL for SEO |
| `NEXT_PUBLIC_DOMAIN` | `pilput.net` | Cookie domain |

Create `.env.local` with your values (see `.env.local.example` for reference).

## Deployment

### Vercel/Netlify
- Standard Next.js deployment
- Environment variables for API URLs

### Docker (Recommended for Production)
Multi-stage build for optimized image:
1. **Base**: Bun runtime
2. **Deps**: Install dependencies
3. **Builder**: Build Next.js app
4. **Runner**: Minimal runtime with standalone output

```bash
docker build -t pilput -f Dockerfile-bun .
docker run -p 3000:3000 pilput
```

## Image Remote Patterns

Configured in `next.config.ts` for:
- `d42zd71vraxqs.cloudfront.net`
- `storage.pilput.net`
- `avatars.githubusercontent.com`
- `lh3.googleusercontent.com`
- `t3.storage.dev`
- `7ec55d5596373a0c55c0ba5f45febb9e.r2.cloudflarestorage.com`
- `images.unsplash.com`

## Common Development Patterns

### Adding API Endpoints
```typescript
// In appropriate utility file
import { apiClientApp } from "@/utils/fetch";
import { ErrorHandlerAPI } from "@/utils/ErrorHandler";

export async function newEndpoint(data: any) {
  try {
    const response = await apiClientApp.post('/endpoint', data);
    return response.data;
  } catch (error) {
    return ErrorHandlerAPI(error);
  }
}
```

### Adding Validation Schema
```typescript
// src/lib/validation.ts
export const mySchema = z.object({
  field: z.string().min(1, "Required"),
});
export type MyFormData = z.infer<typeof mySchema>;

// Usage with React Hook Form
const form = useForm<MyFormData>({
  resolver: zodResolver(mySchema),
  defaultValues: { field: "" }
});
```

### Adding Zustand Store
```typescript
// src/stores/myStore.ts
import { create } from "zustand";
import { apiClientApp } from "@/utils/fetch";

interface MyState {
  data: MyData;
  fetch: () => void;
  error: boolean;
}

export const myStore = create<MyState>()((set) => ({
  data: { /* initial state */ },
  fetch: async () => {
    try {
      const { data } = await apiClientApp.get("/endpoint");
      set({ data: data.data, error: false });
    } catch (error) {
      set({ error: true });
    }
  },
  error: false,
}));
```

## Best Practices

### Security
- JWT tokens stored in HTTP-only cookies (never localStorage)
- Automatic logout and redirect on 401 authentication errors
- Input validation with Zod schemas on all forms
- Use `getToken()` and `RemoveToken()` from `@/utils/Auth`
- Security headers configured in `next.config.ts`

### Performance
- Turbopack for faster development builds
- Image optimization with remote patterns
- Lazy loading and skeleton components for heavy components
- Use `React.Suspense` for async components
- Component render tracking for optimization

### Accessibility
- ARIA attributes on all interactive elements
- Keyboard navigation support
- Focus indicators visible
- Semantic HTML structure
- Screen reader compatibility

### Code Quality
- Run `bunx tsc --noEmit` before committing
- Run `bun run lint` for ESLint checks
- Keep components focused (under 100 lines preferred)
- Use TypeScript strict mode
- Add JSDoc comments for complex types

## Getting Started for New Developers

1. **Clone & Install**:
   ```bash
   bun install
   ```

2. **Configure Environment**:
   - Create `.env.local` with required API URLs
   - Reference `.env.local.example` if available

3. **Run Development**:
   ```bash
   bun run dev
   ```

4. **Explore Codebase**:
   - Start with `src/app/page.tsx` (landing page)
   - Review `src/components/post/Editor.tsx` (rich text editor)
   - Check `src/lib/validation.ts` (form validation)
   - Understand state in `src/stores/userStore.ts`

5. **Common Tasks**:
   - **Add Component**: Create in `src/components/feature/`, use Shadcn patterns
   - **Add Page**: Create folder in `src/app/` with `page.tsx`
   - **Add API Call**: Use existing Axios instances in `src/utils/fetch.ts`
   - **Add Validation**: Extend schemas in `src/lib/validation.ts`
   - **Add State**: Create store in `src/stores/` following Zustand patterns

## Contributing

- Follow existing React/Next.js best practices
- Maintain accessibility standards (WCAG)
- Write TypeScript with strict types
- Use Zod for all form validation
- Add loading states and error handling
- Test with both light and dark themes
- Ensure responsive design across breakpoints
- Run type checking and linting before commits

## Support

For issues and questions, refer to the project repository or open an issue.

---

Built with ❤️ using Next.js 16, React 19, TypeScript 5.9, and Tailwind CSS 4
