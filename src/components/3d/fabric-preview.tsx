// src/components/3d/fabric-preview.tsx
"use client";

import { useRef, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useTexture,
  Environment,
  OrbitControls,
  PresentationControls,
  ContactShadows,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ZoomIn, ZoomOut, Maximize2, X } from "lucide-react";

// Tissu 3D avec physique simulée
interface FabricMeshProps {
  textureUrl: string;
  shape: "flat" | "draped" | "folded";
}

function FabricMesh({ textureUrl, shape }: FabricMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(textureUrl || "/images/textures/placeholder-fabric.jpg");
  
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

  useFrame((state) => {
    if (meshRef.current && shape === "draped") {
      // Animation légère de flottement
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  const getGeometry = () => {
    switch (shape) {
      case "flat":
        return <planeGeometry args={[3, 2, 32, 32]} />;
      case "draped":
        return <planeGeometry args={[3, 2.5, 64, 64]} />;
      case "folded":
        return <boxGeometry args={[2, 0.3, 1.5, 16, 4, 16]} />;
      default:
        return <planeGeometry args={[3, 2, 32, 32]} />;
    }
  };

  return (
    <mesh 
      ref={meshRef} 
      position={[0, shape === "draped" ? 0.5 : 0, 0]}
      rotation={shape === "flat" ? [-Math.PI / 8, 0, 0] : [0, 0, 0]}
    >
      {getGeometry()}
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

// Fallback pour le chargement de texture
function FabricMeshFallback({ shape }: { shape: "flat" | "draped" | "folded" }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && shape === "draped") {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  const getGeometry = () => {
    switch (shape) {
      case "flat":
        return <planeGeometry args={[3, 2, 32, 32]} />;
      case "draped":
        return <planeGeometry args={[3, 2.5, 64, 64]} />;
      case "folded":
        return <boxGeometry args={[2, 0.3, 1.5, 16, 4, 16]} />;
      default:
        return <planeGeometry args={[3, 2, 32, 32]} />;
    }
  };

  return (
    <mesh 
      ref={meshRef} 
      position={[0, shape === "draped" ? 0.5 : 0, 0]}
      rotation={shape === "flat" ? [-Math.PI / 8, 0, 0] : [0, 0, 0]}
    >
      {getGeometry()}
      <meshStandardMaterial
        color="#D2691E"
        side={THREE.DoubleSide}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

// Wrapper avec Suspense pour la texture
function FabricWithTexture({ textureUrl, shape }: FabricMeshProps) {
  return (
    <Suspense fallback={<FabricMeshFallback shape={shape} />}>
      <FabricMesh textureUrl={textureUrl} shape={shape} />
    </Suspense>
  );
}

// Mannequin simple pour draper le tissu
function SimpleMannequin() {
  return (
    <group position={[0, -0.5, -0.5]}>
      {/* Torse */}
      <mesh position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
        <meshStandardMaterial color="#E8D5C4" roughness={0.6} />
      </mesh>
      {/* Cou */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.3, 16]} />
        <meshStandardMaterial color="#E8D5C4" roughness={0.6} />
      </mesh>
      {/* Tête (simplifiée) */}
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#E8D5C4" roughness={0.6} />
      </mesh>
      {/* Épaules */}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.08, 0.5, 8, 16]} />
        <meshStandardMaterial color="#E8D5C4" roughness={0.6} />
      </mesh>
    </group>
  );
}

// Contrôles de la scène
function SceneControls({ onReset }: { onReset: () => void }) {
  const { camera } = useThree();
  
  const handleZoomIn = useCallback(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.z = Math.max(camera.position.z - 1, 2);
    }
  }, [camera]);

  const handleZoomOut = useCallback(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.z = Math.min(camera.position.z + 1, 10);
    }
  }, [camera]);
  
  return (
    <Html position={[2.5, 1.5, 0]} center>
      <div className="flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <button
          onClick={onReset}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Réinitialiser la vue"
        >
          <RotateCcw className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom avant"
        >
          <ZoomIn className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom arrière"
        >
          <ZoomOut className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </Html>
  );
}

