"use client";

import { MeshProvider } from "@meshsdk/react";

interface CardanoProviderProps {
  children: React.ReactNode;
}

export function CardanoProvider({ children }: CardanoProviderProps) {
  return <MeshProvider>{children}</MeshProvider>;
}
