// src/components/3d/symbol-viewer-3d.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw, Hand } from "lucide-react";
import { cn } from "@/lib/utils";

interface SymbolViewer3DProps {
  symbolName: string;
  colors: string[];
  category: string;
  className?: string;
}

export function SymbolViewer3D({ symbolName, colors, category, className }: SymbolViewer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const frameRef = useRef<number>(0);
  const clockRef = useRef<any>(null);
  const groupRef = useRef<any>(null);
  const particlesRef = useRef<any>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const rotationVel = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const zoomLevel = useRef(1);

  const initScene = useCallback(async () => {
    if (!mountRef.current) return;
    const THREE = await import("three");

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Clock
    const clock = new THREE.Clock();
    clockRef.current = clock;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Background gradient
    const bgColor = new THREE.Color("#0f0f1a");
    scene.background = bgColor;
    scene.fog = new THREE.FogExp2("#0f0f1a", 0.08);

    // Lights
    const ambientLight = new THREE.AmbientLight("#404060", 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight("#ffffff", 1.2);
    mainLight.position.set(3, 5, 4);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.set(1024, 1024);
    scene.add(mainLight);

    const rimLight = new THREE.PointLight(colors[0] || "#DAA520", 1.5, 10);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(colors[1] || "#4169E1", 0.8, 10);
    fillLight.position.set(2, -1, 3);
    scene.add(fillLight);

    // Ground plane
    const groundGeom = new THREE.CircleGeometry(3, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: "#0a0a15",
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid helper
    const gridHelper = new THREE.GridHelper(6, 20, "#1a1a30", "#1a1a30");
    gridHelper.position.y = -1.19;
    (gridHelper.material as any).opacity = 0.3;
    (gridHelper.material as any).transparent = true;
    scene.add(gridHelper);

    // Main symbol group
    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    // Build symbol based on category
    buildSymbol(THREE, group, category, colors);

    // Floating particles
    const particleGroup = createParticles(THREE, colors);
    particlesRef.current = particleGroup;
    scene.add(particleGroup);

    setIsLoaded(true);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Auto rotation
      if (isAutoRotate) {
        targetRotation.current.y += delta * 0.4;
      }

      // Apply damped rotation
      rotationVel.current.x *= 0.95;
      rotationVel.current.y *= 0.95;
      targetRotation.current.x += rotationVel.current.x;
      targetRotation.current.y += rotationVel.current.y;

      group.rotation.x += (targetRotation.current.x - group.rotation.x) * 0.08;
      group.rotation.y += (targetRotation.current.y - group.rotation.y) * 0.08;

      // Gentle float
      group.position.y = Math.sin(elapsed * 0.8) * 0.08;

      // Camera zoom
      const targetZ = 4 / zoomLevel.current;
      camera.position.z += (targetZ - camera.position.z) * 0.05;

      // Animate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsed * 0.05;
        const positions = particlesRef.current.children[0]?.geometry?.attributes?.position;
        if (positions) {
          for (let i = 0; i < positions.count; i++) {
            const y = positions.getY(i);
            positions.setY(i, y + Math.sin(elapsed * 0.5 + i * 0.1) * 0.001);
          }
          positions.needsUpdate = true;
        }
      }

      // Animate rim light
      rimLight.position.x = Math.sin(elapsed * 0.5) * 3;
      rimLight.position.z = Math.cos(elapsed * 0.5) * 3;

      // Animate symbol-specific elements
      animateSymbol(group, elapsed, category);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [category, colors, isAutoRotate]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    initScene().then((fn) => {
      cleanup = fn;
    });

    return () => {
      cancelAnimationFrame(frameRef.current);
      cleanup?.();
    };
  }, [initScene]);

  // Mouse handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    prevMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - prevMouse.current.x;
    const dy = e.clientY - prevMouse.current.y;
    rotationVel.current.x = dy * 0.003;
    rotationVel.current.y = dx * 0.003;
    prevMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    zoomLevel.current = Math.max(0.5, Math.min(2.5, zoomLevel.current - e.deltaY * 0.001));
  };

  const resetView = () => {
    targetRotation.current = { x: 0, y: 0 };
    zoomLevel.current = 1;
  };

  return (
    <div className={cn("relative rounded-2xl overflow-hidden bg-[#0f0f1a]", isFullscreen && "fixed inset-0 z-50", className)}>
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ aspectRatio: isFullscreen ? "auto" : "1", minHeight: 300 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      />

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0f0f1a]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white/40 text-sm">Chargement 3D...</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-md rounded-full">
        <button onClick={() => setIsAutoRotate(!isAutoRotate)}
          className={cn("p-2 rounded-full transition-colors", isAutoRotate ? "bg-white/20 text-white" : "text-white/50 hover:text-white")}>
          <RotateCw className="w-4 h-4" />
        </button>
        <button onClick={() => { zoomLevel.current = Math.min(2.5, zoomLevel.current + 0.3); }}
          className="p-2 rounded-full text-white/70 hover:text-white"><ZoomIn className="w-4 h-4" /></button>
        <button onClick={() => { zoomLevel.current = Math.max(0.5, zoomLevel.current - 0.3); }}
          className="p-2 rounded-full text-white/70 hover:text-white"><ZoomOut className="w-4 h-4" /></button>
        <button onClick={resetView} className="p-2 rounded-full text-white/70 hover:text-white"><RotateCcw className="w-4 h-4" /></button>
        <div className="w-px h-5 bg-white/20" />
        <button onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-full text-white/70 hover:text-white">
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Label */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full">
        <span className="text-white/60 text-xs font-medium">{symbolName}</span>
      </div>

      {/* Hint */}
      <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 3, duration: 1 }}
        className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/50 text-xs">
        <Hand className="w-3.5 h-3.5" /> Glisser • Scroll zoom
      </motion.div>
    </div>
  );
}

