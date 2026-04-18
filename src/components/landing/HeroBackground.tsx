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
    group.current.rotation.y += delta * 0.035;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      Math.sin(performance.now() * 0.00012) * 0.03,
      0.015,
    );
  });

  return <group ref={group}>{children}</group>;
}

/** Stylized Saturn-like world */
function RingedPlanet({
  position,
  reducedMotion,
}: {
  position: [number, number, number];
  reducedMotion: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (reducedMotion || !ref.current) return;
    ref.current.rotation.y += delta * 0.12;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.55, 28, 28]} />
        <meshStandardMaterial
          color="#c4a574"
          roughness={0.85}
          metalness={0.05}
          emissive="#6b4c1a"
          emissiveIntensity={0.08}
        />
      </mesh>
      <mesh rotation={[1.25, 0.4, 0]}>
        <torusGeometry args={[0.82, 0.04, 8, 64]} />
        <meshStandardMaterial
          color="#e8dcc8"
          transparent
          opacity={0.55}
          roughness={0.6}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/** Large gas giant with soft bands */
function GasGiant({
  position,
  reducedMotion,
}: {
  position: [number, number, number];
  reducedMotion: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (reducedMotion || !ref.current) return;
    ref.current.rotation.y += delta * 0.08;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.95, 36, 36]} />
      <meshStandardMaterial
        color="#3d4fc4"
        roughness={0.75}
        metalness={0.15}
        emissive="#1a237e"
        emissiveIntensity={0.12}
      />
    </mesh>
  );
}

/** Small rocky / desert moon */
function RockyPlanet({
  position,
  reducedMotion,
}: {
  position: [number, number, number];
  reducedMotion: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (reducedMotion || !ref.current) return;
    ref.current.rotation.y += delta * 0.18;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.32, 20, 20]} />
      <meshStandardMaterial
        color="#b45309"
        roughness={0.92}
        metalness={0.02}
        emissive="#451a03"
        emissiveIntensity={0.06}
      />
    </mesh>
  );
}

/** Cool ice-blue dwarf */
function IcePlanet({
  position,
  reducedMotion,
}: {
  position: [number, number, number];
  reducedMotion: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (reducedMotion || !ref.current) return;
    ref.current.rotation.y -= delta * 0.14;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.22, 18, 18]} />
      <meshStandardMaterial
        color="#38bdf8"
        roughness={0.35}
        metalness={0.25}
        emissive="#0284c7"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

/** Low-poly rocket: cone nose, body, window stripe, fins, engine glow */
function Rocket({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reducedMotion || !group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.z = Math.sin(t * 0.9) * 0.06;
    group.current.rotation.x = Math.sin(t * 0.4) * 0.04;
  });

  const floatProps = reducedMotion
    ? { speed: 0, rotationIntensity: 0, floatIntensity: 0 }
    : { speed: 1.2, rotationIntensity: 0.4, floatIntensity: 1.2 };

  return (
    <Float {...floatProps}>
      <group
        ref={group}
        position={[1.35, 0.15, 1.2]}
        rotation={[0.35, -0.85, -0.2]}
        scale={0.85}
      >
        {/* Nose */}
        <mesh position={[0, 0.72, 0]}>
          <coneGeometry args={[0.2, 0.42, 10]} />
          <meshStandardMaterial color="#f87171" metalness={0.35} roughness={0.45} />
        </mesh>
        {/* Body */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.19, 0.24, 0.78, 14]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.55} roughness={0.28} />
        </mesh>
        {/* Window */}
        <mesh position={[0, 0.22, 0.21]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial
            color="#1e3a8a"
            metalness={0.6}
            roughness={0.2}
            emissive="#3b82f6"
            emissiveIntensity={0.45}
          />
        </mesh>
        {/* Fins */}
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.sin(angle) * 0.2, -0.22, Math.cos(angle) * 0.2]}
            rotation={[0.25, angle, 0]}
          >
            <boxGeometry args={[0.06, 0.22, 0.18]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.5} />
          </mesh>
        ))}
        {/* Engine housing */}
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.14, 0.12, 0.16, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.35} />
        </mesh>
        {/* Thruster glow */}
        <mesh position={[0, -0.44, 0]}>
          <coneGeometry args={[0.1, 0.2, 12]} />
          <meshStandardMaterial
            color="#f97316"
            emissive="#ea580c"
            emissiveIntensity={1.2}
            transparent
            opacity={0.92}
          />
        </mesh>
      </group>
    </Float>
  );
}

function GalaxyContent({
  isDark,
  reducedMotion,
}: {
  isDark: boolean;
  reducedMotion: boolean;
}) {
  const sparkleColor = isDark ? "#c4b5fd" : "#818cf8";

  return (
    <group>
      <Stars
        radius={95}
        depth={48}
        count={isDark ? 2800 : 1400}
        factor={isDark ? 3.2 : 2.2}
        saturation={0.15}
        fade
        speed={reducedMotion ? 0 : 0.2}
      />

      <Sparkles
        count={reducedMotion ? 28 : 110}
        scale={14}
        size={reducedMotion ? 2 : 5}
        speed={reducedMotion ? 0 : 0.28}
        opacity={isDark ? 0.55 : 0.35}
        color={sparkleColor}
      />

      <GasGiant position={[-2.5, 0.2, -2.8]} reducedMotion={reducedMotion} />
      <RingedPlanet position={[2.2, -0.5, -1.5]} reducedMotion={reducedMotion} />
      <RockyPlanet position={[-0.8, -1.6, -0.2]} reducedMotion={reducedMotion} />
      <IcePlanet position={[0.4, 1.2, -2]} reducedMotion={reducedMotion} />

      {/* Distant halo */}
      <mesh position={[0, 0, -6]} scale={[1, 0.35, 1]}>
        <sphereGeometry args={[3.8, 24, 24]} />
        <meshBasicMaterial
          color={isDark ? "#312e81" : "#c7d2fe"}
          transparent
          opacity={isDark ? 0.12 : 0.08}
          depthWrite={false}
        />
      </mesh>

      <Rocket reducedMotion={reducedMotion} />
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
  const fogColor = isDark ? "#04030a" : "#dce3f7";
  const fogNear = isDark ? 4 : 4.5;
  const fogFar = isDark ? 16 : 13;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5.5]} fov={42} />
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

      <ambientLight intensity={isDark ? 0.22 : 0.4} color="#a5b4fc" />
      <directionalLight position={[8, 5, 4]} intensity={isDark ? 0.55 : 0.45} color="#fef3c7" />
      <pointLight position={[-6, -2, 2]} intensity={isDark ? 0.65 : 0.35} color="#818cf8" />
      <pointLight position={[4, -4, -3]} intensity={isDark ? 0.4 : 0.25} color="#38bdf8" />
      <spotLight
        position={[0, 6, 8]}
        angle={0.45}
        penumbra={0.85}
        intensity={isDark ? 0.35 : 0.2}
        color="#c4b5fd"
      />

      <SceneRotation enabled={!reducedMotion}>
        <GalaxyContent isDark={isDark} reducedMotion={reducedMotion} />
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
