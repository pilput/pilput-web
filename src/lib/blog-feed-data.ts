/** Shared page size for blog listing and home feed (client-fetched). */
export const postsPerPage = 10;

/** `page` query is 1-based in the URL; returns 0-based index for API offset math. */
export function parseBlogPageQueryParam(raw: string | null): number {
  if (raw == null || raw === "") return 0;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return 0;
  return Math.max(0, n - 1);
}
