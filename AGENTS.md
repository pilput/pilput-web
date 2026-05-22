# AGENTS.md

## Commands

```bash
bun run dev       # dev server (http://localhost:3000)
bun run build     # production build
bun run lint      # ESLint (next/core-web-vitals)
bunx tsc --noEmit # type-check (no script in package.json)
```

No test runner is configured.

## Architecture

- **Next.js 16+ App Router** — all routes under `src/app/` using the app directory convention
- **Two separate API backends**:
  - `apiClient` → `NEXT_PUBLIC_API_URL` (posts, tags, uploads, views)
  - `apiClientApp` → `NEXT_PUBLIC_API_URL_2` (auth, users, chat, holdings, feed)
  - Both are thin wrappers around native `fetch` (in `src/utils/fetch.ts`), not Axios
- **Auth**: JWT token stored in cookies via `cookies-next`; see `src/utils/Auth.ts`
- **State**: Zustand stores in `src/stores/`
- **Forms**: React Hook Form + Zod schemas in `src/lib/validation.ts`
- **Rich text**: TipTap editor (extensions in `src/lib/` for code highlighting with Prism)
- **UI components**: Shadcn UI (new-york style, `src/components/ui/`); add new ones via `npx shadcn@latest add <name>`

## Conventions

- Path alias: `@/*` maps to `./src/*`
- Tailwind CSS **v4** syntax: `@import "tailwindcss"`, `@plugin`, `@custom-variant` — do not use v3 `@tailwind` directives or `tailwind.config.*`
- Dark mode: `.dark` class on ancestor (via `@custom-variant dark`), managed by `next-themes`
- Global styles: `src/app/global.css`
- Style utilities: `cn()` from `@/lib/utils` (clsx + tailwind-merge)
- Form validation schemas must be defined in `src/lib/validation.ts` with Zod, not inline

## Environment

Copy `.env.local.example` to `.env.local`. Required vars:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Main API (public content) |
| `NEXT_PUBLIC_API_URL_2` | App API (auth, users, chat, holdings) |
| `NEXT_PUBLIC_STORAGE_URL` | Storage/image base URL |
| `NEXT_PUBLIC_MAIN_URL` | App base URL |
| `NEXT_PUBLIC_DOMAIN` | Domain for cookie scoping |

Defaults are set in `src/utils/getConfig.ts` and will work without `.env.local` for development against the production APIs.