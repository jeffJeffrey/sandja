// src/components/3d/fabric-viewer-3d.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw, Shirt, Square, Waves, Hand } from "lucide-react";
import { cn } from "@/lib/utils";

type DisplayMode = "flat" | "draped" | "mannequin";

interface FabricViewer3DProps {
  productName: string;
  colors: string[];
  className?: string;
}

export function FabricViewer3D({ productName, colors, className }: FabricViewer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const frameRef = useRef<number>(0);
  const fabricRef = useRef<any>(null);

  const [mode, setMode] = useState<DisplayMode>("flat");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const rotationVel = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const zoomLevel = useRef(1);

  const buildFabric = useCallback(async (displayMode: DisplayMode) => {
    if (!mountRef.current) return;
    const THREE = await import("three");

    // Cleanup previous
    if (rendererRef.current) {
      cancelAnimationFrame(frameRef.current);
      rendererRef.current.dispose();
      if (mountRef.current.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    }

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0f0f1a");
    scene.fog = new THREE.FogExp2("#0f0f1a", 0.06);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1, displayMode === "mannequin" ? 5 : 4);
    camera.lookAt(0, displayMode === "mannequin" ? 0.5 : 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    scene.add(new THREE.AmbientLight("#505070", 0.7));

    const mainLight = new THREE.DirectionalLight("#ffffff", 1.0);
    mainLight.position.set(3, 6, 4);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const warmLight = new THREE.PointLight(colors[0] || "#DAA520", 0.8, 10);
    warmLight.position.set(-3, 3, 2);
    scene.add(warmLight);

    const coolLight = new THREE.PointLight("#4169E1", 0.5, 10);
    coolLight.position.set(3, 1, -3);
    scene.add(coolLight);

    // Ground
    const groundGeom = new THREE.PlaneGeometry(10, 10);
    const groundMat = new THREE.MeshStandardMaterial({ color: "#0a0a15", roughness: 0.95 });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid
    const grid = new THREE.GridHelper(8, 16, "#1a1a30", "#1a1a30");
    grid.position.y = -1.49;
    (grid.material as any).opacity = 0.25;
    (grid.material as any).transparent = true;
    scene.add(grid);

    // Build fabric based on mode
    const fabricGroup = new THREE.Group();
    fabricRef.current = fabricGroup;
    scene.add(fabricGroup);

    if (displayMode === "flat") {
      buildFlatFabric(THREE, fabricGroup, colors);
    } else if (displayMode === "draped") {
      buildDrapedFabric(THREE, fabricGroup, colors);
    } else {
      buildMannequinFabric(THREE, fabricGroup, colors);
    }

    // Reset rotation for mode change
    targetRotation.current = { x: 0, y: 0 };
    setIsLoaded(true);

    // Animate
    const clock = new THREE.Clock();
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const delta = clock.getDelta();

      if (isAutoRotate) targetRotation.current.y += delta * 0.3;

      rotationVel.current.x *= 0.95;
      rotationVel.current.y *= 0.95;
      targetRotation.current.x += rotationVel.current.x;
      targetRotation.current.y += rotationVel.current.y;

      fabricGroup.rotation.x += (targetRotation.current.x - fabricGroup.rotation.x) * 0.08;
      fabricGroup.rotation.y += (targetRotation.current.y - fabricGroup.rotation.y) * 0.08;

      // Zoom
      const targetZ = (displayMode === "mannequin" ? 5 : 4) / zoomLevel.current;
      camera.position.z += (targetZ - camera.position.z) * 0.05;

      // Animate fabric wave
      fabricGroup.traverse((child: any) => {
        if (child.name === "fabric_mesh" && child.geometry) {
          const pos = child.geometry.attributes.position;
          const orig = child.userData.originalPositions;
          if (pos && orig) {
            for (let i = 0; i < pos.count; i++) {
              const ox = orig[i * 3];
              const oz = orig[i * 3 + 2];
              const wave = Math.sin(ox * 3 + elapsed * 1.5) * 0.02 + Math.cos(oz * 4 + elapsed) * 0.015;
              pos.setY(i, orig[i * 3 + 1] + wave);
            }
            pos.needsUpdate = true;
            child.geometry.computeVertexNormals();
          }
        }
      });

      // Floating light
      warmLight.position.x = Math.sin(elapsed * 0.3) * 3;
      warmLight.position.z = Math.cos(elapsed * 0.3) * 3;

      renderer.render(scene, camera);
    };
    animate();

    // Resize
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
    };
  }, [colors, isAutoRotate]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    buildFabric(mode).then((fn) => { cleanup = fn; });
    return () => { cancelAnimationFrame(frameRef.current); cleanup?.(); };
  }, [mode, buildFabric]);

  // Pointer handlers
  const handlePointerDown = (e: React.PointerEvent) => { isDragging.current = true; prevMouse.current = { x: e.clientX, y: e.clientY }; };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    rotationVel.current.x = (e.clientY - prevMouse.current.y) * 0.003;
    rotationVel.current.y = (e.clientX - prevMouse.current.x) * 0.003;
    prevMouse.current = { x: e.clientX, y: e.clientY };
  };
  const handlePointerUp = () => { isDragging.current = false; };
  const handleWheel = (e: React.WheelEvent) => { zoomLevel.current = Math.max(0.5, Math.min(2.5, zoomLevel.current - e.deltaY * 0.001)); };

  const modes = [
    { id: "flat" as const, icon: Square, label: "À plat" },
    { id: "draped" as const, icon: Waves, label: "Drapé" },
    { id: "mannequin" as const, icon: Shirt, label: "Porté" },
  ] as const;

  return (
    <div className={cn("relative rounded-2xl overflow-hidden bg-[#0f0f1a]", isFullscreen && "fixed inset-0 z-50", className)}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ aspectRatio: isFullscreen ? "auto" : "4/3", minHeight: 300 }}
        onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} onWheel={handleWheel} />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0f0f1a]">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Mode selector */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-md rounded-full">
        {modes.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setMode(id)}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              mode === id ? "bg-white/20 text-white" : "text-white/50 hover:text-white")}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-md rounded-full">
        <button onClick={() => setIsAutoRotate(!isAutoRotate)}
          className={cn("p-2 rounded-full", isAutoRotate ? "bg-white/20 text-white" : "text-white/50")}>
          <RotateCw className="w-4 h-4" />
        </button>
        <button onClick={() => { zoomLevel.current = Math.min(2.5, zoomLevel.current + 0.3); }} className="p-2 text-white/70 hover:text-white"><ZoomIn className="w-4 h-4" /></button>
        <button onClick={() => { zoomLevel.current = Math.max(0.5, zoomLevel.current - 0.3); }} className="p-2 text-white/70 hover:text-white"><ZoomOut className="w-4 h-4" /></button>
        <button onClick={() => { targetRotation.current = { x: 0, y: 0 }; zoomLevel.current = 1; }} className="p-2 text-white/70 hover:text-white"><RotateCcw className="w-4 h-4" /></button>
        <div className="w-px h-5 bg-white/20" />
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 text-white/70 hover:text-white">
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Label */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full">
        <span className="text-white/60 text-xs">{productName}</span>
      </div>
    </div>
  );
}

