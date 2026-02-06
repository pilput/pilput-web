"use client";

import { Canvas } from "@react-three/fiber";
import { Float, PerspectiveCamera, Sparkles, Torus, Icosahedron, MeshDistortMaterial } from "@react-three/drei";
import { useTheme } from "next-themes";

function AnimatedShapes() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Colors based on theme (approximate)
  const primaryColor = isDark ? "#ffffff" : "#000000";
  const accentColor = "#3b82f6"; // Blue-500

  return (
    <group>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Icosahedron args={[1, 0]} position={[-2, 1, -2]}>
          <MeshDistortMaterial
            color={accentColor}
            speed={2}
            distort={0.4}
            radius={1}
            wireframe
            transparent
            opacity={0.3}
          />
        </Icosahedron>
      </Float>

      <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
        <Torus args={[0.8, 0.2, 16, 100]} position={[2, -1, -1]} rotation={[0.5, 0, 0]}>
          <meshStandardMaterial
            color={primaryColor}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.15}
          />
        </Torus>
      </Float>

      <Float speed={3} rotationIntensity={1} floatIntensity={1.5}>
        <Icosahedron args={[0.5, 0]} position={[0, -2, 0]}>
          <MeshDistortMaterial
            color={accentColor}
            speed={4}
            distort={0.6}
            radius={1}
            transparent
            opacity={0.4}
          />
        </Icosahedron>
      </Float>

      <Sparkles
        count={50}
        scale={10}
        size={4}
        speed={0.4}
        opacity={0.5}
        color={primaryColor}
      />
    </group>
  );
}

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        <AnimatedShapes />
      </Canvas>
    </div>
  );
};

export default HeroBackground;