// ============================================
// BUILD SYMBOL GEOMETRY
// ============================================

function buildSymbol(THREE: any, group: any, category: string, colors: string[]) {
  const primaryColor = new THREE.Color(colors[0] || "#DAA520");
  const secondaryColor = new THREE.Color(colors[1] || "#1B3A5C");
  const accentColor = new THREE.Color(colors[2] || "#FFFFFF");

  // Shared materials
  const primaryMat = new THREE.MeshStandardMaterial({
    color: primaryColor,
    roughness: 0.3,
    metalness: 0.7,
    emissive: primaryColor,
    emissiveIntensity: 0.15,
  });

  const secondaryMat = new THREE.MeshStandardMaterial({
    color: secondaryColor,
    roughness: 0.5,
    metalness: 0.4,
  });

  const glowMat = new THREE.MeshStandardMaterial({
    color: primaryColor,
    roughness: 0.2,
    metalness: 0.8,
    emissive: primaryColor,
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.8,
  });

  switch (category) {
    case "ANIMAL":
      buildAnimalSymbol(THREE, group, primaryMat, secondaryMat, glowMat);
      break;
    case "OBJECT":
      buildObjectSymbol(THREE, group, primaryMat, secondaryMat, glowMat);
      break;
    case "ABSTRACT":
      buildAbstractSymbol(THREE, group, primaryMat, secondaryMat, glowMat);
      break;
    case "GEOMETRIC":
      buildGeometricSymbol(THREE, group, primaryMat, secondaryMat, glowMat);
      break;
    case "PLANT":
      buildPlantSymbol(THREE, group, primaryMat, secondaryMat, glowMat);
      break;
    case "CELESTIAL":
      buildCelestialSymbol(THREE, group, primaryMat, secondaryMat, glowMat);
      break;
    case "HUMAN":
      buildHumanSymbol(THREE, group, primaryMat, secondaryMat, glowMat);
      break;
    default:
      buildAbstractSymbol(THREE, group, primaryMat, secondaryMat, glowMat);
  }
}