// ============================================
// FABRIC BUILD FUNCTIONS
// ============================================

function createFabricTexture(THREE: any, colors: string[]): any {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Base color
  ctx.fillStyle = colors[0] || "#1B3A5C";
  ctx.fillRect(0, 0, size, size);

  // African pattern — diamonds and stripes
  const cols = 8;
  const rows = 10;
  const cellW = size / cols;
  const cellH = size / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW;
      const y = r * cellH;

      // Alternating stripes
      if ((r + c) % 2 === 0) {
        ctx.fillStyle = colors[1] || "#D4A574";
        ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);
      }

      // Diamond overlay
      if ((r + c) % 3 === 0) {
        ctx.fillStyle = colors[2] || "#FFFFFF";
        ctx.globalAlpha = 0.6;
        const mx = x + cellW / 2;
        const my = y + cellH / 2;
        const ds = Math.min(cellW, cellH) * 0.3;
        ctx.beginPath();
        ctx.moveTo(mx, my - ds);
        ctx.lineTo(mx + ds, my);
        ctx.lineTo(mx, my + ds);
        ctx.lineTo(mx - ds, my);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Small dots
      if ((r * 3 + c * 7) % 5 === 0) {
        ctx.fillStyle = colors[0] || "#1B3A5C";
        ctx.beginPath();
        ctx.arc(x + cellW / 2, y + cellH / 2, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Border pattern
  ctx.strokeStyle = colors[2] || "#FFFFFF";
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, size - 20, size - 20);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function buildFlatFabric(THREE: any, group: any, colors: string[]) {
  const texture = createFabricTexture(THREE, colors);

  const geom = new THREE.PlaneGeometry(2.5, 3, 40, 50);
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.8,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geom, mat);
  mesh.name = "fabric_mesh";
  mesh.castShadow = true;
  mesh.rotation.x = -0.3;

  // Store original positions for wave animation
  const pos = geom.attributes.position;
  mesh.userData.originalPositions = new Float32Array(pos.array);

  group.add(mesh);

  // Subtle fold lines
  for (let i = 0; i < 3; i++) {
    const y = -1 + i * 1;
    const foldGeom = new THREE.PlaneGeometry(2.5, 0.01);
    const foldMat = new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.1 });
    const fold = new THREE.Mesh(foldGeom, foldMat);
    fold.position.set(0, y, 0.01);
    fold.rotation.x = -0.3;
    group.add(fold);
  }
}

