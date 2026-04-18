"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, ContactShadows } from "@react-three/drei";
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

/** Soft vertical backdrop (studio wall) */
function Backdrop({ isDark }: { isDark: boolean }) {
  const top = isDark ? "#1c1917" : "#faf7f2";
  const bottom = isDark ? "#0c0a09" : "#ede8e0";
  return (
    <mesh position={[0, 0.4, -3.8]} receiveShadow>
      <planeGeometry args={[14, 9]} />
      <meshStandardMaterial
        color={top}
        roughness={1}
        metalness={0}
        emissive={new THREE.Color(bottom)}
        emissiveIntensity={isDark ? 0.35 : 0.2}
      />
    </mesh>
  );
}

/** Wood-grain tone desk surface */
function DeskSurface({ isDark }: { isDark: boolean }) {
  return (
    <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[16, 10]} />
      <meshStandardMaterial
        color={isDark ? "#292524" : "#d6c8b4"}
        roughness={0.92}
        metalness={0.04}
      />
    </mesh>
  );
}

/** Loose sheets under the main note */
function PaperStack({ isDark }: { isDark: boolean }) {
  const c = isDark ? "#3f3a36" : "#f5f0e6";
  return (
    <group position={[-0.05, -0.38, 0.32]}>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[i * 0.04, i * 0.012, -i * 0.015]}
          rotation={[0.1 - i * 0.02, -0.22 + i * 0.03, 0.04 + i * 0.02]}
          receiveShadow
        >
          <boxGeometry args={[2.15, 2.7, 0.018]} />
          <meshStandardMaterial color={c} roughness={0.9} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

/** Ruled notebook page */
function NotePaper({ isDark }: { isDark: boolean }) {
  const paper = isDark ? "#44403c" : "#fffef8";
  const line = isDark ? "#57534e" : "#e7e5e4";
  const margin = isDark ? "#78716c" : "#d6d3d1";

  return (
    <group position={[-0.12, -0.32, 0.42]} rotation={[0.1, -0.24, 0.05]} castShadow>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.05, 2.55, 0.04]} />
        <meshStandardMaterial
          color={paper}
          roughness={0.88}
          metalness={0.02}
          emissive={isDark ? "#292524" : "#fafaf9"}
          emissiveIntensity={isDark ? 0.06 : 0.03}
        />
      </mesh>
      <mesh position={[-0.82, 0, 0.022]}>
        <boxGeometry args={[0.018, 2.42, 0.002]} />
        <meshStandardMaterial color={margin} roughness={0.9} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => {
        const y = -0.95 + i * 0.21;
        return (
          <mesh key={i} position={[0.06, y, 0.022]}>
            <boxGeometry args={[1.78, 0.006, 0.002]} />
            <meshStandardMaterial color={line} roughness={0.95} transparent opacity={0.55} />
          </mesh>
        );
      })}
      {Array.from({ length: 8 }, (_, i) => {
        const y = 1.02 - i * 0.28;
        return (
          <mesh key={i} position={[-0.95, y, 0.026]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.042, 0.042, 0.055, 14]} />
            <meshStandardMaterial color="#78716c" metalness={0.3} roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Fountain pen */
function Pen({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reducedMotion || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.z = Math.sin(t * 0.7) * 0.025;
    ref.current.position.y = 0.06 + Math.sin(t * 0.9) * 0.018;
  });

  return (
    <group
      ref={ref}
      position={[0.42, 0.08, 1.02]}
      rotation={[0.06, 0.12, -0.52]}
      scale={1}
      castShadow
    >
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.052, 0.058, 0.4, 18]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.45} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.058, 0.055, 0.36, 18]} />
        <meshStandardMaterial color="#2563eb" metalness={0.55} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.78, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.048, 0.11, 18]} />
        <meshStandardMaterial color="#172554" metalness={0.5} roughness={0.32} />
      </mesh>
      <mesh position={[0.065, 0.58, 0]} rotation={[0, 0, 0.12]} castShadow>
        <boxGeometry args={[0.016, 0.36, 0.05]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.22} />
      </mesh>
      <mesh position={[0, -0.26, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.032, 0.12, 14]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.38, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[0.026, 0.085, 8]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.85} roughness={0.18} />
      </mesh>
      <mesh position={[0, -0.44, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[0.01, 0.035, 6]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.25}
          roughness={0.45}
          emissive="#0f172a"
          emissiveIntensity={0.12}
        />
      </mesh>
    </group>
  );
}

