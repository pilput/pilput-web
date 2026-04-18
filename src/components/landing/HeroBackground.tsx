"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Sparkles, Stars } from "@react-three/drei";
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
    group.current.rotation.y += delta * 0.03;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      Math.sin(performance.now() * 0.0001) * 0.025,
      0.012,
    );
  });

  return <group ref={group}>{children}</group>;
}

/** Ruled notebook page (thin box + line accents) */
function NotePaper({ isDark }: { isDark: boolean }) {
  const paper = isDark ? "#44403c" : "#fefce8";
  const line = isDark ? "#57534e" : "#e7e5e4";
  const margin = isDark ? "#78716c" : "#d6d3d1";

  return (
    <group position={[-0.15, -0.35, 0.35]} rotation={[0.12, -0.28, 0.06]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.1, 2.65, 0.045]} />
        <meshStandardMaterial
          color={paper}
          roughness={0.88}
          metalness={0.02}
          emissive={isDark ? "#292524" : "#fafaf9"}
          emissiveIntensity={isDark ? 0.08 : 0.04}
        />
      </mesh>
      {/* Left margin */}
      <mesh position={[-0.85, 0, 0.024]}>
        <boxGeometry args={[0.02, 2.5, 0.002]} />
        <meshStandardMaterial color={margin} roughness={0.9} />
      </mesh>
      {/* Ruled lines */}
      {Array.from({ length: 11 }, (_, i) => {
        const y = -1.05 + i * 0.21;
        return (
          <mesh key={i} position={[0.08, y, 0.024]}>
            <boxGeometry args={[1.85, 0.008, 0.002]} />
            <meshStandardMaterial color={line} roughness={0.95} transparent opacity={0.65} />
          </mesh>
        );
      })}
      {/* Spiral binding holes */}
      {Array.from({ length: 8 }, (_, i) => {
        const y = 1.05 - i * 0.28;
        return (
          <mesh key={i} position={[-0.98, y, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.06, 16]} />
            <meshStandardMaterial color="#78716c" metalness={0.35} roughness={0.45} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Fountain-style pen resting on the note */
function Pen({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reducedMotion || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.z = Math.sin(t * 0.85) * 0.04;
    ref.current.position.y = 0.08 + Math.sin(t * 1.1) * 0.025;
  });

  return (
    <group
      ref={ref}
      position={[0.35, 0.12, 0.95]}
      rotation={[0.08, 0.15, -0.55]}
      scale={1.05}
    >
      {/* Grip / lower barrel */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.055, 0.062, 0.42, 20]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.45} roughness={0.35} />
      </mesh>
      {/* Upper barrel */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.062, 0.058, 0.38, 20]} />
        <meshStandardMaterial color="#2563eb" metalness={0.55} roughness={0.28} />
      </mesh>
      {/* Cap end */}
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.065, 0.05, 0.12, 20]} />
        <meshStandardMaterial color="#172554" metalness={0.5} roughness={0.32} />
      </mesh>
      {/* Clip */}
      <mesh position={[0.07, 0.62, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.018, 0.38, 0.055]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.22} />
      </mesh>
      {/* Section / nib holder */}
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.048, 0.035, 0.14, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.25} />
      </mesh>
      {/* Nib */}
      <mesh position={[0, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.028, 0.09, 8]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.85} roughness={0.18} />
      </mesh>
      {/* Ink tip highlight */}
      <mesh position={[0, -0.46, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.012, 0.04, 6]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.2}
          roughness={0.4}
          emissive="#0f172a"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
}

function PenAndNote({
  isDark,
  reducedMotion,
}: {
  isDark: boolean;
  reducedMotion: boolean;
}) {
  const floatProps = reducedMotion
    ? { speed: 0, rotationIntensity: 0, floatIntensity: 0 }
    : { speed: 1.1, rotationIntensity: 0.35, floatIntensity: 1.1 };

  return (
    <Float {...floatProps}>
      <group>
        <NotePaper isDark={isDark} />
        <Pen reducedMotion={reducedMotion} />
      </group>
    </Float>
  );
}

function HeroSceneContent({
  isDark,
  reducedMotion,
}: {
  isDark: boolean;
  reducedMotion: boolean;
}) {
  const sparkleColor = isDark ? "#c4b5fd" : "#93c5fd";

  return (
    <group>
      <Stars
        radius={95}
        depth={48}
        count={isDark ? 2200 : 900}
        factor={isDark ? 2.8 : 1.8}
        saturation={0.12}
        fade
        speed={reducedMotion ? 0 : 0.15}
      />

      <Sparkles
        count={reducedMotion ? 24 : 85}
        scale={14}
        size={reducedMotion ? 2 : 4.5}
        speed={reducedMotion ? 0 : 0.22}
        opacity={isDark ? 0.45 : 0.28}
        color={sparkleColor}
      />

      <PenAndNote isDark={isDark} reducedMotion={reducedMotion} />

      <mesh position={[0, 0, -5.5]} scale={[1, 0.4, 1]}>
        <sphereGeometry args={[3.2, 20, 20]} />
        <meshBasicMaterial
          color={isDark ? "#1e1b4b" : "#e0e7ff"}
          transparent
          opacity={isDark ? 0.1 : 0.07}
          depthWrite={false}
        />
      </mesh>
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
  const fogColor = isDark ? "#0c0a12" : "#e8ecf8";
  const fogNear = isDark ? 3.8 : 4.2;
  const fogFar = isDark ? 15 : 12.5;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5.5]} fov={42} />
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

      <ambientLight intensity={isDark ? 0.28 : 0.48} color="#e0e7ff" />
      <directionalLight position={[6, 8, 5]} intensity={isDark ? 0.5 : 0.55} color="#fef9c3" />
      <pointLight position={[-5, 2, 3]} intensity={isDark ? 0.45 : 0.3} color="#93c5fd" />
      <pointLight position={[4, -3, 2]} intensity={isDark ? 0.35 : 0.22} color="#a5b4fc" />

      <SceneRotation enabled={!reducedMotion}>
        <HeroSceneContent isDark={isDark} reducedMotion={reducedMotion} />
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
      className="absolute inset-0 z-0 opacity-[0.78] dark:opacity-[0.9] pointer-events-none motion-reduce:opacity-50"
      aria-hidden
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <HeroScene isDark={isDark} reducedMotion={reducedMotion} />
      </Canvas>
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-background/25 via-transparent to-background/82 dark:from-background/35 dark:to-background/92"
        aria-hidden
      />
    </div>
  );
};

export default HeroBackground;