function buildAnimalSymbol(THREE: any, group: any, primary: any, secondary: any, glow: any) {
  // Spider-like totem — central body + 8 legs

  // Central diamond body
  const bodyGeom = new THREE.OctahedronGeometry(0.5, 0);
  const body = new THREE.Mesh(bodyGeom, primary);
  body.castShadow = true;
  body.name = "body";
  group.add(body);

  // Inner diamond (smaller)
  const innerGeom = new THREE.OctahedronGeometry(0.3, 0);
  const inner = new THREE.Mesh(innerGeom, secondary);
  inner.name = "inner";
  group.add(inner);

  // 8 Legs as curved tubes
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(Math.cos(angle) * 0.3, 0, Math.sin(angle) * 0.3),
      new THREE.Vector3(Math.cos(angle) * 0.8, 0.3 * (i % 2 === 0 ? 1 : -1), Math.sin(angle) * 0.8),
      new THREE.Vector3(Math.cos(angle + 0.2) * 1.2, -0.4, Math.sin(angle + 0.2) * 1.2)
    );
    const tubeGeom = new THREE.TubeGeometry(curve, 12, 0.03, 8, false);
    const leg = new THREE.Mesh(tubeGeom, glow);
    leg.name = `leg_${i}`;
    group.add(leg);
  }

  // Eyes (two small glowing spheres)
  for (let side = -1; side <= 1; side += 2) {
    const eyeGeom = new THREE.SphereGeometry(0.06, 16, 16);
    const eye = new THREE.Mesh(eyeGeom, glow);
    eye.position.set(side * 0.15, 0.2, 0.35);
    group.add(eye);
  }
}

function buildObjectSymbol(THREE: any, group: any, primary: any, secondary: any, glow: any) {
  // Double Gong — two torus shapes with a handle

  for (let side = -1; side <= 1; side += 2) {
    const torusGeom = new THREE.TorusGeometry(0.4, 0.12, 16, 32);
    const torus = new THREE.Mesh(torusGeom, side === -1 ? primary : secondary);
    torus.position.x = side * 0.5;
    torus.rotation.y = Math.PI / 2;
    torus.castShadow = true;
    torus.name = `gong_${side}`;
    group.add(torus);

    // Inner disc
    const discGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.04, 32);
    const disc = new THREE.Mesh(discGeom, glow);
    disc.position.x = side * 0.5;
    disc.rotation.z = Math.PI / 2;
    group.add(disc);
  }

  // Handle connecting the two
  const handleCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.5, 0.5, 0),
    new THREE.Vector3(0, 0.9, 0),
    new THREE.Vector3(0.5, 0.5, 0)
  );
  const handleGeom = new THREE.TubeGeometry(handleCurve, 20, 0.04, 8, false);
  const handle = new THREE.Mesh(handleGeom, primary);
  handle.name = "handle";
  group.add(handle);
}

