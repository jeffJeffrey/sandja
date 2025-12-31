// src/components/3d/animated-pattern.tsx
"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";

// Forme géométrique de base - Losange africain
function DiamondShape({
  position,
  color,
  scale = 1,
  rotationSpeed = 1
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  rotationSpeed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * rotationSpeed * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed * 0.3;
    }
  });
  
  return (
    <Float speed={2} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={color}
          metalness={0.5}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

// Zigzag 3D animé - Version sans Line de drei
function ZigzagLine({
  startY = 2,
  color = "#DAA520",
  amplitude = 0.5,
  speed = 1
}: {
  startY?: number;
  color?: string;
  amplitude?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Créer la géométrie du tube zigzag
  const tubeGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < 20; i++) {
      const x = (i - 10) * 0.5;
      const y = startY + (i % 2 === 0 ? amplitude : -amplitude);
      points.push(new THREE.Vector3(x, y, 0));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 64, 0.02, 8, false);
  }, [startY, amplitude]);

  useFrame((state) => {
    if (meshRef.current) {
      // Animation ondulante sur Z
      const positions = meshRef.current.geometry.attributes.position;
      const originalPositions = tubeGeometry.attributes.position;
      
      for (let i = 0; i < positions.count; i++) {
        const x = originalPositions.getX(i);
        const z = Math.sin(state.clock.elapsedTime * speed + x * 0.5) * 0.1;
        positions.setZ(i, originalPositions.getZ(i) + z);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} geometry={tubeGeometry}>
      <meshStandardMaterial
        color={color}
        metalness={0.3}
        roughness={0.5}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

// Version alternative simple avec des sphères connectées
function ZigzagDots({
  startY = 2,
  color = "#DAA520",
  amplitude = 0.5,
  speed = 1
}: {
  startY?: number;
  color?: string;
  amplitude?: number;
  speed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 20; i++) {
      const x = (i - 10) * 0.5;
      const y = startY + (i % 2 === 0 ? amplitude : -amplitude);
      pts.push([x, y, 0]);
    }
    return pts;
  }, [startY, amplitude]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.z = Math.sin(state.clock.elapsedTime * speed + i * 0.5) * 0.2;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {points.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// Cercles concentriques animés (motif Ndop)
function ConcentricCircles() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });
  
  return (
    <group ref={groupRef}>
      {[0.5, 0.8, 1.1, 1.4, 1.7].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#4169E1" : "#DAA520"}
            transparent
            opacity={0.6 - i * 0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// Triangle africain rotatif
function RotatingTriangle({
  position,
  scale = 1,
  color = "#B22222"
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });
  
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.5);
    s.lineTo(-0.433, -0.25);
    s.lineTo(0.433, -0.25);
    s.closePath();
    return s;
  }, []);
  
  return (
    <Float speed={3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial
          color={color}
          side={THREE.DoubleSide}
          metalness={0.3}
          roughness={0.6}
        />
      </mesh>
    </Float>
  );
}

// Grille de motifs - avec useMemo stable
function PatternGrid() {
  const patterns = useMemo(() => {
    const items: { position: [number, number, number]; color: string; type: string; scale: number; rotationSpeed: number }[] = [];
    const colors = ["#8B4513", "#DAA520", "#4169E1", "#B22222", "#228B22"];
    
    // Utiliser un seed fixe pour éviter les changements à chaque render
    let seed = 12345;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    
    for (let x = -2; x <= 2; x++) {
      for (let y = -2; y <= 2; y++) {
        if (random() > 0.3) {
          items.push({
            position: [x * 1.5, y * 1.5, random() * 0.5 - 0.25],
            color: colors[Math.floor(random() * colors.length)],
            type: random() > 0.5 ? "diamond" : "triangle",
            scale: 0.4 + random() * 0.3,
            rotationSpeed: 0.5 + random() * 0.5
          });
        }
      }
    }
    return items;
  }, []);
  
  return (
    <group>
      {patterns.map((item, i) => (
        item.type === "diamond" ? (
          <DiamondShape
            key={i}
            position={item.position}
            color={item.color}
            scale={item.scale}
            rotationSpeed={item.rotationSpeed}
          />
        ) : (
          <RotatingTriangle
            key={i}
            position={item.position}
            color={item.color}
            scale={item.scale}
          />
        )
      ))}
    </group>
  );
}

// Scène principale
function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#FFF8DC" />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#DAA520" />
      
      <group ref={groupRef}>
        <ConcentricCircles />
        <PatternGrid />
        <ZigzagLine startY={3} color="#8B4513" />
        <ZigzagLine startY={-3} color="#DAA520" amplitude={0.3} speed={1.5} />
      </group>
      
      <Environment preset="studio" />
    </>
  );
}

export function AnimatedPattern3D({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full min-h-100 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}