function buildDrapedFabric(THREE: any, group: any, colors: string[]) {
  const texture = createFabricTexture(THREE, colors);

  const segW = 50;
  const segH = 60;
  const geom = new THREE.PlaneGeometry(2.5, 3, segW, segH);
  const pos = geom.attributes.position;

  // Create catenary drape shape
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);

    // Catenary curve (drape)
    const normalizedY = (y + 1.5) / 3; // 0 to 1
    const drapeZ = -Math.pow(normalizedY, 2) * 0.8 + Math.sin(x * 2) * 0.1 * normalizedY;
    const foldZ = Math.sin(x * 5 + y * 3) * 0.05 * (1 - normalizedY);

    pos.setZ(i, drapeZ + foldZ);
  }

  geom.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.75,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geom, mat);
  mesh.name = "fabric_mesh";
  mesh.castShadow = true;
  mesh.position.y = 0.5;

  mesh.userData.originalPositions = new Float32Array(pos.array);
  group.add(mesh);
}

function buildMannequinFabric(THREE: any, group: any, colors: string[]) {
  const texture = createFabricTexture(THREE, colors);

  // Simple mannequin body
  const mannequinMat = new THREE.MeshStandardMaterial({
    color: "#2a2a35",
    roughness: 0.7,
    metalness: 0.3,
  });

  // Torso
  const torsoGeom = new THREE.CylinderGeometry(0.35, 0.3, 1.5, 16);
  const torso = new THREE.Mesh(torsoGeom, mannequinMat);
  torso.position.y = 0.5;
  torso.castShadow = true;
  group.add(torso);

  // Shoulders
  const shoulderGeom = new THREE.CylinderGeometry(0.06, 0.06, 1.0, 8);
  const shoulders = new THREE.Mesh(shoulderGeom, mannequinMat);
  shoulders.position.y = 1.2;
  shoulders.rotation.z = Math.PI / 2;
  group.add(shoulders);

  // Neck
  const neckGeom = new THREE.CylinderGeometry(0.1, 0.12, 0.3, 12);
  const neck = new THREE.Mesh(neckGeom, mannequinMat);
  neck.position.y = 1.4;
  group.add(neck);

  // Head (simple oval)
  const headGeom = new THREE.SphereGeometry(0.18, 16, 16);
  const head = new THREE.Mesh(headGeom, mannequinMat);
  head.position.y = 1.7;
  head.scale.y = 1.2;
  group.add(head);

  // Stand
  const standGeom = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
  const stand = new THREE.Mesh(standGeom, mannequinMat);
  stand.position.y = -0.85;
  group.add(stand);

  const baseGeom = new THREE.CylinderGeometry(0.3, 0.35, 0.08, 16);
  const base = new THREE.Mesh(baseGeom, mannequinMat);
  base.position.y = -1.45;
  group.add(base);

  // Fabric wrapped around torso
  const fabricGeom = new THREE.CylinderGeometry(0.38, 0.33, 1.6, 32, 20, true);
  const pos = fabricGeom.attributes.position;

  // Add slight bulge and fold variations
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const angle = Math.atan2(z, x);
    const normalizedY = (y + 0.8) / 1.6;

    // Fabric folds
    const fold = Math.sin(angle * 8 + y * 3) * 0.02;
    const drape = Math.sin(angle * 3) * 0.03 * (1 - normalizedY);

    const r = Math.sqrt(x * x + z * z) + fold + drape;
    pos.setX(i, Math.cos(angle) * r);
    pos.setZ(i, Math.sin(angle) * r);
  }

  fabricGeom.computeVertexNormals();

  const fabricMat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.7,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });

  const fabric = new THREE.Mesh(fabricGeom, fabricMat);
  fabric.name = "fabric_mesh";
  fabric.position.y = 0.5;
  fabric.castShadow = true;
  fabric.userData.originalPositions = new Float32Array(pos.array);

  group.add(fabric);
}