function buildAbstractSymbol(THREE: any, group: any, primary: any, secondary: any, glow: any) {
  // Gye Nyame inspired — spiral with central sphere

  // Central sphere
  const sphereGeom = new THREE.SphereGeometry(0.25, 32, 32);
  const sphere = new THREE.Mesh(sphereGeom, glow);
  sphere.name = "core";
  group.add(sphere);

  // Spiral arms
  for (let arm = 0; arm < 3; arm++) {
    const points: any[] = [];
    const armOffset = (arm / 3) * Math.PI * 2;
    for (let t = 0; t < 40; t++) {
      const tt = t / 40;
      const r = 0.3 + tt * 0.8;
      const angle = armOffset + tt * Math.PI * 3;
      const y = Math.sin(tt * Math.PI) * 0.3;
      points.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeom = new THREE.TubeGeometry(curve, 60, 0.035, 8, false);
    const tube = new THREE.Mesh(tubeGeom, arm === 0 ? primary : arm === 1 ? secondary : glow);
    tube.name = `spiral_${arm}`;
    tube.castShadow = true;
    group.add(tube);
  }

  // Orbiting rings
  for (let i = 0; i < 2; i++) {
    const ringGeom = new THREE.TorusGeometry(0.6 + i * 0.3, 0.015, 16, 64);
    const ring = new THREE.Mesh(ringGeom, i === 0 ? primary : secondary);
    ring.rotation.x = Math.PI / 3 + i * 0.5;
    ring.rotation.z = i * 0.8;
    ring.name = `ring_${i}`;
    group.add(ring);
  }
}

function buildGeometricSymbol(THREE: any, group: any, primary: any, secondary: any, glow: any) {
  // Nested rotating diamonds / wireframes

  const sizes = [0.8, 0.6, 0.4, 0.25];
  sizes.forEach((size, i) => {
    const geom = new THREE.OctahedronGeometry(size, 0);
    const mat = i % 2 === 0 ? primary.clone() : secondary.clone();
    if (i > 0) {
      mat.wireframe = true;
      mat.transparent = true;
      mat.opacity = 0.6;
    }
    const mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = i === 0;
    mesh.name = `diamond_${i}`;
    group.add(mesh);
  });

  // Cross beams
  for (let axis = 0; axis < 3; axis++) {
    const beamGeom = new THREE.CylinderGeometry(0.02, 0.02, 1.8, 8);
    const beam = new THREE.Mesh(beamGeom, glow);
    if (axis === 0) beam.rotation.z = Math.PI / 2;
    if (axis === 2) beam.rotation.x = Math.PI / 2;
    beam.name = `beam_${axis}`;
    group.add(beam);
  }
}

function buildPlantSymbol(THREE: any, group: any, primary: any, secondary: any, glow: any) {
  // Tree of life — trunk + branches + leaves

  // Trunk
  const trunkCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0.1, 0, 0),
    new THREE.Vector3(0, 0.6, 0)
  );
  const trunkGeom = new THREE.TubeGeometry(trunkCurve, 20, 0.08, 8, false);
  const trunk = new THREE.Mesh(trunkGeom, secondary);
  trunk.castShadow = true;
  group.add(trunk);

  // Branches
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const height = 0.2 + (i % 3) * 0.2;
    const branchCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, height, 0),
      new THREE.Vector3(Math.cos(angle) * 0.4, height + 0.3, Math.sin(angle) * 0.4),
      new THREE.Vector3(Math.cos(angle) * 0.7, height + 0.1, Math.sin(angle) * 0.7)
    );
    const branchGeom = new THREE.TubeGeometry(branchCurve, 12, 0.03, 8, false);
    const branch = new THREE.Mesh(branchGeom, primary);
    group.add(branch);

    // Leaf at tip
    const leafGeom = new THREE.SphereGeometry(0.12, 8, 8);
    leafGeom.scale(1, 0.5, 1);
    const leaf = new THREE.Mesh(leafGeom, glow);
    leaf.position.set(Math.cos(angle) * 0.7, height + 0.1, Math.sin(angle) * 0.7);
    leaf.name = `leaf_${i}`;
    group.add(leaf);
  }
}

function buildCelestialSymbol(THREE: any, group: any, primary: any, secondary: any, glow: any) {
  // Sun — central sphere + rays

  const sunGeom = new THREE.SphereGeometry(0.35, 32, 32);
  const sun = new THREE.Mesh(sunGeom, glow);
  sun.name = "sun";
  group.add(sun);

  // Rays
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const length = i % 2 === 0 ? 0.8 : 0.55;
    const rayGeom = new THREE.CylinderGeometry(0.025, 0.005, length, 6);
    const ray = new THREE.Mesh(rayGeom, primary);
    ray.position.set(
      Math.cos(angle) * (0.4 + length / 2),
      Math.sin(angle) * (0.4 + length / 2),
      0
    );
    ray.rotation.z = angle - Math.PI / 2;
    ray.name = `ray_${i}`;
    group.add(ray);
  }

  // Orbit ring
  const orbitGeom = new THREE.TorusGeometry(1.0, 0.015, 16, 64);
  const orbit = new THREE.Mesh(orbitGeom, secondary);
  orbit.rotation.x = Math.PI / 2;
  group.add(orbit);
}

