// src/components/common/page-transitions.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

// Variantes d'animation pour les transitions de page
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Variantes pour les éléments enfants
export const childVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  },
  exit: { opacity: 0, y: -10 },
};

// Variantes pour fade in simple
export const fadeInVariants = {
  initial: { opacity: 0 },
  enter: { 
    opacity: 1,
    transition: { duration: 0.5 }
  },
  exit: { opacity: 0 },
};

// Variantes pour slide in from left
export const slideInLeftVariants = {
  initial: { opacity: 0, x: -50 },
  enter: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    }
  },
  exit: { opacity: 0, x: -30 },
};

// Variantes pour slide in from right
export const slideInRightVariants = {
  initial: { opacity: 0, x: 50 },
  enter: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    }
  },
  exit: { opacity: 0, x: 30 },
};

// Variantes pour scale up
export const scaleUpVariants = {
  initial: { opacity: 0, scale: 0.8 },
  enter: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  },
  exit: { opacity: 0, scale: 0.9 },
};

// Composant de transition de page
interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Composant pour animer les éléments au scroll
interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function ScrollReveal({ 
  children, 
  className = "", 
  delay = 0,
  direction = "up" 
}: ScrollRevealProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { y: 50, x: 0 };
      case "down": return { y: -50, x: 0 };
      case "left": return { y: 0, x: 50 };
      case "right": return { y: 0, x: -50 };
      default: return { y: 50, x: 0 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialPosition() }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Composant pour animation staggered (enfants apparaissant un par un)
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ 
  children, 
  className = "",
  staggerDelay = 0.1 
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="initial"
      whileInView="enter"
      viewport={{ once: true }}
      variants={{
        initial: {},
        enter: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={childVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animation de texte lettre par lettre
interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function AnimatedText({ text, className = "", delay = 0 }: AnimatedTextProps) {
  const letters = text.split("");

  return (
    <motion.span
      initial="initial"
      animate="enter"
      className={className}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={{
            initial: { opacity: 0, y: 20 },
            enter: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.4,
                delay: delay + index * 0.03,
              }
            },
          }}
          style={{ display: "inline-block" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Effet de hover avec lift
export function HoverLift({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Effet de pulsation
export function PulseEffect({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Loader avec animation africaine
export function AfricanLoader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Cercle extérieur */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary-200"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Cercle intérieur avec couleur accent */}
        <motion.div
          className="absolute inset-1 rounded-full border-4 border-transparent border-t-accent-gold"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Point central */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="w-2 h-2 rounded-full bg-primary-500" />
        </motion.div>
      </div>
    </div>
  );
}

// Skeleton avec animation africaine
export function AfricanSkeleton({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg ${className}`}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundSize: "200% 100%",
      }}
    />
  );
}
