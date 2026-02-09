"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

// ============================================
// SVG African Patterns (Ndop, Kente, Adinkra inspired)
// ============================================

function NdopPattern({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Ndop-inspired geometric: zigzag diamonds */}
      <rect width="120" height="120" rx="8" fill="currentColor" fillOpacity="0.03" />
      <path
        d="M60 10L80 30L60 50L40 30Z"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.04"
      />
      <path
        d="M60 50L80 70L60 90L40 70Z"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.03"
      />
      <line x1="20" y1="60" x2="100" y2="60" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
      <line x1="60" y1="10" x2="60" y2="110" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
      {/* Small accent dots */}
      <circle cx="60" cy="30" r="3" fill="currentColor" fillOpacity="0.1" />
      <circle cx="60" cy="70" r="3" fill="currentColor" fillOpacity="0.1" />
      <circle cx="40" cy="50" r="2" fill="currentColor" fillOpacity="0.08" />
      <circle cx="80" cy="50" r="2" fill="currentColor" fillOpacity="0.08" />
    </svg>
  );
}

function KentePattern({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Kente-inspired: interlocking strips */}
      <rect width="100" height="100" rx="6" fill="currentColor" fillOpacity="0.02" />
      {/* Horizontal strips */}
      <rect x="10" y="15" width="80" height="8" rx="2" fill="currentColor" fillOpacity="0.06" />
      <rect x="10" y="35" width="80" height="8" rx="2" fill="currentColor" fillOpacity="0.04" />
      <rect x="10" y="55" width="80" height="8" rx="2" fill="currentColor" fillOpacity="0.06" />
      <rect x="10" y="75" width="80" height="8" rx="2" fill="currentColor" fillOpacity="0.04" />
      {/* Vertical accents */}
      <rect x="25" y="10" width="4" height="80" rx="2" fill="currentColor" fillOpacity="0.05" />
      <rect x="50" y="10" width="4" height="80" rx="2" fill="currentColor" fillOpacity="0.07" />
      <rect x="75" y="10" width="4" height="80" rx="2" fill="currentColor" fillOpacity="0.05" />
      {/* Cross accents */}
      <rect x="23" y="17" width="8" height="4" rx="1" fill="currentColor" fillOpacity="0.1" />
      <rect x="48" y="37" width="8" height="4" rx="1" fill="currentColor" fillOpacity="0.1" />
      <rect x="73" y="57" width="8" height="4" rx="1" fill="currentColor" fillOpacity="0.1" />
    </svg>
  );
}

function AdinkraPattern({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Adinkra-inspired: Sankofa bird symbol simplified */}
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1.5" fill="none" />
      <circle cx="50" cy="50" r="25" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" fill="currentColor" fillOpacity="0.02" />
      {/* Heart/spiral shape (Sankofa motif) */}
      <path
        d="M50 25C55 25 65 30 65 42C65 54 50 62 50 75C50 62 35 54 35 42C35 30 45 25 50 25Z"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.04"
      />
      <circle cx="50" cy="40" r="4" fill="currentColor" fillOpacity="0.1" />
    </svg>
  );
}

function BamiekePattern({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Bamileke spider/sun motif */}
      <circle cx="55" cy="55" r="48" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" fill="none" />
      <circle cx="55" cy="55" r="15" fill="currentColor" fillOpacity="0.06" />
      {/* Radial lines (8 arms like a spider) */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="55"
          y1="55"
          x2={55 + 40 * Math.cos((angle * Math.PI) / 180)}
          y2={55 + 40 * Math.sin((angle * Math.PI) / 180)}
          stroke="currentColor"
          strokeOpacity="0.1"
          strokeWidth="1.5"
        />
      ))}
      {/* Outer dots */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <circle
          key={`dot-${angle}`}
          cx={55 + 42 * Math.cos((angle * Math.PI) / 180)}
          cy={55 + 42 * Math.sin((angle * Math.PI) / 180)}
          r="3"
          fill="currentColor"
          fillOpacity="0.08"
        />
      ))}
    </svg>
  );
}

