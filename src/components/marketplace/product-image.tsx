// src/components/marketplace/product-image.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string;
  alt: string;
  colors: string[];
  productType: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}

/**
 * Smart product image that shows the real image if available,
 * or generates a beautiful African textile pattern placeholder.
 */
export function ProductImage({
  src,
  alt,
  colors,
  productType,
  fill = true,
  className,
  priority = false,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const [generatedSrc, setGeneratedSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check if the src is a real external URL or a local placeholder path
  const isRealImage =
    src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:");

  useEffect(() => {
    // If it's a local path (not a real URL), generate a pattern immediately
    if (!isRealImage || hasError) {
      generatePattern();
    }
  }, [isRealImage, hasError, colors, productType, alt]);

  function generatePattern() {
    const canvas = document.createElement("canvas");
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const c1 = colors[0] || "#1B3A5C";
    const c2 = colors[1] || "#D4A574";
    const c3 = colors[2] || "#FFFFFF";

    // Choose pattern based on product type
    switch (productType) {
      case "NFT":
        drawNFTPattern(ctx, size, c1, c2, c3);
        break;
      case "FABRIC":
      case "PAGNE":
        drawPagnePattern(ctx, size, c1, c2, c3);
        break;
      case "ACCESSORY":
        drawAccessoryPattern(ctx, size, c1, c2, c3);
        break;
      case "ART":
        drawArtPattern(ctx, size, c1, c2, c3);
        break;
      default:
        drawPagnePattern(ctx, size, c1, c2, c3);
    }

    // Add product name overlay
    drawProductLabel(ctx, size, alt);

    setGeneratedSrc(canvas.toDataURL("image/png"));
  }

  // If it's a real URL and no error, show the real image
  if (isRealImage && !hasError) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={cn("object-cover", className)}
        priority={priority}
        onError={() => setHasError(true)}
      />
    );
  }

  // Show generated pattern
  if (generatedSrc) {
    return (
      <img
        src={generatedSrc}
        alt={alt}
        className={cn("object-cover", fill && "absolute inset-0 w-full h-full", className)}
      />
    );
  }

  // Loading state
  return (
    <div className={cn("bg-gray-100 flex items-center justify-center", fill && "absolute inset-0")}>
      <div className="w-8 h-8 border-2 border-primary-300 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ============================================
// PATTERN GENERATORS
// ============================================

function drawPagnePattern(
  ctx: CanvasRenderingContext2D,
  size: number,
  c1: string,
  c2: string,
  c3: string
) {
  // Ndop-inspired pattern
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, darken(c1, 0.7));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const cols = 8;
  const rows = 10;
  const cellW = size / cols;
  const cellH = size / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW;
      const y = r * cellH;

      // Alternating colored cells
      if ((r + c) % 2 === 0) {
        ctx.fillStyle = c2;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);
        ctx.globalAlpha = 1;
      }

      // Central diamond
      const mx = x + cellW / 2;
      const my = y + cellH / 2;
      const ds = Math.min(cellW, cellH) * 0.25;

      ctx.fillStyle = (r + c) % 3 === 0 ? c3 : c2;
      ctx.globalAlpha = (r + c) % 3 === 0 ? 0.8 : 0.4;
      ctx.beginPath();
      ctx.moveTo(mx, my - ds);
      ctx.lineTo(mx + ds, my);
      ctx.lineTo(mx, my + ds);
      ctx.lineTo(mx - ds, my);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;

      // Small inner diamond
      if ((r + c) % 4 === 0) {
        const ids = ds * 0.4;
        ctx.fillStyle = c1;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(mx, my - ids);
        ctx.lineTo(mx + ids, my);
        ctx.lineTo(mx, my + ids);
        ctx.lineTo(mx - ids, my);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  }

  // Horizontal stripes
  for (let i = 0; i < 4; i++) {
    const y = (size / 5) * (i + 1);
    ctx.strokeStyle = c2;
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Border
  ctx.strokeStyle = c2;
  ctx.lineWidth = 8;
  ctx.globalAlpha = 0.5;
  ctx.strokeRect(8, 8, size - 16, size - 16);
  ctx.globalAlpha = 1;
}

function drawNFTPattern(
  ctx: CanvasRenderingContext2D,
  size: number,
  c1: string,
  c2: string,
  c3: string
) {
  // Digital art style with geometric and glow effects
  const grad = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size * 0.7
  );
  grad.addColorStop(0, "#1a0a2e");
  grad.addColorStop(0.5, "#0f0f2e");
  grad.addColorStop(1, "#050510");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Concentric glowing rings
  for (let i = 0; i < 6; i++) {
    const r = 40 + i * 40;
    ctx.strokeStyle = i % 2 === 0 ? c2 : c1;
    ctx.globalAlpha = 0.3 - i * 0.04;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Central symbol (abstract spiral)
  ctx.save();
  ctx.translate(size / 2, size / 2);
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 6;
    const r = 20 + i * 2.5;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    const dotSize = 2 + (i / 60) * 4;

    ctx.fillStyle = i % 3 === 0 ? c2 : i % 3 === 1 ? c3 : c1;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(x, y, dotSize, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  ctx.globalAlpha = 1;

  // Corner decorations
  const corners = [
    [30, 30],
    [size - 30, 30],
    [30, size - 30],
    [size - 30, size - 30],
  ];
  corners.forEach(([cx, cy]) => {
    ctx.strokeStyle = c2;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = c2;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // "NFT" badge
  ctx.fillStyle = "#7c3aed";
  ctx.globalAlpha = 0.9;
  roundRect(ctx, size / 2 - 30, size - 60, 60, 24, 12);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("NFT", size / 2, size - 43);
}

function drawAccessoryPattern(
  ctx: CanvasRenderingContext2D,
  size: number,
  c1: string,
  c2: string,
  c3: string
) {
  // Beaded / woven pattern
  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, darken(c1, 0.8));
  grad.addColorStop(1, c1);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Horizontal beaded rows
  const beadRows = 16;
  const beadCols = 16;
  const beadR = size / beadCols / 2 - 2;

  for (let r = 0; r < beadRows; r++) {
    for (let c = 0; c < beadCols; c++) {
      const x = (c + 0.5) * (size / beadCols) + (r % 2 === 0 ? 0 : size / beadCols / 2);
      const y = (r + 0.5) * (size / beadRows);

      // Bead color based on pattern
      let beadColor = c2;
      if ((r + c) % 5 === 0) beadColor = c3;
      else if ((r + c) % 3 === 0) beadColor = c1;

      // Bead with highlight
      const beadGrad = ctx.createRadialGradient(
        x - beadR * 0.3, y - beadR * 0.3, 0,
        x, y, beadR
      );
      beadGrad.addColorStop(0, lighten(beadColor, 1.4));
      beadGrad.addColorStop(0.7, beadColor);
      beadGrad.addColorStop(1, darken(beadColor, 0.6));

      ctx.fillStyle = beadGrad;
      ctx.beginPath();
      ctx.arc(x, y, beadR, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawArtPattern(
  ctx: CanvasRenderingContext2D,
  size: number,
  c1: string,
  c2: string,
  c3: string
) {
  // Abstract African art style
  ctx.fillStyle = "#f5f0e8";
  ctx.fillRect(0, 0, size, size);

  // Mud cloth inspired lines
  ctx.strokeStyle = c1;
  ctx.lineWidth = 4;

  // Vertical sections
  const sections = 5;
  for (let s = 0; s < sections; s++) {
    const x = (s + 0.5) * (size / sections);
    ctx.beginPath();
    ctx.moveTo(x, 20);
    ctx.lineTo(x, size - 20);
    ctx.stroke();
  }

  // Horizontal fills with patterns
  for (let row = 0; row < 8; row++) {
    const y = row * (size / 8);
    const h = size / 8;

    for (let col = 0; col < sections; col++) {
      const x = col * (size / sections);
      const w = size / sections;

      ctx.fillStyle = (row + col) % 2 === 0 ? c1 : "transparent";
      ctx.globalAlpha = 0.15;
      ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
      ctx.globalAlpha = 1;

      // Cross-hatch pattern in some cells
      if ((row + col) % 3 === 0) {
        ctx.strokeStyle = c2;
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = 1;
        for (let l = 0; l < 5; l++) {
          ctx.beginPath();
          ctx.moveTo(x + 8, y + 8 + l * (h / 5));
          ctx.lineTo(x + w - 8, y + 8 + l * (h / 5));
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // Dot patterns in other cells
      if ((row * 2 + col) % 4 === 1) {
        ctx.fillStyle = c1;
        ctx.globalAlpha = 0.5;
        for (let d = 0; d < 4; d++) {
          for (let e = 0; e < 3; e++) {
            ctx.beginPath();
            ctx.arc(
              x + w * 0.2 + d * (w * 0.2),
              y + h * 0.25 + e * (h * 0.25),
              3, 0, Math.PI * 2
            );
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }
    }
  }
}

// ============================================
// PRODUCT LABEL OVERLAY
// ============================================

function drawProductLabel(ctx: CanvasRenderingContext2D, size: number, name: string) {
  // Gradient overlay at bottom
  const grad = ctx.createLinearGradient(0, size * 0.7, 0, size);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(0,0,0,0.5)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, size * 0.7, size, size * 0.3);

  // Product name
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.globalAlpha = 0.9;

  // Truncate if too long
  const maxWidth = size - 40;
  let displayName = name;
  while (ctx.measureText(displayName).width > maxWidth && displayName.length > 3) {
    displayName = displayName.slice(0, -4) + "...";
  }

  ctx.fillText(displayName, size / 2, size - 20);
  ctx.globalAlpha = 1;
}

// ============================================
// HELPERS
// ============================================

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function darken(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.round(r * factor)},${Math.round(g * factor)},${Math.round(b * factor)})`;
}

function lighten(hex: string, factor: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) * factor);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) * factor);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) * factor);
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}
