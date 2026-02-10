"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw, Shirt, Square, Hand } from "lucide-react";
import { cn } from "@/lib/utils";

type DisplayMode = "flat" | "draped" | "mannequin";

interface FabricViewer3DProps {
  productName: string;
  colors: string[];
  patterns?: string[];
  className?: string;
}

export function FabricViewer3D({ productName, colors, className }: FabricViewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [mode, setMode] = useState<DisplayMode>("flat");
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

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

    let time = 0;

    const render = () => {
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, "#1a1a2e");
      bgGrad.addColorStop(1, "#0f0f23");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      if (isAutoRotate) time += 0.01;

      const rot = {
        x: rotation.x + (isAutoRotate ? Math.sin(time) * 0.15 : 0),
        y: rotation.y + (isAutoRotate ? time * 0.5 : 0),
      };

      if (mode === "flat") {
        drawFlatFabric(ctx, w, h, rot, zoom, colors, time);
      } else if (mode === "draped") {
        drawDrapedFabric(ctx, w, h, rot, zoom, colors, time);
      } else {
        drawMannequinView(ctx, w, h, rot, zoom, colors, time);
      }

      // Label
      ctx.save();
      ctx.font = "bold 13px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.textAlign = "center";
      ctx.fillText(productName, w / 2, h - 16);
      ctx.restore();

      animRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animRef.current);
  }, [rotation, zoom, isAutoRotate, mode, colors, productName]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    setRotation((prev) => ({ x: prev.x + dy * 0.005, y: prev.y + dx * 0.005 }));
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => { isDragging.current = false; };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => Math.max(0.5, Math.min(2.5, prev - e.deltaY * 0.001)));
  };

  const modes: { id: DisplayMode; icon: React.ComponentType<{ className: string }>; label: string }[] = [
    { id: "flat", icon: Square, label: "À plat" },
    { id: "draped", icon: Hand, label: "Drapé" },
    { id: "mannequin", icon: Shirt, label: "Porté" },
  ];

  return (
    <div className={cn("relative rounded-2xl overflow-hidden bg-gray-900", isFullscreen && "fixed inset-0 z-50", className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ aspectRatio: isFullscreen ? "auto" : "4/3" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Display mode selector */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-md rounded-full">
        {modes.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              mode === id ? "bg-white/20 text-white" : "text-white/50 hover:text-white"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-md rounded-full">
        <button onClick={() => setIsAutoRotate(!isAutoRotate)} className={cn("p-2 rounded-full transition-colors", isAutoRotate ? "bg-white/20 text-white" : "text-white/50 hover:text-white")}>
          <RotateCw className="w-4 h-4" />
        </button>
        <button onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))} className="p-2 rounded-full text-white/70 hover:text-white">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))} className="p-2 rounded-full text-white/70 hover:text-white">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button onClick={() => { setRotation({ x: 0, y: 0 }); setZoom(1); }} className="p-2 rounded-full text-white/70 hover:text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-white/20" />
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 rounded-full text-white/70 hover:text-white">
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

// ============================================
// DRAWING FUNCTIONS
// ============================================

