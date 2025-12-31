// src/components/3d/africa-globe.tsx
"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Sphere, 
  Html, 
  OrbitControls,
  Sparkles,
  QuadraticBezierLine
} from "@react-three/drei";
import * as THREE from "three";

interface RegionMarker {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  color: string;
  pagnesCount: number;
}

const REGIONS: RegionMarker[] = [
  { id: "cameroon-west", name: "Pays Bamiléké", country: "Cameroun", lat: 5.45, lng: 10.42, color: "#4169E1", pagnesCount: 45 },
  { id: "ghana", name: "Ashanti", country: "Ghana", lat: 6.68, lng: -1.62, color: "#DAA520", pagnesCount: 38 },
  { id: "mali", name: "Pays Dogon", country: "Mali", lat: 14.35, lng: -3.56, color: "#8B4513", pagnesCount: 22 },
  { id: "nigeria", name: "Yoruba", country: "Nigeria", lat: 7.37, lng: 3.94, color: "#228B22", pagnesCount: 31 },
  { id: "senegal", name: "Casamance", country: "Sénégal", lat: 12.58, lng: -16.27, color: "#B22222", pagnesCount: 18 },
  { id: "drc", name: "Kuba", country: "RD Congo", lat: -4.03, lng: 21.75, color: "#9333EA", pagnesCount: 27 },
  { id: "ethiopia", name: "Habesha", country: "Éthiopie", lat: 9.03, lng: 38.74, color: "#059669", pagnesCount: 15 },
  { id: "cote-ivoire", name: "Baoulé", country: "Côte d'Ivoire", lat: 7.54, lng: -5.54, color: "#F59E0B", pagnesCount: 24 },
];

// Convertir lat/lng en position 3D sur une sphère
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

// Convertir Vector3 en tuple
function vectorToTuple(v: THREE.Vector3): [number, number, number] {
  return [v.x, v.y, v.z];
}

// Marqueur de région
function RegionPin({ 
  region, 
  radius,
  onSelect,
  isSelected
}: { 
  region: RegionMarker;
  radius: number;
  onSelect: (region: RegionMarker | null) => void;
  isSelected: boolean;
}) {
  const position = useMemo(() => 
    latLngToVector3(region.lat, region.lng, radius + 0.1),
    [region.lat, region.lng, radius]
  );
  
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      const scale = hovered || isSelected ? 1.5 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <group position={position}>
      {/* Pin glow */}
      <pointLight 
        intensity={hovered || isSelected ? 2 : 0.5} 
        color={region.color} 
        distance={1}
      />
      
      {/* Pin mesh */}
      <mesh
        ref={meshRef}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={() => onSelect(isSelected ? null : region)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={region.color}
          emissive={region.color}
          emissiveIntensity={hovered || isSelected ? 1 : 0.5}
        />
      </mesh>
      
      {/* Pulse ring */}
      {(hovered || isSelected) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.1, 0.15, 32]} />
          <meshBasicMaterial 
            color={region.color} 
            transparent 
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Label */}
      {(hovered || isSelected) && (
        <Html distanceFactor={6} center style={{ pointerEvents: "none" }}>
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg whitespace-nowrap transform -translate-y-8">
            <div className="font-semibold text-gray-900 text-sm">{region.name}</div>
            <div className="text-xs text-gray-500">{region.country}</div>
            <div className="text-xs font-medium mt-1" style={{ color: region.color }}>
              {region.pagnesCount} pagnes
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Globe terrestre stylisé
function Globe({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Globe base */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>
      
      {/* Grille */}
      <Sphere args={[2.01, 32, 32]}>
        <meshBasicMaterial
          color="#DAA520"
          wireframe
          transparent
          opacity={0.1}
        />
      </Sphere>
      
      {/* Contour Afrique (simplifié) */}
      <Sphere args={[2.02, 32, 32]}>
        <meshBasicMaterial
          color="#8B4513"
          wireframe
          transparent
          opacity={0.05}
        />
      </Sphere>
      
      {children}
    </group>
  );
}

// Ligne de connexion simple utilisant mesh + tubeGeometry
function ConnectionLine({ 
  start, 
  end 
}: { 
  start: THREE.Vector3; 
  end: THREE.Vector3;
}) {
  const mid = useMemo(() => {
    return start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.5);
  }, [start, end]);

  return (
    <QuadraticBezierLine
      start={vectorToTuple(start)}
      mid={vectorToTuple(mid)}
      end={vectorToTuple(end)}
      color="#DAA520"
      lineWidth={1}
      transparent
      opacity={0.4}
    />
  );
}

// Connexions entre régions
function RegionConnections({ selectedRegion }: { selectedRegion: RegionMarker | null }) {
  const connections = useMemo(() => {
    if (!selectedRegion) return [];
    
    return REGIONS
      .filter(r => r.id !== selectedRegion.id)
      .slice(0, 3)
      .map(region => ({
        id: region.id,
        start: latLngToVector3(selectedRegion.lat, selectedRegion.lng, 2.1),
        end: latLngToVector3(region.lat, region.lng, 2.1),
      }));
  }, [selectedRegion]);

  if (!selectedRegion) return null;
  
  return (
    <>
      {connections.map(({ id, start, end }) => (
        <ConnectionLine key={id} start={start} end={end} />
      ))}
    </>
  );
}

// Scène principale
function Scene({ 
  onSelectRegion, 
  selectedRegion 
}: { 
  onSelectRegion: (region: RegionMarker | null) => void;
  selectedRegion: RegionMarker | null;
}) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#FFF8DC" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4169E1" />
      
      <Globe>
        {REGIONS.map(region => (
          <RegionPin
            key={region.id}
            region={region}
            radius={2}
            onSelect={onSelectRegion}
            isSelected={selectedRegion?.id === region.id}
          />
        ))}
        <RegionConnections selectedRegion={selectedRegion} />
      </Globe>
      
      <Sparkles
        count={100}
        scale={10}
        size={2}
        speed={0.3}
        color="#DAA520"
        opacity={0.5}
      />
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={4}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}

// Types exportés
export type { RegionMarker };

export function AfricaGlobe3D({ 
  className = "",
  onSelectRegion
}: { 
  className?: string;
  onSelectRegion?: (region: RegionMarker | null) => void;
}) {
  const [selectedRegion, setSelectedRegion] = useState<RegionMarker | null>(null);

  const handleSelect = (region: RegionMarker | null) => {
    setSelectedRegion(region);
    onSelectRegion?.(region);
  };

  return (
    <div className={`relative w-full h-full min-h-125 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene onSelectRegion={handleSelect} selectedRegion={selectedRegion} />
      </Canvas>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
        <div className="text-sm font-semibold text-gray-900 mb-2">Régions textiles</div>
        <div className="space-y-1">
          {REGIONS.slice(0, 4).map(region => (
            <button 
              key={region.id}
              className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5 w-full text-left"
              onClick={() => handleSelect(selectedRegion?.id === region.id ? null : region)}
            >
              <div 
                className="w-2 h-2 rounded-full shrink-0" 
                style={{ backgroundColor: region.color }}
              />
              <span className="text-gray-600">{region.country}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}