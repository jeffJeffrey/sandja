"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  RoundedBox,
  Text,
  Image,
  Float,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

interface Card3DProps {
  isFlipped: boolean;
  frontImage: string;
  title: string;
  onClick: () => void;
}

function Card3D({ isFlipped, frontImage, title, onClick }: Card3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Animation de flip
      const targetRotation = isFlipped ? Math.PI : 0;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation,
        0.1
      );

      // Effet de hover
      const targetScale = hovered ? 1.1 : 1;
      groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1);
      groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, 0.1);

      // Légère oscillation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Face avant */}
      <RoundedBox args={[2, 2.8, 0.1]} radius={0.1} smoothness={4} position={[0, 0, 0.051]}>
        <meshStandardMaterial color="#FFF8DC" roughness={0.3} />
      </RoundedBox>

      {/* Image sur la face avant */}
      <Image
        url={frontImage}
        position={[0, 0.2, 0.12]}
        scale={[1.6, 1.6]}
        transparent
      />

      {/* Titre */}
      <Text
        position={[0, -1.1, 0.12]}
        fontSize={0.15}
        color="#8B4513"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
      >
        {title}
      </Text>

      {/* Face arrière */}
      <RoundedBox args={[2, 2.8, 0.1]} radius={0.1} smoothness={4} position={[0, 0, -0.051]} rotation={[0, Math.PI, 0]}>
        <meshStandardMaterial color="#8B4513" roughness={0.5} />
      </RoundedBox>

      {/* Motif sur la face arrière */}
      <mesh position={[0, 0, -0.12]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Bordure dorée */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.1, 2.9, 0.05]} />
        <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

interface SymbolCard3DProps {
  image: string;
  title: string;
  className?: string;
}

export function SymbolCard3D({ image, title, className = "" }: SymbolCard3DProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className={`w-full aspect-3/4 cursor-pointer ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#DAA520" />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#FFF8DC" />

        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.1}>
          <Card3D
            isFlipped={isFlipped}
            frontImage={image}
            title={title}
            onClick={() => setIsFlipped(!isFlipped)}
          />
        </Float>

        <Environment preset="studio" />
      </Canvas>
    </motion.div>
  );
}

// Grille de cartes 3D
interface SymbolCards3DGridProps {
  symbols: Array<{
    id: string;
    image: string;
    name: string;
  }>;
}

export function SymbolCards3DGrid({ symbols }: SymbolCards3DGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {symbols.map((symbol) => (
        <SymbolCard3D
          key={symbol.id}
          image={symbol.image}
          title={symbol.name}
        />
      ))}
    </div>
  );
}
