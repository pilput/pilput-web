# pilput - Enhanced Next.js Publishing Platform

## Project Overview

**pilput** is a modern, open publishing platform built with Next.js 16+ that allows creators to write, publish, and share articles without restrictions. The platform emphasizes performance, accessibility, and user experience with features like rich text editing, real-time chat, analytics dashboards, and comprehensive content management.

### Key Technologies
- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 + Shadcn UI components (Radix UI primitives)
- **Animations**: Framer Motion, React Three Fiber (3D)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Rich Text Editor**: TipTap with custom extensions
- **HTTP Client**: Axios with custom instances
- **Charts**: Recharts for data visualization
- **Theme**: next-themes for dark/light mode
- **Package Manager**: Bun (preferred) or npm

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

### Development
```bash
# Install dependencies (Bun recommended)
bun install
# or
npm install

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

### Linting
```bash
bun run lint
# or
npm run lint
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
│   ├── analitics/            # Analytics components (Google)
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
│   ├── postsStorage.ts       # Posts cache/storage
│   ├── profilestorage.ts     # Profile data state
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
- **Image Optimization**: Configured remote patterns for Cloudfront, storage providers, GitHub, Google
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
  "lint": "next lint"
}
```

## Validation Schemas (`src/lib/validation.ts`)

Comprehensive Zod schemas for form validation:

| Schema | Purpose | Key Validations |
|--------|---------|-----------------|
| `postSchema` | Post creation | Title (1-100 chars), body (1-5000), slug (URL-friendly), photo URL, tags (max 5) |
| `registerSchema` | User registration | Username (3-20, alphanumeric+underscore), email, password (8+ chars, mixed case+number), names |
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

### `postsStorage.ts`
- Posts caching and storage
- Optimizes repeated fetches

## Authentication Flow

1. **Token Storage**: JWT stored in cookie (`token`)
2. **API Requests**: Axios interceptors add `Authorization: Bearer <token>`
3. **Session Expiry**: 
   - 401 errors trigger automatic logout
   - Token removed, user redirected to `/login?redirect=<current>`
4. **Utilities** (`src/utils/Auth.ts`):
   - `getToken()`: Retrieve current token
   - `logOut()` / `RemoveToken()`: Clear token cookie

## Error Handling (`src/utils/ErrorHandler.ts`)

Centralized `ErrorHandlerAPI` provides:
- **Network Errors**: User-friendly "check connection" message
- **Auth Errors** (401, JWT errors): Auto-logout + redirect to login
- **HTTP Status Codes**:
  - 400: Bad request
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
axiosInstance  // baseURL: Config.apibaseurl
axiosInstance2 // baseURL: Config.apibaseurl2
axiosInstance3 // baseURL: Config.apibaseurl3
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
- **JSON-LD**: Structured data for SearchAction (site search)

## Performance Optimizations

1. **Component Rendering**: Track render times for optimization
2. **API Monitoring**: Log API call performance metrics
3. **Loading Skeletons**: `PostItemPulse` and other skeleton components
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

### Styling
- **Tailwind CSS**: Utility-first with responsive prefixes
- **Shadcn/UI**: Component library with consistent design tokens
- **Dark Mode**: Automatic theme switching via `next-themes`
- **CSS Modules**: Used for complex component styles (`.scss` files)

### Code Organization
- Components grouped by feature/domain
- Reusable UI primitives in `components/ui/`
- Container/presentational pattern where appropriate
- Custom hooks for shared logic

### Testing
- Test files in `src/test/` and `src/utils/__tests__/`
- ESLint configured with `next/core-web-vitals`

## Environment Configuration

Configuration managed via `src/utils/getConfig.ts`:
- `Config.mainbaseurl`: Site URL for SEO
- `Config.maindomain`: Cookie domain
- `Config.apibaseurl`, `apibaseurl2`, `apibaseurl3`: API endpoints

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

### Custom Node.js Server
- Use `server.js` from standalone build
- Configure PORT environment variable

## Important Notes

### Image Remote Patterns
Configured in `next.config.ts` for:
- `d42zd71vraxqs.cloudfront.net`
- `storage.pilput.net` / `storage.pilput.me`
- `avatars.githubusercontent.com`
- `lh3.googleusercontent.com`
- `t3.storage.dev`
- Cloudflare R2 storage

### Cookie Domain
Authentication cookies set with `Config.maindomain` for cross-subdomain support.

### Port Configuration
Default: `3000`, configurable via `PORT` environment variable.

## Getting Started for New Developers

1. **Clone & Install**:
   ```bash
   bun install
   ```

2. **Configure Environment**:
   - Check `.env.local.example` for required variables
   - Create `.env.local` with API URLs and domain config

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

## License

Based on the pilput platform - see project repository for licensing terms.
