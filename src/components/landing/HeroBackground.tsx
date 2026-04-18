"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulseOffset: number;
}

const CONNECTION_DIST = 196;
const PARTICLE_COUNT = 98;

const HeroBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    let W = 0;
    let H = 0;
    let tick = 0;

    const isDark = resolvedTheme === "dark";
    // Primary accent – blue-500 equivalent
    const accentH = 217;
    const accentS = 91;
    const accentL = 60;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas!.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.56,
        vy: (Math.random() - 0.5) * 0.56,
        radius: Math.random() * 3.5 + 1.4,
        alpha: Math.random() * 0.5 + 0.2,
        pulseOffset: Math.random() * Math.PI * 2,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      tick++;

      const orbAlpha = isDark ? 0.17 : 0.31;
      const lineAlpha = isDark ? 0.25 : 0.42;
      const dotAlpha = isDark ? 0.84 : 1.0;

      // ── Big soft orbs ───────────────────────────────────────────────────
      const orbs = [
        { cx: W * 0.15, cy: H * 0.3,  r: W * 0.31 },
        { cx: W * 0.85, cy: H * 0.65, r: W * 0.25 },
        { cx: W * 0.5,  cy: H * 0.1,  r: W * 0.21 },
      ];
      for (const orb of orbs) {
        const g = ctx!.createRadialGradient(orb.cx, orb.cy, 0, orb.cx, orb.cy, orb.r);
        g.addColorStop(0, `hsla(${accentH},${accentS}%,${accentL}%,${orbAlpha})`);
        g.addColorStop(1, `hsla(${accentH},${accentS}%,${accentL}%,0)`);
        ctx!.beginPath();
        ctx!.arc(orb.cx, orb.cy, orb.r, 0, Math.PI * 2);
        ctx!.fillStyle = g;
        ctx!.fill();
      }

      // ── Update & draw particles ─────────────────────────────────────────
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        const pulse = 0.85 + 0.15 * Math.sin(tick * 0.025 + p.pulseOffset);
        const a = p.alpha * pulse * dotAlpha;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${accentH},${accentS}%,${isDark ? accentL + 20 : accentL - 10}%,${a})`;
        ctx!.fill();
      }

      // ── Connecting lines ────────────────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const fade = (1 - dist / CONNECTION_DIST) * lineAlpha;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = `hsla(${accentH},${accentS}%,${accentL}%,${fade})`;
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
          }
        }
      }

      // ── Radial vignette overlay (dark only) ───────────────────────────
      if (isDark) {
        const vg = ctx!.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, W * 0.75);
        vg.addColorStop(0, "transparent");
        vg.addColorStop(1, "rgba(0,0,0,0.35)");
        ctx!.fillStyle = vg;
        ctx!.fillRect(0, 0, W, H);
      }

      animId = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(() => {
      resize();
      spawnParticles();
    });
    ro.observe(canvas);

    resize();
    spawnParticles();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [resolvedTheme]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-98"
        aria-hidden="true"
      />
    </div>
  );
};

export default HeroBackground;
