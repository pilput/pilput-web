"use client";

import { memo, useMemo } from "react";

/** FNV-1a: a stable 32-bit seed from the channel id. */
function hashString(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Small seeded PRNG (mulberry32) so a channel always draws the same art. */
function seededRandom(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WAVE_COUNT = 9;

function buildArt(channelId: string) {
  const rand = seededRandom(hashString(channelId));

  // Three soft neutral shades, tinted from the theme's text colour so they
  // stay monochrome and read as shadow in light mode, glow in dark mode.
  const blobs = [5, 4, 3].map((strength) => {
    const x = Math.round(rand() * 100);
    const y = Math.round(rand() * 100);
    const size = Math.round(45 + rand() * 30);
    return `radial-gradient(${size}% ${size}% at ${x}% ${y}%, color-mix(in oklch, var(--foreground) ${strength}%, transparent), transparent 70%)`;
  });

  // Loose horizontal contour lines across a 1200×800 canvas.
  const waves = Array.from({ length: WAVE_COUNT }, (_, i) => {
    const y = 40 + i * 85 + rand() * 30;
    const a = () => Math.round(30 + rand() * 90) * (rand() > 0.5 ? 1 : -1);
    return `M -40 ${y} C 260 ${y + a()}, 480 ${y + a()}, 720 ${y} S 1080 ${y + a()}, 1240 ${y + a() / 2}`;
  });

  return { background: blobs.join(", "), waves };
}

/**
 * Decorative abstract backdrop for a channel, derived from its id so every
 * channel has its own look. Sits behind the messages; purely visual.
 */
export const ChannelBackdrop = memo(function ChannelBackdrop({ channelId }: { channelId: string }) {
  const art = useMemo(() => buildArt(channelId), [channelId]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: art.background }} />
      <svg
        className="absolute inset-0 h-full w-full text-foreground opacity-[0.06] dark:opacity-[0.08]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 95%)",
        }}
      >
        {art.waves.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth={1.25} />
        ))}
      </svg>
    </div>
  );
});
