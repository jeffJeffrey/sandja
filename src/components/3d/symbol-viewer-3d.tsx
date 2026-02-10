"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2, Hand, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SymbolViewer3DProps {
  symbolName: string;
  colors: string[];
  category: string;
  className?: string;
}

export function SymbolViewer3D({ symbolName, colors, category, className }: SymbolViewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const getSymbolPattern = useCallback(() => {
    const patterns: Record<string, (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, rot: { x: number; y: number }) => void> = {
      ANIMAL: drawAnimalSymbol,
      OBJECT: drawObjectSymbol,
      ABSTRACT: drawAbstractSymbol,
      GEOMETRIC: drawGeometricSymbol,
      PLANT: drawPlantSymbol,
      CELESTIAL: drawCelestialSymbol,
      HUMAN: drawHumanSymbol,
    };
    return patterns[category] || drawAbstractSymbol;
  }, [category]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let autoAngle = 0;
    const drawPattern = getSymbolPattern();

    const render = () => {
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      // Background with subtle pattern
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
      bgGrad.addColorStop(0, "#1a1a2e");
      bgGrad.addColorStop(0.6, "#16213e");
      bgGrad.addColorStop(1, "#0f0f23");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Draw grid floor for 3D effect
      drawPerspectiveGrid(ctx, w, h, rotation);

      // Auto rotate
      if (isAutoRotate) {
        autoAngle += 0.008;
      }

      const rot = {
        x: rotation.x + (isAutoRotate ? Math.sin(autoAngle) * 0.2 : 0),
        y: rotation.y + (isAutoRotate ? autoAngle : 0),
      };

      // Draw the main symbol
      ctx.save();
      const cx = w / 2;
      const cy = h / 2 - 20;
      const size = Math.min(w, h) * 0.3 * zoom;

      // Glow effect
      ctx.shadowColor = colors[0] || "#DAA520";
      ctx.shadowBlur = 30 + Math.sin(autoAngle * 2) * 10;

      drawPattern(ctx, cx, cy, size, rot);

      ctx.restore();

      // Draw symbol name
      ctx.save();
      ctx.font = "bold 14px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.textAlign = "center";
      ctx.fillText(symbolName, w / 2, h - 20);
      ctx.restore();

      // Floating particles
      drawParticles(ctx, w, h, autoAngle, colors);

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [rotation, zoom, isAutoRotate, colors, symbolName, getSymbolPattern]);

  // Mouse interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    setRotation((prev) => ({
      x: prev.x + dy * 0.005,
      y: prev.y + dx * 0.005,
    }));
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => { isDragging.current = false; };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => Math.max(0.5, Math.min(2.5, prev - e.deltaY * 0.001)));
  };

  return (
    <div className={cn("relative rounded-2xl overflow-hidden bg-gray-900", isFullscreen && "fixed inset-0 z-50", className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ aspectRatio: isFullscreen ? "auto" : "1" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-md rounded-full">
        <button onClick={() => setIsAutoRotate(!isAutoRotate)} className={cn("p-2 rounded-full transition-colors", isAutoRotate ? "bg-white/20 text-white" : "text-white/50 hover:text-white")}>
          <RotateCw className="w-4 h-4" />
        </button>
        <button onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))} className="p-2 rounded-full text-white/70 hover:text-white transition-colors">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))} className="p-2 rounded-full text-white/70 hover:text-white transition-colors">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button onClick={() => { setRotation({ x: 0, y: 0 }); setZoom(1); }} className="p-2 rounded-full text-white/70 hover:text-white transition-colors">
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-white/20" />
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 rounded-full text-white/70 hover:text-white transition-colors">
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Interaction hint */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/60 text-xs"
      >
        <Hand className="w-3.5 h-3.5" />
        Glisser pour tourner • Scroll pour zoomer
      </motion.div>
    </div>
  );
}

// ============================================
// DRAWING FUNCTIONS
// ============================================

