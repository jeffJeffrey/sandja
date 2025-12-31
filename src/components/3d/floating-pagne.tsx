"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  MeshDistortMaterial,
  Sparkles,
  Stars,
  GradientTexture,
} from "@react-three/drei";
import * as THREE from "three";

function AfricanSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial
          speed={2}
          distort={0.4}
          radius={1}
          roughness={0.2}
          metalness={0.9}
        >
          <GradientTexture
            attach="map"
            stops={[0, 0.5, 1]}
            colors={["#8B4513", "#DAA520", "#D2691E"]}
          />
        </MeshDistortMaterial>
      </mesh>
    </Float>
  );
}

// Particules dorées
function GoldenParticles() {
  return (
    <Sparkles
      count={150}
      scale={10}
      size={4}
      speed={0.5}
      color="#DAA520"
      opacity={0.9}
    />
  );
}

// Anneaux orbitaux africains
function OrbitalRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (ring1Ref.current) ring1Ref.current.rotation.z = time * 0.5;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -time * 0.3;
    if (ring3Ref.current) ring3Ref.current.rotation.x = time * 0.4;
  });
  return (
    <group>
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.03, 16, 100]} />
        <meshStandardMaterial color="#DAA520" metalness={1} roughness={0.1} emissive="#DAA520" emissiveIntensity={0.3} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.6, 0.02, 16, 100]} />
        <meshStandardMaterial color="#D2691E" metalness={1} roughness={0.1} emissive="#D2691E" emissiveIntensity={0.2} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[3, 0.015, 16, 100]} />
        <meshStandardMaterial color="#B22222" metalness={1} roughness={0.1} emissive="#B22222" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

// Icosaèdre flottant (forme géométrique africaine)
function FloatingGem({ position, color, scale = 0.3 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
    }
  });
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  );
}

// Composant principal
interface FloatingPagneProps {
  variant?: "minimal" | "full";
  className?: string;
}

export function FloatingPagne({ variant = "full", className = "" }: FloatingPagneProps) {
  return (
    <div className={`w-full h-full min-h-100 ${className}`}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#DAA520" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#8B4513" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          color="#FFF8DC"
          castShadow
        />
        <AfricanSphere />
        <OrbitalRings />
        {variant === "full" && (
          <>
            <GoldenParticles />
            <FloatingGem position={[3, 1, -1]} color="#DAA520" scale={0.25} />
            <FloatingGem position={[-3, -1, -1]} color="#B22222" scale={0.2} />
            <FloatingGem position={[2, -2, 0]} color="#4169E1" scale={0.15} />
            <FloatingGem position={[-2, 2, 0]} color="#228B22" scale={0.18} />
            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
          </>
        )}
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}