function Mug({ isDark }: { isDark: boolean }) {
  const body = isDark ? "#44403c" : "#e7e5e4";
  return (
    <group position={[-1.55, -0.55, 0.9]} castShadow>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.2, 0.38, 24]} />
        <meshStandardMaterial color={body} roughness={0.55} metalness={0.08} />
      </mesh>
      <mesh position={[0.26, 0.02, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <torusGeometry args={[0.12, 0.028, 10, 24, Math.PI * 1.1]} />
        <meshStandardMaterial color={body} roughness={0.55} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.19, 0.17, 0.04, 20]} />
        <meshStandardMaterial color="#1c1917" roughness={0.3} metalness={0.15} />
      </mesh>
    </group>
  );
}

function Pencil() {
  return (
    <group position={[-0.95, -0.72, 1.05]} rotation={[0.05, 0.2, 1.15]} castShadow>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.55, 10]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.65} metalness={0} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <coneGeometry args={[0.03, 0.08, 8]} />
        <meshStandardMaterial color="#ca8a04" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.32, 0]}>
        <cylinderGeometry args={[0.03, 0.032, 0.06, 10]} />
        <meshStandardMaterial color="#fca5a5" roughness={0.7} metalness={0} />
      </mesh>
    </group>
  );
}

function DeskScene({
  isDark,
  reducedMotion,
}: {
  isDark: boolean;
  reducedMotion: boolean;
}) {
  const floatProps = reducedMotion
    ? { speed: 0, rotationIntensity: 0, floatIntensity: 0 }
    : { speed: 0.75, rotationIntensity: 0.2, floatIntensity: 0.65 };

  return (
    <group>
      <Backdrop isDark={isDark} />
      <DeskSurface isDark={isDark} />

      <ContactShadows
        position={[0, -1.34, 0]}
        opacity={isDark ? 0.45 : 0.32}
        scale={12}
        blur={2.8}
        far={5}
        color="#000000"
      />

      <Mug isDark={isDark} />
      <Pencil />

      <Float {...floatProps}>
        <group>
          <PaperStack isDark={isDark} />
          <NotePaper isDark={isDark} />
          <Pen reducedMotion={reducedMotion} />
        </group>
      </Float>
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
  const fogColor = isDark ? "#141110" : "#f4efe8";
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.15, 5.4]} fov={40} />
      <fog attach="fog" args={[fogColor, 6, 14]} />

      <ambientLight intensity={isDark ? 0.32 : 0.52} color={isDark ? "#44403c" : "#fff7ed"} />
      <directionalLight
        castShadow
        position={[4.5, 7, 5]}
        intensity={isDark ? 0.55 : 0.85}
        color="#ffedd5"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-4, 3, 2]} intensity={isDark ? 0.18 : 0.28} color="#bfdbfe" />
      <pointLight position={[2, 1.5, 4]} intensity={isDark ? 0.25 : 0.35} color="#fef3c7" distance={12} decay={2} />

      <DeskScene isDark={isDark} reducedMotion={reducedMotion} />
    </>
  );
}

const HeroBackground = () => {
  const { resolvedTheme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className="absolute inset-0 z-0 opacity-[0.68] dark:opacity-[0.78] pointer-events-none motion-reduce:opacity-50"
      aria-hidden
    >
      <Canvas
        dpr={[1, 1.75]}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <HeroScene isDark={isDark} reducedMotion={reducedMotion} />
      </Canvas>
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-amber-50/30 via-transparent to-background/85 dark:from-stone-950/40 dark:via-transparent dark:to-background/92"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_35%,transparent_0%,var(--background)_78%)] opacity-90"
        aria-hidden
      />
    </div>
  );
};

export default HeroBackground;
