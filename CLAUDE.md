# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 blog platform called "pilput" with TypeScript, featuring:
- User authentication and profiles
- Rich text editing with Tiptap editor
- Real-time chat functionality with Socket.io
- Dashboard for post management
- Dark/light theme support
- Analytics and charts

## Development Commands

```bash
# Start development server with Turbopack
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Run linter
bun run lint

# Install dependencies
bun install

# Run type checking
bun tsc --noEmit
```

## Architecture

### Project Structure
- **src/app/** - App Router pages and layouts
- **src/components/** - Reusable UI components
  - **chat/** - Real-time chat components
  - **dashboard/** - Analytics and management components
  - **post/** - Blog post components including Tiptap editor
  - **ui/** - Base UI components using Radix UI
- **src/stores/** - Zustand state management
- **src/types/** - TypeScript type definitions
- **src/utils/** - Utility functions and API configurations

### Key Technologies
- **Next.js 15** with App Router and Turbopack
- **TypeScript** with strict typing
- **Tailwind CSS 4** for styling
- **Radix UI** for component primitives
- **Zustand** for state management
- **Tiptap** for rich text editing
- **React Hook Form** with Zod validation
- **Socket.io Client** for real-time features
- **Axios** for API calls

### Environment Variables and Configuration

The application uses several environment variables configured in `src/utils/getCofig.ts`:

- `NEXT_PUBLIC_API_URL` - Main API base URL
- `NEXT_PUBLIC_API_URL_2` - Secondary API base URL
- `NEXT_PUBLIC_DASH_URL` - Dashboard base URL
- `NEXT_PUBLIC_WS_URL` - WebSocket base URL for real-time features
- `NEXT_PUBLIC_STORAGE_URL` - Storage base URL for file uploads
- `NEXT_PUBLIC_MAIN_URL` - Main application URL
- `NEXT_PUBLIC_DOMAIN` - Main domain for cookie configuration

### State Management
- **userStore.ts** - Authentication state management
- **createPostStore.ts** - Post creation state
- **postsStorage.ts** - Posts caching
- **profilestorage.ts** - User profile state
- **chat-store.ts** - Chat functionality state

### API Configuration
- Two API base URLs configured in `utils/fetch.ts`
- Authentication via JWT tokens stored in cookies
- Error handling with custom error boundary components

### Key Features Architecture
- **Authentication**: JWT-based with cookie storage, automatic token refresh
- **Rich Text Editor**: Tiptap with extensions for YouTube, images, headings, colors, text styling, and placeholders
- **Real-time Chat**: Socket.io integration for messaging
- **Post Management**: CRUD operations with dashboard interface
- **Analytics**: Charts using Recharts for user engagement metrics

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
Configured remote image domains:
- d42zd71vraxqs.cloudfront.net
- storage.pilput.dev

### Type Definitions
Located in `src/types/`:
- **post.ts** - Post, Comment, and Creator interfaces
- **user.ts** - User profile structure
- **writer.ts** - Writer-specific types
- **you.ts** - Authentication response types

## Development Notes

- The project uses Turbopack for faster development builds
- All components follow the "use client" directive where needed
- Error boundaries are implemented for robust error handling
- Theme switching is handled by next-themes
- Forms use React Hook Form with Zod schemas for validation

## Testing and Quality Assurance

- **Linting**: Run `npm run lint` to check code quality
- **Type Checking**: Run `npx tsc --noEmit` to verify TypeScript compilation
- **Development Workflow**: Use `npm run dev` for hot reloading and fast feedback
- **Build Process**: `npm run build` creates optimized production bundles
- **Error Handling**: Custom ErrorHandlerAPI provides structured error responses

## Key Files and Directories

- **Main Layout**: `src/app/layout.tsx` - Contains metadata and theme provider
- **API Configuration**: `src/utils/fetch.ts` and `src/utils/getCofig.ts`
- **Validation Schemas**: `src/lib/validation.ts` - Comprehensive Zod validation schemas for forms
- **Performance Monitoring**: `src/utils/performance.ts` for tracking metrics
- **Analytics**: `src/components/analitics/Google.tsx` for Google Analytics integration

## Common Development Tasks

1. **Adding new API endpoints**: Update axios instances in `utils/fetch.ts` or create new endpoints
2. **Creating forms**: Use React Hook Form with Zod validation from `lib/validation.ts`
3. **Adding components**: Place in appropriate subdirectory under `src/components/` (chat/, dashboard/, post/, ui/)
4. **State management**: Use Zustand stores in `src/stores/` - import and subscribe to state
5. **Type definitions**: Add to relevant files in `src/types/` (post.ts, user.ts, writer.ts, you.ts)
6. **Form validation**: Extend existing schemas in `src/lib/validation.ts` or create new ones
7. **Theme support**: Use `next-themes` and Tailwind CSS theme variables
8. **Error handling**: Use ErrorHandlerAPI from `src/utils/ErrorHandler.ts`