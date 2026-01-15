# pilput - Enhanced Next.js Publishing Platform

## Project Overview

This is a Next.js-based publishing platform called "pilput" that allows creators to publish and share articles without restrictions. It's built using modern React and Next.js technologies with a focus on performance, accessibility, and user experience.

### Key Technologies
- Next.js 16+ with App Router
- TypeScript
- Tailwind CSS
- Shadcn UI components
- Framer Motion for animations
- Zustand for state management
- Zod for form validation
- React Hook Form
- Axios for API calls
- Recharts for data visualization
- TipTap for rich text editing

### Project Architecture
- **Frontend Framework**: Next.js App Router (src/app)
- **Styling**: Tailwind CSS with custom components
- **State Management**: Zustand
- **Form Validation**: Zod with React Hook Form
- **Rich Text Editing**: TipTap editor
- **Authentication**: Cookie-based with JWT tokens
- **Analytics**: Google Analytics integration
- **Theming**: Dark/light mode support via next-themes

## Building and Running

### Development
```bash
# Install dependencies
bun install
# or
npm install

# Run development server
bun run dev
# or
npm run dev
```
Then visit [http://localhost:3000](http://localhost:3000)

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

### Docker
The application is Docker-ready with a multi-stage build process:
```bash
# Build and run with Docker
docker build -t pilput -f Dockerfile-bun .
docker run -p 3000:3000 pilput
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [username]/         # User profile routes
│   ├── blog/               # Blog related pages
│   ├── chat/               # Chat interface
│   ├── dashboard/          # User dashboard
│   ├── forum/              # Discussion forum
│   ├── profile/            # User profile
│   └── ...                 # Other pages
├── components/            # React UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Library files (validation, utilities)
├── stores/                # Zustand stores
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
├── middleware/            # Next.js middleware
├── layouts/               # Layout components
└── styles/                # Global styles
```

## Key Features

### 1. Rich Text Editor
- Uses TipTap editor with extensions for:
  - Headings (H1, H2, H3)
  - Images and YouTube embeds
  - Underline formatting
  - Placeholders and custom styling
  - Syntax highlighting

### 2. Form Validation
Comprehensive Zod-based validation schemas for:
- Post creation (title, body, slug, photo_url, tags)
- User registration (username, email, password requirements)
- User login
- Chat messages
- Comments

### 3. Performance Optimization
- Component render time tracking
- API call performance monitoring
- Loading skeletons for better UX
- Mouse movement throttling
- Reduced animated elements

### 4. Accessibility
- ARIA attributes throughout the application
- Keyboard navigation support
- Focus indicators for interactive elements
- Semantic HTML structure
- Screen reader friendly labels

### 5. Security
- HTTP security headers configured in next.config.ts
- JWT token management with automatic session refresh
- Input validation and sanitization
- Protected routes with authentication

### 6. SEO & Metadata
- Comprehensive OpenGraph and Twitter card metadata
- Dynamic title templates
- Descriptive page content
- Proper canonical URLs

## Development Conventions

### TypeScript
- Strict mode enabled
- Path aliases configured (e.g., `@/components/`, `@/utils/`)
- Zod schemas used for form validation with inferred TypeScript types

### Styling
- Tailwind CSS with shadcn/ui components
- Responsive design using Tailwind's responsive prefixes
- Dark mode support with automatic theme switching
- Consistent component styling across the application

### Components
- Organized in the `components/` directory by feature
- Reusable and well-documented components
- Proper separation between presentational and container components

### Data Management
- Zustand for global state management
- React Query/SWR for server state (if present)
- Form handling with React Hook Form and Zod validation

## Important Files & Configuration

### Configuration Files
- `next.config.ts` - Next.js configuration with security headers and image optimization
- `tsconfig.json` - TypeScript configuration with path aliases
- `package.json` - Dependencies and scripts
- `Dockerfile-bun` - Multi-stage Docker build configuration

### Key Utilities
- `src/lib/validation.ts` - Centralized Zod validation schemas
- `src/utils/ErrorHandler.ts` - API error handling with user feedback
- `src/utils/performance.ts` - Performance monitoring utilities (mentioned in documentation)
- `src/components/post/Editor.tsx` - Rich text editor implementation

### Environment Variables
- `.env.local` for local development (example in `.env.local.example`)

## Deployment

The application is configured for:
- Standalone output for Docker deployment
- Vercel/Netlify deployment (Next.js compatible)
- Custom Node.js server deployment
- Security headers for production environments

## Error Handling

- Centralized error handling via `ErrorHandlerAPI` utility
- Automatic session management (logout on JWT expiration)
- User-friendly toast notifications
- Network error detection and handling
- HTTP status code specific error messages