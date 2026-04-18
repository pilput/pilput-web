"use client";

import { useRef, useEffect, useState, useMemo, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  PerspectiveCamera,
  Sparkles,
  Torus,
  Icosahedron,
  MeshDistortMaterial,
  Stars,
} from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function SceneRotation({
  children,
  enabled,
}: {
  children: ReactNode;
  enabled: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!enabled || !group.current) return;
    group.current.rotation.y += delta * 0.06;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      Math.sin(performance.now() * 0.00015) * 0.04,
      0.02,
    );
  });

  return <group ref={group}>{children}</group>;
}

function AnimatedShapes({
  isDark,
  reducedMotion,
}: {
  isDark: boolean;
  reducedMotion: boolean;
}) {
  const accent = useMemo(
    () => new THREE.Color(isDark ? "#7c9eff" : "#3b5bdb"),
    [isDark],
  );
  const neutral = useMemo(
    () => new THREE.Color(isDark ? "#e2e8f0" : "#1e293b"),
    [isDark],
  );

  const floatProps = reducedMotion
    ? { speed: 0, rotationIntensity: 0, floatIntensity: 0 }
    : { speed: 2, rotationIntensity: 1.5, floatIntensity: 2 };

  const floatPropsMid = reducedMotion
    ? { speed: 0, rotationIntensity: 0, floatIntensity: 0 }
    : { speed: 1.5, rotationIntensity: 2, floatIntensity: 1 };

  const floatPropsFast = reducedMotion
    ? { speed: 0, rotationIntensity: 0, floatIntensity: 0 }
    : { speed: 3, rotationIntensity: 1, floatIntensity: 1.5 };

  return (
    <group>
      {isDark && !reducedMotion ? (
        <Stars
          radius={80}
          depth={40}
          count={1800}
          factor={3}
          saturation={0.2}
          fade
          speed={0.25}
        />
      ) : null}

      <Float {...floatProps}>
        <Icosahedron args={[1, 0]} position={[-2.2, 0.9, -2.2]}>
          {reducedMotion ? (
            <meshStandardMaterial
              color={accent}
              wireframe
              transparent
              opacity={0.35}
              roughness={0.4}
              metalness={0.2}
            />
          ) : (
            <MeshDistortMaterial
              color={accent}
              speed={2}
              distort={0.35}
              radius={1}
              wireframe
              transparent
              opacity={0.32}
            />
          )}
        </Icosahedron>
      </Float>

      <Float {...floatPropsMid}>
        <Torus args={[0.85, 0.22, 20, 120]} position={[2.1, -0.9, -1.2]} rotation={[0.55, 0.2, 0]}>
          <meshStandardMaterial
            color={neutral}
            roughness={0.25}
            metalness={0.75}
            transparent
            opacity={isDark ? 0.12 : 0.1}
          />
        </Torus>
      </Float>

      <Float {...floatPropsFast}>
        <Icosahedron args={[0.55, 0]} position={[0.3, -1.8, 0.2]}>
          {reducedMotion ? (
            <meshStandardMaterial
              color={accent}
              transparent
              opacity={0.38}
              roughness={0.35}
              metalness={0.45}
            />
          ) : (
            <MeshDistortMaterial
              color={accent}
              speed={3.5}
              distort={0.5}
              radius={1}
              transparent
              opacity={0.42}
            />
          )}
        </Icosahedron>
      </Float>

      <Float {...floatPropsMid}>
        <Torus args={[0.38, 0.12, 12, 48]} position={[-1.4, -1.2, 0.8]} rotation={[1.1, 0.4, 0]}>
          <meshStandardMaterial
            color={accent}
            roughness={0.35}
            metalness={0.5}
            transparent
            opacity={0.18}
          />
        </Torus>
      </Float>

      <Sparkles
        count={reducedMotion ? 18 : 70}
        scale={12}
        size={reducedMotion ? 2.5 : 4.2}
        speed={reducedMotion ? 0 : 0.35}
        opacity={isDark ? 0.45 : 0.35}
        color={neutral}
      />
    </group>
  );
}

function HeroScene({
  isDark,
  reducedMotion,
}: {
  isDark: boolean;
  reducedMotion: boolean;
}) {
  const fogColor = isDark ? "#030712" : "#f1f5f9";
  const fogNear = isDark ? 4.5 : 5;
  const fogFar = isDark ? 14 : 12;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5.5]} fov={42} />
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

      <ambientLight intensity={isDark ? 0.35 : 0.55} />
      <directionalLight position={[6, 8, 4]} intensity={isDark ? 0.45 : 0.65} color="#93c5fd" />
      <spotLight
        position={[8, 6, 6]}
        angle={0.35}
        penumbra={1}
        intensity={isDark ? 0.9 : 0.55}
        color="#c4d4ff"
      />
      <pointLight position={[-8, -4, -4]} intensity={isDark ? 0.55 : 0.35} color={isDark ? "#6366f1" : "#94a3b8"} />

      <SceneRotation enabled={!reducedMotion}>
        <AnimatedShapes isDark={isDark} reducedMotion={reducedMotion} />
      </SceneRotation>
    </>
  );
}

const HeroBackground = () => {
  const { resolvedTheme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className="absolute inset-0 z-0 opacity-[0.72] dark:opacity-[0.85] pointer-events-none motion-reduce:opacity-50"
      aria-hidden
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <HeroScene isDark={isDark} reducedMotion={reducedMotion} />
      </Canvas>
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-background/20 via-transparent to-background/80 dark:from-background/30 dark:to-background/90"
        aria-hidden
      />
    </div>
  );
};

export default HeroBackground;
