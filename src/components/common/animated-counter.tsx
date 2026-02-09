// src/components/common/animated-counter.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  decimals?: number;
  className?: string;
  onComplete?: () => void;
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  delay = 0,
  decimals = 0,
  className = "",
  onComplete,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  const display = useTransform(spring, (current) => {
    const formatted = decimals > 0 
      ? current.toFixed(decimals) 
      : Math.floor(current).toLocaleString();
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timeout = setTimeout(() => {
        spring.set(value);
        setHasAnimated(true);
        setTimeout(() => {
          onComplete?.();
        }, duration * 1000);
      }, delay * 1000);

      return () => clearTimeout(timeout);
    }
  }, [isInView, value, spring, delay, duration, hasAnimated, onComplete]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}

// Composant de stat card avec animation
interface AnimatedStatCardProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon?: React.ReactNode;
  color?: "primary" | "secondary" | "gold" | "blue" | "green" | "red";
  delay?: number;
  className?: string;
}

export function AnimatedStatCard({
  value,
  label,
  suffix = "",
  prefix = "",
  icon,
  color = "primary",
  delay = 0,
  className = "",
}: AnimatedStatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const colorClasses = {
    primary: {
      bg: "bg-primary-50",
      text: "text-primary-600",
      icon: "bg-primary-100 text-primary-600",
      border: "border-primary-100",
    },
    secondary: {
      bg: "bg-secondary-50",
      text: "text-secondary-600",
      icon: "bg-secondary-100 text-secondary-600",
      border: "border-secondary-100",
    },
    gold: {
      bg: "bg-amber-50",
      text: "text-accent-gold-dark",
      icon: "bg-amber-100 text-accent-gold-dark",
      border: "border-amber-100",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-accent-blue",
      icon: "bg-blue-100 text-accent-blue",
      border: "border-blue-100",
    },
    green: {
      bg: "bg-green-50",
      text: "text-accent-green",
      icon: "bg-green-100 text-accent-green",
      border: "border-green-100",
    },
    red: {
      bg: "bg-red-50",
      text: "text-accent-red",
      icon: "bg-red-100 text-accent-red",
      border: "border-red-100",
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100,
      }}
      className={cn(
        "relative p-6 rounded-2xl border overflow-hidden",
        colors.bg,
        colors.border,
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 african-pattern-zigzag opacity-5" />

      <div className="relative">
        {icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ 
              delay: delay + 0.2, 
              type: "spring",
              stiffness: 200,
            }}
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
              colors.icon
            )}
          >
            {icon}
          </motion.div>
        )}

        <div className={cn("text-4xl font-bold mb-1", colors.text)}>
          <AnimatedCounter
            value={value}
            suffix={suffix}
            prefix={prefix}
            delay={delay + 0.3}
            duration={1.5}
          />
        </div>

        <p className="text-gray-600 font-medium">{label}</p>
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl"
        style={{
          background: `radial-gradient(circle, ${color === "gold" ? "#DAA520" : color === "blue" ? "#4169E1" : "#8B4513"}, transparent)`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

// Barre de progression animée
interface AnimatedProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: "primary" | "secondary" | "gold" | "blue" | "green";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AnimatedProgress({
  value,
  max = 100,
  label,
  showValue = true,
  color = "primary",
  size = "md",
  className = "",
}: AnimatedProgressProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses = {
    primary: "bg-primary-500",
    secondary: "bg-secondary-500",
    gold: "bg-accent-gold",
    blue: "bg-accent-blue",
    green: "bg-accent-green",
  };

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div ref={ref} className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showValue && (
            <span className="text-sm font-semibold text-gray-900">
              <AnimatedCounter value={value} suffix={` / ${max}`} duration={1} />
            </span>
          )}
        </div>
      )}

      <div className={cn("w-full bg-gray-100 rounded-full overflow-hidden", sizeClasses[size])}>
        <motion.div
          className={cn("h-full rounded-full", colorClasses[color])}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : {}}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="h-full w-full bg-linear-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

// XP Progress Bar pour gamification
interface XPProgressBarProps {
  currentXP: number;
  levelXP: number;
  nextLevelXP: number;
  level: number;
  levelName: string;
  className?: string;
}

export function XPProgressBar({
  currentXP,
  levelXP,
  nextLevelXP,
  level,
  levelName,
  className = "",
}: XPProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  
  const xpInLevel = currentXP - levelXP;
  const xpNeeded = nextLevelXP - levelXP;
  const percentage = (xpInLevel / xpNeeded) * 100;

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-12 h-12 rounded-xl bg-linear-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg shadow-african"
          >
            {level}
          </motion.div>
          <div>
            <p className="font-semibold text-gray-900">{levelName}</p>
            <p className="text-sm text-gray-500">Niveau {level}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-primary-600">
            <AnimatedCounter value={xpInLevel} duration={1.5} /> XP
          </p>
          <p className="text-xs text-gray-400">{xpNeeded - xpInLevel} XP restants</p>
        </div>
      </div>

      <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-primary-500 via-secondary-500 to-accent-gold"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : {}}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
        
        {/* Sparkle effect */}
        <motion.div
          className="absolute top-0 h-full w-4 bg-linear-to-r from-transparent via-white/50 to-transparent"
          animate={{
            left: ["-10%", "110%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