function buildHumanSymbol(THREE: any, group: any, primary: any, secondary: any, glow: any) {
  // Stylized human figure / totem

  // Head
  const headGeom = new THREE.SphereGeometry(0.2, 32, 32);
  const head = new THREE.Mesh(headGeom, primary);
  head.position.y = 0.8;
  head.castShadow = true;
  group.add(head);

  // Body (tapered cylinder)
  const bodyGeom = new THREE.CylinderGeometry(0.08, 0.15, 0.6, 8);
  const body = new THREE.Mesh(bodyGeom, secondary);
  body.position.y = 0.35;
  body.castShadow = true;
  group.add(body);

  // Arms
  for (let side = -1; side <= 1; side += 2) {
    const armCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.55, 0),
      new THREE.Vector3(side * 0.4, 0.6, 0),
      new THREE.Vector3(side * 0.6, 0.3, 0)
    );
    const armGeom = new THREE.TubeGeometry(armCurve, 12, 0.035, 8, false);
    const arm = new THREE.Mesh(armGeom, primary);
    group.add(arm);
  }

  // Legs
  for (let side = -1; side <= 1; side += 2) {
    const legGeom = new THREE.CylinderGeometry(0.05, 0.04, 0.5, 8);
    const leg = new THREE.Mesh(legGeom, secondary);
    leg.position.set(side * 0.1, -0.2, 0);
    group.add(leg);
  }

  // Crown / headdress glow
  const crownGeom = new THREE.TorusGeometry(0.22, 0.03, 8, 32, Math.PI);
  const crown = new THREE.Mesh(crownGeom, glow);
  crown.position.y = 0.95;
  crown.rotation.x = Math.PI;
  crown.name = "crown";
  group.add(crown);
}

// ============================================
// ANIMATE SYMBOL ELEMENTS
// ============================================

function animateSymbol(group: any, elapsed: number, category: string) {
  group.traverse((child: any) => {
    if (!child.name) return;

    // Legs wave gently
    if (child.name.startsWith("leg_")) {
      const i = parseInt(child.name.split("_")[1]);
      child.rotation.z = Math.sin(elapsed * 1.5 + i * 0.8) * 0.05;
    }

    // Inner body pulses
    if (child.name === "inner" || child.name === "core") {
      const s = 1 + Math.sin(elapsed * 2) * 0.05;
      child.scale.set(s, s, s);
    }

    // Spiral arms rotate slightly
    if (child.name.startsWith("spiral_")) {
      const i = parseInt(child.name.split("_")[1]);
      child.rotation.y = elapsed * 0.1 * (i + 1);
    }

    // Rings orbit
    if (child.name.startsWith("ring_")) {
      const i = parseInt(child.name.split("_")[1]);
      child.rotation.z = elapsed * 0.3 * (i === 0 ? 1 : -1);
    }

    // Diamonds rotate at different speeds
    if (child.name.startsWith("diamond_")) {
      const i = parseInt(child.name.split("_")[1]);
      if (i > 0) {
        child.rotation.y = elapsed * 0.2 * (i % 2 === 0 ? 1 : -1);
        child.rotation.x = elapsed * 0.15 * (i % 2 === 0 ? -1 : 1);
      }
    }

    // Leaves breathe
    if (child.name.startsWith("leaf_")) {
      const i = parseInt(child.name.split("_")[1]);
      const s = 1 + Math.sin(elapsed * 1.2 + i) * 0.15;
      child.scale.set(s, s * 0.5, s);
    }

    // Sun rays pulse
    if (child.name.startsWith("ray_")) {
      const i = parseInt(child.name.split("_")[1]);
      const s = 1 + Math.sin(elapsed * 2 + i * 0.5) * 0.1;
      child.scale.y = s;
    }

    // Crown glows
    if (child.name === "crown") {
      child.rotation.y = elapsed * 0.5;
    }

    // Gongs swing
    if (child.name.startsWith("gong_")) {
      child.rotation.z = Math.sin(elapsed * 1.2) * 0.08;
    }
    if (child.name === "handle") {
      child.rotation.z = Math.sin(elapsed * 1.2) * 0.03;
    }
  });
}

// ============================================
// PARTICLES
// ============================================

function createParticles(THREE: any, colors: string[]) {
  const group = new THREE.Group();
  const count = 80;
  const positions = new Float32Array(count * 3);
  const colorsArr = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 1.5 + Math.random() * 2;

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 0.5;
    positions[i * 3 + 2] = r * Math.cos(phi);

    const color = new THREE.Color(colors[i % colors.length] || "#DAA520");
    colorsArr[i * 3] = color.r;
    colorsArr[i * 3 + 1] = color.g;
    colorsArr[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colorsArr, 3));

  const material = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  group.add(points);
  return group;
}