function drawPerspectiveGrid(ctx: CanvasRenderingContext2D, w: number, h: number, rot: { x: number; y: number }) {
  ctx.save();
  ctx.strokeStyle = "rgba(218,165,32,0.08)";
  ctx.lineWidth = 0.5;

  const horizon = h * 0.7;
  const vanishX = w / 2 + rot.y * 100;

  for (let i = -10; i <= 10; i++) {
    const x = w / 2 + i * 40;
    ctx.beginPath();
    ctx.moveTo(x, horizon);
    ctx.lineTo(vanishX + (x - vanishX) * 0.1, h * 0.3);
    ctx.stroke();
  }

  for (let j = 0; j < 8; j++) {
    const y = horizon - j * 10 * (1 + j * 0.3);
    const spread = 1 - j * 0.08;
    ctx.beginPath();
    ctx.moveTo(w / 2 - w * 0.5 * spread, y);
    ctx.lineTo(w / 2 + w * 0.5 * spread, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, w: number, h: number, time: number, colors: string[]) {
  for (let i = 0; i < 20; i++) {
    const seed = i * 137.508;
    const px = (Math.sin(seed + time * 0.3) * 0.5 + 0.5) * w;
    const py = (Math.cos(seed * 1.3 + time * 0.2) * 0.5 + 0.5) * h;
    const alpha = 0.15 + Math.sin(time * 2 + seed) * 0.1;
    const size = 1 + Math.sin(seed) * 1.5;

    ctx.beginPath();
    ctx.fillStyle = `${colors[i % colors.length] || "#DAA520"}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`;
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawAnimalSymbol(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, rot: { x: number; y: number }) {
  const s = size;
  const rx = rot.y;

  // Spider-like symbol with 3D perspective
  ctx.save();
  ctx.translate(cx, cy);

  // Body
  const bodyGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 0.4);
  bodyGrad.addColorStop(0, "#F5D060");
  bodyGrad.addColorStop(0.7, "#DAA520");
  bodyGrad.addColorStop(1, "#8B6914");
  ctx.fillStyle = bodyGrad;

  // Central diamond (3D perspective)
  const skew = Math.sin(rx) * 0.3;
  ctx.beginPath();
  ctx.moveTo(s * skew, -s * 0.35);
  ctx.lineTo(s * 0.35, 0);
  ctx.lineTo(s * skew, s * 0.35);
  ctx.lineTo(-s * 0.35, 0);
  ctx.closePath();
  ctx.fill();

  // Inner detail
  ctx.strokeStyle = "#1B3A5C";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(s * skew * 0.5, -s * 0.18);
  ctx.lineTo(s * 0.18, 0);
  ctx.lineTo(s * skew * 0.5, s * 0.18);
  ctx.lineTo(-s * 0.18, 0);
  ctx.closePath();
  ctx.stroke();

  // Legs (8 legs)
  ctx.strokeStyle = "#DAA520";
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + rx;
    const legLen = s * 0.6 + Math.sin(i * 1.5 + rot.x * 3) * s * 0.1;
    const midX = Math.cos(angle) * s * 0.3;
    const midY = Math.sin(angle) * s * 0.3;
    const endX = Math.cos(angle + 0.3) * legLen;
    const endY = Math.sin(angle + 0.3) * legLen;

    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * s * 0.15, Math.sin(angle) * s * 0.15);
    ctx.quadraticCurveTo(midX, midY, endX, endY);
    ctx.stroke();
  }

  ctx.restore();
}

function drawObjectSymbol(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, rot: { x: number; y: number }) {
  ctx.save();
  ctx.translate(cx, cy);

  const skew = Math.sin(rot.y) * 0.2;

  // Double Gong shape
  for (let side = -1; side <= 1; side += 2) {
    const offset = side * size * 0.25;

    const grad = ctx.createLinearGradient(offset - size * 0.15, -size * 0.3, offset + size * 0.15, size * 0.3);
    grad.addColorStop(0, "#C0C0C0");
    grad.addColorStop(0.5, "#FFD700");
    grad.addColorStop(1, "#8B6914");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(offset + skew * size, 0, size * 0.18, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#1B3A5C";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Handle
  ctx.strokeStyle = "#DAA520";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-size * 0.25 + skew * size, -size * 0.35);
  ctx.quadraticCurveTo(0, -size * 0.55, size * 0.25 + skew * size, -size * 0.35);
  ctx.stroke();

  ctx.restore();
}

function drawAbstractSymbol(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, rot: { x: number; y: number }) {
  ctx.save();
  ctx.translate(cx, cy);

  // Gye Nyame inspired shape
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.5);
  grad.addColorStop(0, "#FFD700");
  grad.addColorStop(1, "#DAA520");

  ctx.fillStyle = grad;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;

  // Spiral-like abstract form
  ctx.beginPath();
  for (let t = 0; t < Math.PI * 4; t += 0.1) {
    const r = size * 0.1 + t * size * 0.05;
    const px = Math.cos(t + rot.y) * r * (1 + Math.sin(rot.x) * 0.2);
    const py = Math.sin(t + rot.y) * r * 0.8;

    if (t === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Center dot
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawGeometricSymbol(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, rot: { x: number; y: number }) {
  ctx.save();
  ctx.translate(cx, cy);

  // Nested diamonds with 3D rotation
  for (let i = 3; i >= 0; i--) {
    const s = size * (0.2 + i * 0.15);
    const alpha = 0.3 + i * 0.2;
    const skew = Math.sin(rot.y) * s * 0.2;

    ctx.strokeStyle = `rgba(218,165,32,${alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(skew, -s);
    ctx.lineTo(s, 0);
    ctx.lineTo(skew, s);
    ctx.lineTo(-s, 0);
    ctx.closePath();
    ctx.stroke();
  }

  ctx.restore();
}

function drawPlantSymbol(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, rot: { x: number; y: number }) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.strokeStyle = "#228B22";
  ctx.lineWidth = 3;

  // Stem
  ctx.beginPath();
  ctx.moveTo(0, size * 0.5);
  ctx.quadraticCurveTo(Math.sin(rot.y) * size * 0.2, 0, 0, -size * 0.3);
  ctx.stroke();

  // Leaves
  for (let side = -1; side <= 1; side += 2) {
    for (let j = 0; j < 3; j++) {
      const y = size * 0.3 - j * size * 0.2;
      ctx.fillStyle = `rgba(34,139,34,${0.5 + j * 0.15})`;
      ctx.beginPath();
      ctx.ellipse(side * size * 0.2, y, size * 0.15, size * 0.06, side * 0.5 + Math.sin(rot.y) * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawCelestialSymbol(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, rot: { x: number; y: number }) {
  ctx.save();
  ctx.translate(cx, cy);

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.3);
  grad.addColorStop(0, "#FFD700");
  grad.addColorStop(1, "#FF6347");
  ctx.fillStyle = grad;

  // Sun body
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Rays
  ctx.strokeStyle = "#FFD700";
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 + rot.y;
    const inner = size * 0.25;
    const outer = size * 0.45 + Math.sin(i * 2 + rot.x * 5) * size * 0.05;

    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
    ctx.stroke();
  }

  ctx.restore();
}

function drawHumanSymbol(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, rot: { x: number; y: number }) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = "#DAA520";
  ctx.lineWidth = 3;

  const skew = Math.sin(rot.y) * size * 0.1;

  // Head
  ctx.beginPath();
  ctx.arc(skew, -size * 0.3, size * 0.12, 0, Math.PI * 2);
  ctx.stroke();

  // Body
  ctx.beginPath();
  ctx.moveTo(skew, -size * 0.18);
  ctx.lineTo(skew * 0.5, size * 0.15);
  ctx.stroke();

  // Arms
  ctx.beginPath();
  ctx.moveTo(-size * 0.25, -size * 0.05);
  ctx.lineTo(skew, -size * 0.1);
  ctx.lineTo(size * 0.25, -size * 0.05);
  ctx.stroke();

  // Legs
  ctx.beginPath();
  ctx.moveTo(skew * 0.5, size * 0.15);
  ctx.lineTo(-size * 0.15, size * 0.45);
  ctx.moveTo(skew * 0.5, size * 0.15);
  ctx.lineTo(size * 0.15, size * 0.45);
  ctx.stroke();

  ctx.restore();
}
