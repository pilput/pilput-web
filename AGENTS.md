# AGENTS.md

## Commands

```bash
bun install          # install deps (use bun, not npm)
bun run dev          # dev server (Next.js + Turbopack)
bun run build        # production build
bun run lint         # eslint (config: eslint.config.mjs, next/core-web-vitals)
bunx tsc --noEmit    # typecheck (run after lint, before committing)
```

Verification order: **lint → typecheck**. No test framework is configured.

## Environment Setup

Copy `.env.local.example` to `.env.local`. All env vars are `NEXT_PUBLIC_*` (client-side). Defaults in `src/utils/getConfig.ts` point to `*.pilput.net` so the app works without a local API.

## Architecture

- **Next.js 16 App Router** — all pages under `src/app/` (route groups: `[username]`, `blog/`, `chat/`, `dashboard/`, `posts/`, `profile/`)
- **Not a monorepo** — single package, single Next.js app
- **Path alias**: `@/` → `src/` (tsconfig.json)
- **CSS**: Tailwind CSS 4 with oklch color tokens in `src/app/global.css`; Shadcn UI (new-york style) in `src/components/ui/`
- **State**: Zustand stores in `src/stores/` — each file is `*Store.ts` exporting a named store (`authStore`, `postsStore`, `useChatStore`, etc.)

### Two API Clients

`src/utils/fetch.ts` defines two clients — choosing the wrong one is a common mistake:

- `apiClient` → `NEXT_PUBLIC_API_URL` (Echo API: public posts, tags, uploads, views)
- `apiClientApp` → `NEXT_PUBLIC_API_URL_2` (Hono/App API: auth, users, chat, holdings, feed, likes)

Authenticated requests require `headers: { Authorization: \`Bearer ${getToken()}\` }` — there is no automatic interceptor.

### Error Handling

`ErrorHandlerAPI` in `src/utils/ErrorHandler.ts` handles network errors and 401 (auto-logout + redirect). Wrap try/catch around API calls and call `ErrorHandlerAPI(error)` in the catch block — it returns `error.response` for further handling.

### Auth

- JWT token stored in cookie `token` (domain `.pilput.net`, set via `cookies-next`)
- `getToken()` / `RemoveToken()` in `src/utils/Auth.ts`
- `ErrorHandlerAPI` handles 401 by clearing cookie and redirecting to `/login`

### Chat Streaming

`useChatStore` in `src/stores/chat-store.ts` uses raw `fetch()` for SSE streaming (not `apiClient`). The endpoint is `${Config.apibaseurl2}/api/chat/conversations/${id}/messages/stream`.

### Form Validation

Zod schemas in `src/lib/validation.ts`. Export both the schema and inferred type:
```typescript
export const loginSchema = z.object({ ... });
export type LoginFormData = z.infer<typeof loginSchema>;
```
Use with `zodResolver(loginSchema)` from `@hookform/resolvers`.

## Key Conventions

- **Import order**: React → external libs → `@/` internals. Never use relative paths when `@/` works.
- **Shadcn UI**: add new primitives via `npx shadcn@latest add <component>` (configured in `components.json`); they land in `src/components/ui/`
- **Comments**: do not add comments unless asked
- **Types**: `src/types/` — `you.ts` is the auth/user type, `post.ts` is the post type
- **Utility helpers in `src/lib/utils.ts`**: `cn()`, `formatCurrency()`, `formatNumber()`, `formatThousandsForInput()`, `parseThousandsFromInput()`, `getPlatformColor()`, `getHoldingTypeColor()`
- **Dark mode**: uses `next-themes` with `ThemeProvider` in root layout; dark variant is `.dark` class on `<html>`

## Gotchas

- `apiClient` and `apiClientApp` are native `fetch` wrappers (not Axios). They throw `HttpError` with a `.response` shape — not Axios error shape.
- `ErrorHandlerAPI` checks `error.response` (Axios-style), but the actual clients throw `HttpError`. Both patterns coexist; be aware when reading error properties.
- Store files use `create<...>()((set) => ({ ... }))` Zustand pattern — note the double parentheses.
- `src/components/ui/` is Shadcn-managed — don't manually edit these unless intentionally customizing.
- Cookie domain is hardcoded to `.${Config.maindomain}` — for local dev this resolves to `.pilput.net`.