function drawFabricPattern(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, colors: string[], rot: number) {
  // African textile pattern (ndop-inspired)
  const cols = 8;
  const rows = 10;
  const cellW = w / cols;
  const cellH = h / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const px = x + c * cellW;
      const py = y + r * cellH;
      const colorIdx = (r + c) % colors.length;

      ctx.fillStyle = colors[colorIdx] || "#1B3A5C";
      ctx.fillRect(px, py, cellW - 1, cellH - 1);

      // Diamond pattern overlay
      if ((r + c) % 3 === 0) {
        ctx.fillStyle = colors[(colorIdx + 1) % colors.length] || "#D4A574";
        const mid = cellW / 2;
        ctx.beginPath();
        ctx.moveTo(px + mid, py + 2);
        ctx.lineTo(px + cellW - 3, py + cellH / 2);
        ctx.lineTo(px + mid, py + cellH - 2);
        ctx.lineTo(px + 3, py + cellH / 2);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
}

function drawFlatFabric(ctx: CanvasRenderingContext2D, w: number, h: number, rot: { x: number; y: number }, zoom: number, colors: string[], time: number) {
  ctx.save();

  const fabricW = w * 0.6 * zoom;
  const fabricH = h * 0.65 * zoom;
  const cx = w / 2;
  const cy = h / 2 - 10;
  const skewX = Math.sin(rot.y) * 0.25;
  const skewY = Math.sin(rot.x) * 0.15;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + fabricH / 2 + 15, fabricW * 0.45, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Transform for perspective
  ctx.translate(cx, cy);
  ctx.transform(1, skewY, skewX, 1, 0, 0);

  // Main fabric
  drawFabricPattern(ctx, -fabricW / 2, -fabricH / 2, fabricW, fabricH, colors, rot.y);

  // Border
  ctx.strokeStyle = colors[0] || "#1B3A5C";
  ctx.lineWidth = 3;
  ctx.strokeRect(-fabricW / 2, -fabricH / 2, fabricW, fabricH);

  // Fringe effect at bottom
  ctx.strokeStyle = colors[1] || "#D4A574";
  ctx.lineWidth = 1;
  for (let i = 0; i < 20; i++) {
    const fx = -fabricW / 2 + (i / 19) * fabricW;
    const waveY = Math.sin(i * 0.5 + time * 2) * 3;
    ctx.beginPath();
    ctx.moveTo(fx, fabricH / 2);
    ctx.lineTo(fx, fabricH / 2 + 12 + waveY);
    ctx.stroke();
  }

  ctx.restore();
}

function drawDrapedFabric(ctx: CanvasRenderingContext2D, w: number, h: number, rot: { x: number; y: number }, zoom: number, colors: string[], time: number) {
  ctx.save();

  const cx = w / 2;
  const cy = h / 2;
  const sz = Math.min(w, h) * 0.35 * zoom;

  // Flowing fabric simulation with wave points
  const points: { x: number; y: number }[] = [];
  const cols = 16;
  const rows = 20;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const u = c / (cols - 1) - 0.5;
      const v = r / (rows - 1) - 0.5;

      // Drape physics - catenary curve with waves
      const drape = v * v * sz * 1.5;
      const wave = Math.sin(u * 4 + time * 2 + v * 3) * sz * 0.04 * (1 + v * 2);
      const perspX = u * sz * 2 * (1 + Math.sin(rot.y) * 0.3);
      const perspY = v * sz * 2 + drape + wave;

      points.push({
        x: cx + perspX + Math.sin(rot.y + v * 2) * sz * 0.15,
        y: cy + perspY - sz * 0.5,
      });
    }
  }

  // Draw fabric quads
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const i = r * cols + c;
      const p0 = points[i];
      const p1 = points[i + 1];
      const p2 = points[i + cols + 1];
      const p3 = points[i + cols];

      const colorIdx = (Math.floor(r / 2) + Math.floor(c / 2)) % colors.length;

      // Shading based on surface normal approximation
      const nx = (p1.x - p0.x) * (p3.y - p0.y) - (p1.y - p0.y) * (p3.x - p0.x);
      const shade = Math.max(0.3, Math.min(1, 0.5 + nx * 0.001));

      const baseColor = colors[colorIdx] || "#1B3A5C";
      ctx.fillStyle = adjustBrightness(baseColor, shade);

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();
      ctx.fill();

      // Diamond pattern on some cells
      if ((r + c) % 4 === 0) {
        const mcx = (p0.x + p1.x + p2.x + p3.x) / 4;
        const mcy = (p0.y + p1.y + p2.y + p3.y) / 4;
        const ds = Math.min(Math.abs(p1.x - p0.x), Math.abs(p3.y - p0.y)) * 0.3;

        ctx.fillStyle = adjustBrightness(colors[(colorIdx + 1) % colors.length] || "#D4A574", shade);
        ctx.beginPath();
        ctx.moveTo(mcx, mcy - ds);
        ctx.lineTo(mcx + ds, mcy);
        ctx.lineTo(mcx, mcy + ds);
        ctx.lineTo(mcx - ds, mcy);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  ctx.restore();
}

