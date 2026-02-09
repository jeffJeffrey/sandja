"use client";

import { FloatingPagneBackground } from "@/components/common/floating-pagne-background";

interface PublicLayoutClientProps {
  children: React.ReactNode;
}

export function PublicLayoutClient({ children }: PublicLayoutClientProps) {
  return (
    <div className="relative min-h-screen">
      <FloatingPagneBackground intensity="light" showImages showPatterns />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
