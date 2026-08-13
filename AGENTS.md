# AGENTS.md

## Commands

```bash
bun run dev       # dev server (http://localhost:3000)
bun run build     # production build
bun run start     # production server
bun run lint      # ESLint (eslint-config-next/core-web-vitals)
bunx tsc --noEmit # type-check (no script in package.json)
```

Bun is the only package manager — `bun.lock` is the sole lockfile (no npm/yarn/pnpm). Use `bun` for installs and run scripts; don't generate an npm `package-lock.json`. TypeScript is v7 (the native compiler).

No test runner is configured (no `src/test/`). Single-package Next.js app — `next-turbo` is just the repo name; there is no Turborepo or workspace setup. No CI workflows exist (`.github/workflows/` is empty).

## Architecture

- **Next.js 16+ App Router** — all routes under `src/app/`. See the agent-rules block at the bottom: read `node_modules/next/dist/docs/` before writing Next-specific code (APIs differ from older versions)
- **API client**: `apiClient` in `src/utils/fetch.ts` (thin wrapper around native `fetch`, not Axios) → `NEXT_PUBLIC_API_URL`. It transparently refreshes an expired JWT via `/api/auth/refresh` on a 401 and retries once (single shared in-flight refresh), passes `FormData` through for uploads, and defaults to `cache: "no-store"`
- **Auth**: JWT access + refresh tokens in cookies via `cookies-next`; see `src/utils/Auth.ts`. Cookies are `secure: true`, `sameSite: "none"`, and domain-scoped to `.NEXT_PUBLIC_DOMAIN` — so they require HTTPS; plain `http://localhost` will silently drop them
- **State**: Zustand stores in `src/stores/`
- **Forms**: React Hook Form + Zod schemas in `src/lib/validation.ts`
- **Rich text**: TipTap v3 editor in `src/components/post/Editor.tsx`; code blocks use **highlight.js/lowlight** (`src/lib/code-block-highlight.ts`, `src/lib/code-highlight.ts`). Prism (`rehype-prism-plus`) is only used for chat Markdown rendering (`src/components/chat/markdown.tsx`)
- **UI components**: Shadcn UI (new-york, `src/components/ui/`, `components.json`); add new ones via `npx shadcn@latest add <name>`

## Conventions

- Path alias: `@/*` maps to `./src/*`
- Tailwind CSS **v4**: `@import "tailwindcss"`, `@plugin`, `@custom-variant`, `@theme inline` in `src/app/global.css` — do not use v3 `@tailwind` directives or `tailwind.config.*`
- Dark mode: `.dark` class on ancestor (via `@custom-variant dark`), managed by `next-themes`
- Style utilities: `cn()` from `@/lib/utils` (clsx + tailwind-merge)
- Form validation schemas must be defined in `src/lib/validation.ts` with Zod, not inline
- Post editor styles are SCSS modules (`src/components/post/*.module.scss`); everything else is Tailwind
- Turbopack: `next.config.ts` sets `turbopack.root`; Next 16 runs Turbopack for dev/build — don't add `webpack` config
- Security headers for all routes are set in `next.config.ts` `headers()`; `next/image` `remotePatterns` are allow-listed there — add new image hosts there, not via `unoptimized`

## Environment

Copy `.env.local.example` to `.env.local`. The app runs against the **production** pilput.net APIs by default — there is no local backend. Required vars (defaults hardcoded in `src/utils/getConfig.ts`):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Main backend API |
| `NEXT_PUBLIC_STORAGE_URL` | Storage/image base URL |
| `NEXT_PUBLIC_MAIN_URL` | App base URL |
| `NEXT_PUBLIC_DOMAIN` | Cookie domain (`.<domain>`) — cookies are `secure`, so local auth needs a real domain |

`NEXT_PUBLIC_API_URL_2` appears in `.env.local.example`/README but is **not used** anywhere in code — do not wire it up expecting a second API client.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
