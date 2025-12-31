"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Text3D,
  Center,
  Environment,
  MeshTransmissionMaterial,
  Sparkles,
  Cloud,
  Sky,
} from "@react-three/drei";
import * as THREE from "three";

// Masque africain 3D stylisé
function AfricanMask({ position = [0, 0, 0] as [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        {/* Visage principal */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.6, 1.2, 8, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.3} metalness={0.6} />
        </mesh>
        
        {/* Yeux */}
        <mesh position={[-0.25, 0.3, 0.5]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#1A1A1A" metalness={1} roughness={0} />
        </mesh>
        <mesh position={[0.25, 0.3, 0.5]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#1A1A1A" metalness={1} roughness={0} />
        </mesh>
        
        {/* Décorations dorées */}
        <mesh position={[0, 0.8, 0.3]}>
          <torusGeometry args={[0.15, 0.03, 8, 20]} />
          <meshStandardMaterial color="#DAA520" metalness={1} roughness={0.1} />
        </mesh>
        
        {/* Marques tribales */}
        {[-0.3, 0, 0.3].map((y, i) => (
          <mesh key={i} position={[0.55, y, 0.2]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
            <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Tambour africain (Djembé)
function Djembe({ position = [0, 0, 0] as [number, number, number], scale = 1 }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* Corps du tambour */}
      <mesh>
        <cylinderGeometry args={[0.4, 0.2, 0.8, 32]} />
        <meshStandardMaterial color="#5C4033" roughness={0.6} />
      </mesh>
      
      {/* Peau du tambour */}
      <mesh position={[0, 0.41, 0]}>
        <circleGeometry args={[0.4, 32]} />
        <meshStandardMaterial color="#F5DEB3" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Cordes décoratives */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 0.35,
            0,
            Math.sin((i / 8) * Math.PI * 2) * 0.35,
          ]}
        >
          <cylinderGeometry args={[0.015, 0.015, 0.85, 8]} />
          <meshStandardMaterial color="#D2691E" />
        </mesh>
      ))}
    </group>
  );
}

// Symbole Adinkra flottant
function AdinkraSymbol({ position = [0, 0, 0] as [number, number, number], symbol = "sankofa" }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.01;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  // Forme de coeur stylisé (Sankofa simplifié)
  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <torusKnotGeometry args={[0.3, 0.1, 100, 16, 2, 3]} />
        <MeshTransmissionMaterial
          color="#DAA520"
          thickness={0.5}
          roughness={0}
          transmission={0.9}
          ior={1.5}
          chromaticAberration={0.03}
        />
      </mesh>
    </Float>
  );
}

// Texte 3D SANDJA
function Logo3D() {
  return (
    <Center position={[0, 2.5, 0]}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.8}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          SANDJA
          <meshStandardMaterial 
            color="#DAA520" 
            metalness={1} 
            roughness={0.1}
            emissive="#8B4513"
            emissiveIntensity={0.2}
          />
        </Text3D>
      </Float>
    </Center>
  );
}

// Loader pour Suspense
function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#DAA520" wireframe />
    </mesh>
  );
}

// Scène complète
interface AfricanSceneProps {
  showMask?: boolean;
  showDjembe?: boolean;
  showSymbols?: boolean;
  showLogo?: boolean;
  className?: string;
}

export function AfricanScene({
  showMask = true,
  showDjembe = true,
  showSymbols = true,
  showLogo = false,
  className = "",
}: AfricanSceneProps) {
  return (
    <div className={`w-full h-full min-h-125 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#DAA520" />
          <pointLight position={[-10, 5, -10]} intensity={1} color="#D2691E" />
          <spotLight
            position={[0, 15, 0]}
            angle={0.4}
            penumbra={1}
            intensity={2}
            color="#FFF8DC"
            castShadow
          />

          {showLogo && <Logo3D />}
          {showMask && <AfricanMask position={[0, 0, 0]} />}
          {showDjembe && (
            <>
              <Djembe position={[-2.5, -1, -1]} scale={0.8} />
              <Djembe position={[2.5, -1, -1]} scale={0.6} />
            </>
          )}
          {showSymbols && (
            <>
              <AdinkraSymbol position={[3, 1.5, 0]} />
              <AdinkraSymbol position={[-3, 1, 0]} />
              <AdinkraSymbol position={[0, -2, 1]} />
            </>
          )}

          <Sparkles count={200} scale={15} size={3} speed={0.3} color="#DAA520" />
          
          <Cloud
            opacity={0.2}
            speed={0.2}
            position={[0, 5, -10]}
            scale={[5, 2, 2]}
          />

          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
}
