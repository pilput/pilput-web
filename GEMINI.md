# GEMINI.md

## Project Overview

**pilput** is a modern, open publishing platform built with **Next.js 16+ (App Router)** and **TypeScript**. It's designed for creators to write, publish, and share articles with a focus on performance, SEO, and rich user experience.

### Core Features
- **Rich Text Editor:** Custom TipTap-based editor with support for headings, code blocks (lowlight), images, YouTube embeds, and slash commands.
- **Authentication:** JWT-based authentication using `cookies-next` for session management and Zustand for global auth state.
- **Blog System:** Comprehensive content management including tags (up to 5 per post), cover images, and engagement metrics (likes, views, comments).
- **Analytics Dashboard:** Real-time user analytics and post performance metrics visualized with Recharts.
- **Real-time Chat:** Messaging interface with support for multiple AI models.
- **Dynamic Routing:** User profiles are accessible via `/[username]`, and SEO is managed through dynamic metadata and sitemaps.

## Tech Stack

- **Framework:** Next.js 16.2+ (App Router)
- **Language:** TypeScript 5.9+ (Strict Mode)
- **Styling:** Tailwind CSS 4, Shadcn UI, Framer Motion (animations), and Sass for specific modules.
- **State Management:** Zustand
- **Form Handling:** React Hook Form + Zod
- **Rich Text:** TipTap
- **Data Fetching:** Axios (with multiple instances for different backend services)
- **Visualization:** Recharts
- **Font:** Geist (Next.js Font)

## Project Structure

```text
src/
├── app/                  # Next.js App Router (pages, layouts, API routes)
│   ├── [username]/       # Dynamic user profile pages
│   ├── blog/             # Blog listing and individual post pages
│   ├── chat/             # AI-powered chat interface
│   ├── dashboard/        # Analytics and management dashboard
│   └── ...               # Auth (login/register), about, contact, etc.
├── components/           # React components
│   ├── post/             # TipTap Editor, PostContent, PostList, etc.
│   ├── ui/               # Shadcn UI primitives
│   ├── chat/             # Chat-specific components
│   ├── dashboard/        # Chart and analytics components
│   └── common/           # Shared components (e.g., Paginate)
├── stores/               # Zustand stores (auth, posts, chat, etc.)
├── types/                # TypeScript interfaces and types
├── utils/                # Utility functions (Auth, fetch, slug, etc.)
├── lib/                  # Library configurations (validation, code-highlight)
└── hooks/                # Custom React hooks
```

## Building and Running

### Development
```bash
bun install    # Recommended
# or
npm install

bun run dev
# or
npm run dev
```
Accessible at `http://localhost:3000`.

### Production
```bash
bun run build
bun run start
```

### Docker
```bash
docker build -t pilput -f Dockerfile-bun .
docker run -p 3000:3000 pilput
```

## Development Conventions

- **Data Validation:** Always use Zod schemas defined in `src/lib/validation.ts` for form and API data validation.
- **State Management:** Use Zustand for global state. Avoid prop drilling for shared data like user authentication (`authStore`).
- **Styling:** Prefer Tailwind utility classes. Use `cn()` (from `src/lib/utils.ts`) for conditional class merging. For complex component-specific styles, use `.module.scss`.
- **API Calls:** Use the appropriate `axiosInstance` from `src/utils/fetch.ts`.
  - `axiosInstance3` is commonly used for user and auth-related endpoints.
- **Rich Text:** When modifying the editor, ensure compatibility with existing TipTap extensions in `src/components/post/Editor.tsx`.
- **Accessibility:** Ensure all new UI components follow Radix UI/Shadcn standards for ARIA and keyboard navigation.
- **SEO:** Update `metadata` and `viewport` in `layout.tsx` or individual pages as needed.

## Key Files
- `src/lib/validation.ts`: Central source of truth for all data schemas.
- `src/utils/Auth.ts` & `src/stores/userStore.ts`: Core authentication logic and state.
- `src/components/post/Editor.tsx`: The heart of the publishing experience.
- `src/utils/fetch.ts`: Axios configuration and API base URLs.
