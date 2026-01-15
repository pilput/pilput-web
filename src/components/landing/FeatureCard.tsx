"use client";
import React, { useCallback, useEffect, useMemo, useRef, memo } from "react";
import { cn } from "@/lib/utils";

export type GlowColor = "primary" | "blue" | "purple" | "green" | "yellow";

interface FeatureCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
  "aria-label"?: string;
  "aria-describedby"?: string;
  glowColor?: GlowColor;
}

const getGlowColorClasses = (glowColor: GlowColor) => ({
  border: {
    primary: "bg-gradient-to-r from-primary/30 via-transparent to-primary/30",
    blue: "bg-gradient-to-r from-blue-500/30 via-transparent to-blue-500/30",
    purple: "bg-gradient-to-r from-purple-500/30 via-transparent to-purple-500/30",
    green: "bg-gradient-to-r from-green-500/30 via-transparent to-green-500/30",
    yellow: "bg-gradient-to-r from-yellow-500/30 via-transparent to-yellow-500/30",
  }[glowColor] || "bg-gradient-to-r from-primary/30 via-transparent to-primary/30",

  glow: {
    primary: "rgba(255,255,255,0.15)",
    blue: "rgba(59,130,246,0.15)",
    purple: "rgba(147,51,234,0.15)",
    green: "rgba(34,197,94,0.15)",
    yellow: "rgba(234,179,8,0.15)",
  }[glowColor] || "rgba(255,255,255,0.15)",

  particles: {
    primary: "bg-primary/40",
    blue: "bg-blue-500/40",
    purple: "bg-purple-500/40",
    green: "bg-green-500/40",
    yellow: "bg-yellow-500/40",
  }[glowColor] || "bg-primary/40",

  corner: {
    primary: "bg-gradient-to-bl from-primary/20 to-transparent",
    blue: "bg-gradient-to-bl from-blue-500/20 to-transparent",
    purple: "bg-gradient-to-bl from-purple-500/20 to-transparent",
    green: "bg-gradient-to-bl from-green-500/20 to-transparent",
    yellow: "bg-gradient-to-bl from-yellow-500/20 to-transparent",
  }[glowColor] || "bg-gradient-to-bl from-primary/20 to-transparent",
});

const PARTICLE_INDEXES = [0, 1, 2, 3, 4, 5];

export const FeatureCard: React.FC<FeatureCardProps> = memo(
  ({
    children,
    className,
    onClick,
    role = "button",
    tabIndex = 0,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    glowColor = "primary",
    ...props
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const mousePositionRef = useRef({ x: 0, y: 0 });
    const rafIdRef = useRef<number | null>(null);
    const glowClasses = useMemo(() => getGlowColorClasses(glowColor), [glowColor]);

    const glowStyle = useMemo(
      () =>
        ({
          "--glow-color": glowClasses.glow,
        }) as React.CSSProperties,
      [glowClasses.glow]
    );

    const handleMouseMove = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        mousePositionRef.current = { x, y };

        if (rafIdRef.current !== null) return;

        rafIdRef.current = window.requestAnimationFrame(() => {
          if (!cardRef.current) return;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (mousePositionRef.current.y - centerY) / 10;
          const rotateY = (centerX - mousePositionRef.current.x) / 10;

          cardRef.current.style.setProperty("--rotate-x", `${rotateX}deg`);
          cardRef.current.style.setProperty("--rotate-y", `${rotateY}deg`);
          cardRef.current.style.setProperty(
            "--mouse-x",
            `${mousePositionRef.current.x}px`
          );
          cardRef.current.style.setProperty(
            "--mouse-y",
            `${mousePositionRef.current.y}px`
          );

          rafIdRef.current = null;
        });
      },
      []
    );

    const handleMouseLeave = useCallback(() => {
      if (!cardRef.current) return;
      cardRef.current.style.setProperty("--rotate-x", "0deg");
      cardRef.current.style.setProperty("--rotate-y", "0deg");
      cardRef.current.style.setProperty("--mouse-x", "50%");
      cardRef.current.style.setProperty("--mouse-y", "50%");
    }, []);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      },
      [onClick]
    );

    useEffect(() => {
      return () => {
        if (rafIdRef.current !== null) {
          window.cancelAnimationFrame(rafIdRef.current);
        }
      };
    }, []);

    return (
      <div
        ref={cardRef}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onKeyDown={handleKeyDown}
        onClick={onClick}
        role={role}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "group relative w-full overflow-hidden rounded-3xl",
          "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          // Glassmorphism base
          "bg-white/60 dark:bg-black/40 backdrop-blur-xl",
          // Border effects
          "border border-white/20 dark:border-white/10",
          // Shadow effects
          "shadow-lg shadow-black/5 dark:shadow-white/5",
          // 3D transform effects
          "transform-gpu transition-all duration-500 ease-out",
          "hover:scale-105 hover:shadow-2xl",
          "hover:shadow-primary/20 dark:hover:shadow-primary/30",
          // 3D perspective
          "hover:[transform:perspective(1000px)_rotateX(var(--rotate-x,0))_rotateY(var(--rotate-y,0))_translateZ(20px)]",
          className
        )}
        {...props}
      >
        {/* Animated gradient border */}
        <div
          className={cn(
            "absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500",
            "group-hover:opacity-100 group-focus-visible:opacity-100",
            glowClasses.border
          )}
        />

        {/* Dynamic glow effect that follows mouse */}
        <div
          className={cn(
            "pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 rounded-3xl",
            "group-hover:opacity-100 group-focus-visible:opacity-100"
          )}
          style={{
            ...glowStyle,
            background:
              "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--glow-color), transparent 40%)",
          }}
        />

        {/* Animated particles system */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {PARTICLE_INDEXES.map((index) => (
            <div
              key={index}
              className={cn(
                "absolute w-1 h-1 rounded-full opacity-0 transition-all duration-500",
                "group-hover:opacity-100 group-hover:animate-pulse",
                index % 2 === 0 && "top-1/4 left-1/4",
                index % 2 === 1 && "top-3/4 right-1/4",
                index === 2 && "bottom-1/4 left-1/2",
                glowClasses.particles
              )}
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: `${2 + index * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Corner accent lights */}
        <div
          className={cn(
            "absolute -top-1 -right-1 w-16 h-16 opacity-0 transition-opacity duration-500",
            "group-hover:opacity-100 group-focus-visible:opacity-100",
            glowClasses.corner
          )}
        />

        {children}
      </div>
    );
  }
);

interface FeatureListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const FeatureList: React.FC<FeatureListProps> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={cn(
      "relative flex flex-col w-full gap-8 sm:gap-12 lg:gap-16",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