// ============================================
// Floating pagne image element
// ============================================

interface FloatingImageProps {
  src: string;
  alt: string;
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay: number;
  rotation: number;
  opacity?: number;
}

function FloatingImage({
  src,
  alt,
  size,
  initialX,
  initialY,
  duration,
  delay,
  rotation,
  opacity = 0.12,
}: FloatingImageProps) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${initialX}%`,
        top: `${initialY}%`,
        width: size,
        height: size,
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: rotation - 10 }}
      animate={{
        opacity: [0, opacity, opacity, 0],
        y: [0, -30, -60, -90],
        x: [0, 10, -10, 5],
        rotate: [rotation - 10, rotation, rotation + 5, rotation - 5],
        scale: [0.8, 1, 1.02, 0.95],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: duration * 0.3,
        ease: "easeInOut",
      }}
    >
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg"
        style={{ filter: "blur(0.5px)" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={`${size}px`}
          quality={60}
        />
        {/* Overlay to blend with background */}
        <div className="absolute inset-0 bg-linear-to-br from-white/40 via-transparent to-white/30" />
      </div>
    </motion.div>
  );
}

// ============================================
// Floating SVG pattern element
// ============================================

interface FloatingSVGProps {
  pattern: "ndop" | "kente" | "adinkra" | "bamileke";
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay: number;
  color?: string;
}

function FloatingSVG({
  pattern,
  size,
  initialX,
  initialY,
  duration,
  delay,
  color = "text-primary-600",
}: FloatingSVGProps) {
  const PatternComponent = {
    ndop: NdopPattern,
    kente: KentePattern,
    adinkra: AdinkraPattern,
    bamileke: BamiekePattern,
  }[pattern];

  return (
    <motion.div
      className={`absolute pointer-events-none ${color}`}
      style={{
        left: `${initialX}%`,
        top: `${initialY}%`,
        width: size,
        height: size,
      }}
      initial={{ opacity: 0, rotate: -5 }}
      animate={{
        opacity: [0, 0.8, 0.8, 0],
        y: [0, -20, -50, -80],
        x: [0, -8, 12, -5],
        rotate: [-5, 3, -3, 5],
        scale: [0.9, 1, 1.05, 0.9],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: duration * 0.4,
        ease: "easeInOut",
      }}
    >
      <PatternComponent className="w-full h-full" />
    </motion.div>
  );
}

// ============================================
// Main Background Component
// ============================================

const pagneImages = [
  { src: "/images/pagnes/ndop-royal-bleu.jpg", alt: "Ndop Royal Bleu" },
  { src: "/images/pagnes/kente-adweneasa.jpg", alt: "Kente Adweneasa" },
  { src: "/images/pagnes/bogolan-chasseur.jpg", alt: "Bogolan Chasseur" },
];

interface FloatingPagneBackgroundProps {
  /** Intensity: "light" for subtle, "medium" for balanced, "rich" for immersive */
  intensity?: "light" | "medium" | "rich";
  /** Show real pagne images */
  showImages?: boolean;
  /** Show SVG geometric patterns */
  showPatterns?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function FloatingPagneBackground({
  intensity = "medium",
  showImages = true,
  showPatterns = true,
  className = "",
}: FloatingPagneBackgroundProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Adjust sizes and opacity based on intensity
  const config = {
    light: { imageOpacity: 0.06, imageSize: 80, patternSize: 70, count: 4 },
    medium: { imageOpacity: 0.1, imageSize: 110, patternSize: 90, count: 6 },
    rich: { imageOpacity: 0.15, imageSize: 140, patternSize: 110, count: 8 },
  }[intensity];

  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-earth-50/80 via-cream-50/60 to-white/90" />

      {/* Subtle repeating pattern texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L35 15L30 25L25 15Z' fill='%238B4513' fill-opacity='0.4'/%3E%3Cpath d='M30 35L35 45L30 55L25 45Z' fill='%238B4513' fill-opacity='0.3'/%3E%3Ccircle cx='10' cy='30' r='2' fill='%238B4513' fill-opacity='0.2'/%3E%3Ccircle cx='50' cy='30' r='2' fill='%238B4513' fill-opacity='0.2'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating real pagne images */}
      {showImages && (
        <>
          <FloatingImage
            src={pagneImages[0].src}
            alt={pagneImages[0].alt}
            size={config.imageSize}
            initialX={5}
            initialY={15}
            duration={18}
            delay={0}
            rotation={-12}
            opacity={config.imageOpacity}
          />
          <FloatingImage
            src={pagneImages[1].src}
            alt={pagneImages[1].alt}
            size={config.imageSize * 0.9}
            initialX={75}
            initialY={25}
            duration={22}
            delay={3}
            rotation={8}
            opacity={config.imageOpacity * 0.9}
          />
          <FloatingImage
            src={pagneImages[2].src}
            alt={pagneImages[2].alt}
            size={config.imageSize * 0.85}
            initialX={40}
            initialY={60}
            duration={20}
            delay={6}
            rotation={-5}
            opacity={config.imageOpacity * 0.8}
          />
          {config.count >= 6 && (
            <>
              <FloatingImage
                src={pagneImages[0].src}
                alt={pagneImages[0].alt}
                size={config.imageSize * 0.7}
                initialX={85}
                initialY={70}
                duration={16}
                delay={9}
                rotation={15}
                opacity={config.imageOpacity * 0.7}
              />
              <FloatingImage
                src={pagneImages[1].src}
                alt={pagneImages[1].alt}
                size={config.imageSize * 0.75}
                initialX={20}
                initialY={80}
                duration={24}
                delay={12}
                rotation={-8}
                opacity={config.imageOpacity * 0.6}
              />
            </>
          )}
        </>
      )}

      {/* Floating SVG geometric patterns */}
      {showPatterns && (
        <>
          <FloatingSVG
            pattern="ndop"
            size={config.patternSize}
            initialX={15}
            initialY={40}
            duration={20}
            delay={2}
            color="text-accent-blue"
          />
          <FloatingSVG
            pattern="kente"
            size={config.patternSize * 0.85}
            initialX={60}
            initialY={10}
            duration={18}
            delay={5}
            color="text-accent-gold"
          />
          <FloatingSVG
            pattern="adinkra"
            size={config.patternSize * 0.9}
            initialX={85}
            initialY={50}
            duration={22}
            delay={8}
            color="text-primary-500"
          />
          <FloatingSVG
            pattern="bamileke"
            size={config.patternSize * 0.8}
            initialX={35}
            initialY={30}
            duration={16}
            delay={11}
            color="text-secondary-DEFAULT"
          />
          {config.count >= 6 && (
            <>
              <FloatingSVG
                pattern="ndop"
                size={config.patternSize * 0.7}
                initialX={50}
                initialY={75}
                duration={19}
                delay={14}
                color="text-accent-red"
              />
              <FloatingSVG
                pattern="kente"
                size={config.patternSize * 0.65}
                initialX={8}
                initialY={65}
                duration={21}
                delay={4}
                color="text-accent-gold"
              />
            </>
          )}
        </>
      )}

      {/* Soft blur orbs for depth */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-accent-gold/10 blur-3xl"
        style={{ left: "10%", top: "20%" }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-primary-500/8 blur-3xl"
        style={{ right: "15%", top: "50%" }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 3 }}
      />
      <motion.div
        className="absolute w-56 h-56 rounded-full bg-accent-blue/8 blur-3xl"
        style={{ left: "50%", bottom: "10%" }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.06, 0.12, 0.06],
        }}
        transition={{ duration: 12, repeat: Infinity, delay: 5 }}
      />
    </div>
  );
}