// Scène de prévisualisation
interface PreviewSceneProps {
  textureUrl: string;
  shape: "flat" | "draped" | "folded";
  showMannequin: boolean;
  onReset: () => void;
  controlsRef: React.RefObject<any>;
}

function PreviewScene({ textureUrl, shape, showMannequin, onReset, controlsRef }: PreviewSceneProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, 5, 5]} intensity={0.5} color="#FFF8DC" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.4}
        penumbra={1}
        intensity={1}
        castShadow
      />

      <PresentationControls
        global
        // config={{ mass: 2, tension: 500 }}
        snap
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <group>
          {showMannequin && <SimpleMannequin />}
          <FabricWithTexture textureUrl={textureUrl} shape={shape} />
        </group>
      </PresentationControls>

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={5}
        blur={2}
        far={4}
      />

      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
      />

      <SceneControls onReset={onReset} />
      
      <Environment preset="studio" />
    </>
  );
}

// Composant principal de prévisualisation
interface FabricPreviewProps {
  textureUrl: string;
  pagneName: string;
  className?: string;
  showMannequin?: boolean;
  initialShape?: "flat" | "draped" | "folded";
}

export function FabricPreview({
  textureUrl,
  pagneName,
  className = "",
  showMannequin = false,
  initialShape = "flat",
}: FabricPreviewProps) {
  const [shape, setShape] = useState<"flat" | "draped" | "folded">(initialShape);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsRef = useRef<any>(null);
  const fullscreenControlsRef = useRef<any>(null);

  const resetView = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  const resetFullscreenView = useCallback(() => {
    if (fullscreenControlsRef.current) {
      fullscreenControlsRef.current.reset();
    }
  }, []);

  const shapeOptions = [
    { value: "flat" as const, label: "Plat" },
    { value: "draped" as const, label: "Drapé" },
    { value: "folded" as const, label: "Plié" },
  ];

  return (
    <>
      <div className={`relative bg-linear-to-b from-gray-50 to-gray-100 rounded-2xl overflow-hidden ${className}`}>
        {/* Header avec nom du pagne */}
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
          <h3 className="font-semibold text-gray-900">{pagneName}</h3>
          <p className="text-xs text-gray-500">Prévisualisation 3D</p>
        </div>

        {/* Bouton fullscreen */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
        >
          <Maximize2 className="w-5 h-5 text-gray-600" />
        </button>

        {/* Canvas 3D */}
        <div className="w-full aspect-4/3">
          <Canvas
            camera={{ position: [0, 1, 5], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, preserveDrawingBuffer: true }}
          >
            <PreviewScene
              textureUrl={textureUrl}
              shape={shape}
              showMannequin={showMannequin}
              onReset={resetView}
              controlsRef={controlsRef}
            />
          </Canvas>
        </div>

        {/* Contrôles de forme */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg">
          {shapeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setShape(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                shape === option.value
                  ? "bg-primary-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-xs text-gray-400">
          Glissez pour faire pivoter • Scroll pour zoomer
        </div>
      </div>

      {/* Modal Fullscreen */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="w-full h-full max-w-6xl max-h-[90vh] p-4">
              <Canvas
                camera={{ position: [0, 1, 5], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: true }}
              >
                <PreviewScene
                  textureUrl={textureUrl}
                  shape={shape}
                  showMannequin={showMannequin}
                  onReset={resetFullscreenView}
                  controlsRef={fullscreenControlsRef}
                />
              </Canvas>
            </div>

            {/* Contrôles fullscreen */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-white/10 backdrop-blur-md rounded-full p-1">
              {shapeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setShape(option.value)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                    shape === option.value
                      ? "bg-white text-gray-900"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}