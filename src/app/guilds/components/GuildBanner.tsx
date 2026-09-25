"use client";

import { memo, useMemo } from "react";
import { cn } from "cn";

/** FNV-1a: a stable 32-bit seed from the guild id. */
function hashString(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Small seeded PRNG (mulberry32) so a guild always draws the same banner. */
function seededRandom(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RING_COUNT = 7;

function buildArt(guildId: string) {
  const rand = seededRandom(hashString(guildId));

  // Primary-tinted glows over a muted base, so the banner follows the theme.
  const blobs = [22, 16, 12].map((strength) => {
    const x = Math.round(rand() * 100);
    const y = Math.round(rand() * 100);
    const size = Math.round(40 + rand() * 35);
    return `radial-gradient(${size}% ${size * 1.6}% at ${x}% ${y}%, color-mix(in oklch, var(--primary) ${strength}%, transparent), transparent 70%)`;
  });

  // Concentric topographic rings around one off-centre point.
  const cx = 700 + rand() * 400;
  const cy = 60 + rand() * 180;
  const rings = Array.from({ length: RING_COUNT }, (_, i) => {
    const r = 60 + i * 70 + rand() * 20;
    return { r, ry: r * (0.55 + rand() * 0.2) };
  });

  return { background: blobs.join(", "), cx, cy, rings };
}

/** Decorative banner for a guild, derived from its id. Purely visual. */
export const GuildBanner = memo(function GuildBanner({
  guildId,
  className,
}: {
  guildId: string;
  /** Sizing override; defaults to the detail-page hero height. */
  className?: string;
}) {
  const art = useMemo(() => buildArt(guildId), [guildId]);

  return (
    <div aria-hidden className={cn("relative h-32 sm:h-44 overflow-hidden bg-muted", className)}>
      <div className="absolute inset-0" style={{ backgroundImage: art.background }} />
      <svg
        className="absolute inset-0 h-full w-full text-foreground opacity-[0.09] dark:opacity-[0.12]"
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYMid slice"
      >
        {art.rings.map((ring, i) => (
          <ellipse
            key={i}
            cx={art.cx}
            cy={art.cy}
            rx={ring.r}
            ry={ring.ry}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.25}
          />
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card/80 to-transparent" />
    </div>
  );
});
