"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  Text, 
  Float,
  Html,
  OrbitControls,
  Stars
} from "@react-three/drei";
import * as THREE from "three";

interface SymbolData {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

const SYMBOLS: SymbolData[] = [
  { id: "1", name: "Araignée", emoji: "🕷️", color: "#4169E1" },
  { id: "2", name: "Soleil", emoji: "☀️", color: "#DAA520" },
  { id: "3", name: "Lézard", emoji: "🦎", color: "#228B22" },
  { id: "4", name: "Masque", emoji: "🎭", color: "#8B4513" },
  { id: "5", name: "Tambour", emoji: "🪘", color: "#B22222" },
  { id: "6", name: "Éléphant", emoji: "🐘", color: "#6B7280" },
  { id: "7", name: "Lion", emoji: "🦁", color: "#F59E0B" },
  { id: "8", name: "Serpent", emoji: "🐍", color: "#059669" },
  { id: "9", name: "Oiseau", emoji: "🦅", color: "#7C3AED" },
  { id: "10", name: "Crocodile", emoji: "🐊", color: "#065F46" },
  { id: "11", name: "Tortue", emoji: "🐢", color: "#78716C" },
  { id: "12", name: "Étoile", emoji: "⭐", color: "#FBBF24" },
];

// Noeud de symbole individuel
function SymbolNode({ 
  symbol, 
  position, 
  onHover 
}: { 
  symbol: SymbolData;
  position: [number, number, number];
  onHover: (symbol: SymbolData | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <Float speed={2} floatIntensity={0.3}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={() => {
            setHovered(true);
            onHover(symbol);
          }}
          onPointerOut={() => {
            setHovered(false);
            onHover(null);
          }}
        >
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color={symbol.color}
            emissive={symbol.color}
            emissiveIntensity={hovered ? 0.5 : 0.2}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
        <Html center distanceFactor={8}>
          <div 
            className={`text-3xl transition-transform duration-200 cursor-pointer ${
              hovered ? "scale-150" : ""
            }`}
          >
            {symbol.emoji}
          </div>
        </Html>
      </group>
    </Float>
  );
}

// Distribution des symboles sur une sphère
function SymbolsOnSphere({ onHover }: { onHover: (symbol: SymbolData | null) => void }) {
  const positions = useMemo(() => {
    const radius = 3;
    return SYMBOLS.map((_, i) => {
      const phi = Math.acos(-1 + (2 * i) / SYMBOLS.length);
      const theta = Math.sqrt(SYMBOLS.length * Math.PI) * phi;
      return [
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
      ] as [number, number, number];
    });
  }, []);

  return (
    <group>
      {SYMBOLS.map((symbol, i) => (
        <SymbolNode
          key={symbol.id}
          symbol={symbol}
          position={positions[i]}
          onHover={onHover}
        />
      ))}
    </group>
  );
}

// Sphère centrale tournante
function CentralSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial
        color="#8B4513"
        wireframe
        emissive="#DAA520"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

// Scène complète
function Scene({ onHover }: { onHover: (symbol: SymbolData | null) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#FFF8DC" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#DAA520" />
      
      <group ref={groupRef}>
        <CentralSphere />
        <SymbolsOnSphere onHover={onHover} />
      </group>
      
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export function SymbolSphere3D({ className = "" }: { className?: string }) {
  const [hoveredSymbol, setHoveredSymbol] = useState<SymbolData | null>(null);

  return (
    <div className={`relative w-full h-full min-h-125 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene onHover={setHoveredSymbol} />
      </Canvas>
      
      {/* Info tooltip */}
      {hoveredSymbol && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow-african">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{hoveredSymbol.emoji}</span>
            <div>
              <div className="font-semibold text-gray-900">{hoveredSymbol.name}</div>
              <div className="text-sm text-gray-500">Cliquez pour explorer</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
