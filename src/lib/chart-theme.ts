/**
 * Single theme for ALL charts (recharts) across the app.
 *
 * Colors resolve to CSS vars defined in `src/app/global.css`
 * (`--chart-1` … `--chart-5`, oklch, light/dark aware).
 *
 * IMPORTANT: `--chart-*` already holds a full color value (oklch),
 * so use it directly as `var(--chart-1)`.
 * Do NOT wrap it in `hsl(...)` — that was the old shadcn convention
 * where the var only held HSL channels, and it produces an invalid
 * color with the current oklch tokens.
 *
 * Convention per chart type:
 * - 1 series (bar/line)            -> chart-1
 * - 2 series (primary vs secondary)-> chart-1 + chart-2
 * - 3 series                       -> chart-1 + chart-2 + chart-3
 * - categorical (pie/allocation)   -> chartColor(index) cycles 1..5
 * - previous vs current (compare)  -> chart-2 (muted/previous) + chart-1 (current)
 */

export const CHART_COLORS = {
  primary: "var(--chart-1)",
  secondary: "var(--chart-2)",
  tertiary: "var(--chart-3)",
  quaternary: "var(--chart-4)",
  quinary: "var(--chart-5)",
} as const;

/** Ordered palette for multi-series charts. */
export const CHART_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.tertiary,
  CHART_COLORS.quaternary,
  CHART_COLORS.quinary,
] as const;

/** Categorical color by index — cycles through chart-1..5. */
export function chartColor(index: number): string {
  return `var(--chart-${(index % 5) + 1})`;
}

/** Shared grid / axis styling so every chart looks the same. */
export const CHART_GRID_STROKE = "rgba(148, 163, 184, 0.18)";
export const CHART_GRID_DASH = "3 3" as const;
