// src/components/landing/landing-3d-showcase.tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { Compass, Globe, Sparkles, Layers } from "lucide-react";

// Imports dynamiques pour les composants 3D
const SymbolSphere3D = dynamic(
  () => import("@/components/3d/symbol-sphere").then(mod => mod.SymbolSphere3D),
  { ssr: false }
);

const AfricaGlobe3D = dynamic(
  () => import("@/components/3d/africa-globe").then(mod => mod.AfricaGlobe3D),
  { ssr: false }
);

const AnimatedPattern3D = dynamic(
  () => import("@/components/3d/animated-pattern").then(mod => mod.AnimatedPattern3D),
  { ssr: false }
);

// Loader
function Scene3DLoader() {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary-200 border-t-primary-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-gray-500">Chargement de la scène 3D...</p>
      </div>
    </div>
  );
}

type Tab = "symbols" | "map" | "patterns";

const tabs: { id: Tab; label: string; icon: typeof Compass; description: string }[] = [
  { 
    id: "symbols", 
    label: "Symboles", 
    icon: Sparkles,
    description: "Explorez les symboles africains en 3D interactif"
  },
  { 
    id: "map", 
    label: "Carte", 
    icon: Globe,
    description: "Naviguez sur le globe et découvrez les régions textiles"
  },
  { 
    id: "patterns", 
    label: "Motifs", 
    icon: Layers,
    description: "Admirez les motifs géométriques animés"
  },
];

export function Landing3DShowcase() {
  const [activeTab, setActiveTab] = useState<Tab>("symbols");

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 african-pattern-kente opacity-5" />
      
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-gold/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white mb-6"
          >
            <Compass className="w-8 h-8" />
          </motion.div>
          
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Expérience <span className="text-gradient-african">Immersive</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Découvrez le patrimoine textile africain à travers des visualisations 3D interactives
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/25"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Description du tab actif */}
        <motion.p
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 mb-8"
        >
          {tabs.find(t => t.id === activeTab)?.description}
        </motion.p>

        {/* 3D Scene Container */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10"
          style={{ minHeight: "500px" }}
        >
          {/* Corners decoratifs */}
          <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-accent-gold/50 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-accent-gold/50 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-accent-gold/50 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-accent-gold/50 rounded-br-2xl" />

          <Suspense fallback={<Scene3DLoader />}>
            {activeTab === "symbols" && <SymbolSphere3D className="w-full h-[500px]" />}
            {activeTab === "map" && <AfricaGlobe3D className="w-full h-[500px]" />}
            {activeTab === "patterns" && <AnimatedPattern3D className="w-full h-[500px]" />}
          </Suspense>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10">
            <span className="text-gray-400 text-sm">
              🖱️ Cliquez et faites glisser pour explorer
            </span>
            <span className="w-px h-4 bg-white/20" />
            <span className="text-gray-400 text-sm">
              📱 Touchez et glissez sur mobile
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
