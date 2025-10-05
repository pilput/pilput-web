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
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
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
- **Rich Text Editor**: Tiptap with extensions for YouTube, images, headings
- **Real-time Chat**: Socket.io integration for messaging
- **Post Management**: CRUD operations with dashboard interface
- **Analytics**: Charts using Recharts for user engagement metrics

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