function drawMannequinView(ctx: CanvasRenderingContext2D, w: number, h: number, rot: { x: number; y: number }, zoom: number, colors: string[], time: number) {
  ctx.save();

  const cx = w / 2;
  const sz = Math.min(w, h) * 0.35 * zoom;
  const skew = Math.sin(rot.y) * 0.15;

  // Mannequin silhouette
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 2;

  // Head
  ctx.beginPath();
  ctx.ellipse(cx + skew * sz, h * 0.12, sz * 0.1, sz * 0.12, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Neck
  ctx.beginPath();
  ctx.moveTo(cx + skew * sz - sz * 0.04, h * 0.23);
  ctx.lineTo(cx + skew * sz + sz * 0.04, h * 0.23);
  ctx.stroke();

  // Shoulders
  const shoulderY = h * 0.26;
  const shoulderW = sz * 0.55;

  // Fabric wrapped on body
  const fabricTop = shoulderY;
  const fabricBottom = h * 0.85;
  const fabricCols = 14;
  const fabricRows = 20;

  for (let r = 0; r < fabricRows - 1; r++) {
    for (let c = 0; c < fabricCols - 1; c++) {
      const u = c / (fabricCols - 1);
      const v = r / (fabricRows - 1);

      // Body shape (hourglass)
      const bodyWidth = shoulderW * (1 - 0.2 * Math.sin(v * Math.PI));
      const x0 = cx - bodyWidth + u * bodyWidth * 2 + skew * sz * (1 - v);
      const y0 = fabricTop + v * (fabricBottom - fabricTop);
      const x1 = cx - bodyWidth + (u + 1 / (fabricCols - 1)) * bodyWidth * 2 + skew * sz * (1 - v);
      const y1 = fabricTop + (v + 1 / (fabricRows - 1)) * (fabricBottom - fabricTop);

      // Wave for draping
      const wave = Math.sin(u * 6 + time * 1.5 + v * 4) * 2 * v;

      const colorIdx = (Math.floor(r / 2) + Math.floor(c / 2)) % colors.length;
      const shade = 0.5 + u * 0.5 + Math.sin(v * Math.PI) * 0.2;

      ctx.fillStyle = adjustBrightness(colors[colorIdx] || "#1B3A5C", Math.max(0.3, Math.min(1.2, shade)));

      ctx.beginPath();
      ctx.moveTo(x0 + wave, y0);
      ctx.lineTo(x1 + wave, y0);
      ctx.lineTo(x1 + wave, y1);
      ctx.lineTo(x0 + wave, y1);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Arms outline
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1.5;
  // Left arm
  ctx.beginPath();
  ctx.moveTo(cx - shoulderW + skew * sz, shoulderY);
  ctx.quadraticCurveTo(cx - shoulderW - sz * 0.1, h * 0.55, cx - shoulderW + sz * 0.05, h * 0.75);
  ctx.stroke();
  // Right arm
  ctx.beginPath();
  ctx.moveTo(cx + shoulderW + skew * sz, shoulderY);
  ctx.quadraticCurveTo(cx + shoulderW + sz * 0.1, h * 0.55, cx + shoulderW - sz * 0.05, h * 0.75);
  ctx.stroke();

  ctx.restore();
}

function adjustBrightness(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const nr = Math.round(Math.min(255, r * factor));
  const ng = Math.round(Math.min(255, g * factor));
  const nb = Math.round(Math.min(255, b * factor));

  return `rgb(${nr},${ng},${nb})`;
}
