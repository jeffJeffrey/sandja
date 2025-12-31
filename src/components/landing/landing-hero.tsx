// src/components/landing/landing-hero.tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Import dynamique pour éviter les erreurs SSR avec Three.js
const FloatingPagne3D = dynamic(
  () => import("@/components/3d/floating-pagne").then(mod => mod.FloatingPagne),
  { ssr: false }
);

// Loader pendant le chargement du 3D
function Scene3DLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        <div className="w-32 h-32 rounded-full border-4 border-primary-200 border-t-primary-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-primary-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function LandingHero() {
  const t = useTranslations("landing.hero");

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-earth-50 via-cream-50 to-white">
      {/* Motif de fond africain animé */}
      <div className="absolute inset-0 african-pattern-ndop opacity-20 animate-weave" />
      
      {/* Gradient overlay avec animation */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-earth-50/95 via-cream-100/90 to-transparent" />
      </motion.div>
      
      {/* Éléments décoratifs animés avec blur */}
      <motion.div 
        className="absolute top-20 left-10 w-40 h-40 rounded-full bg-accent-gold/30 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-40 right-20 w-56 h-56 rounded-full bg-primary-500/20 blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />
      <motion.div 
        className="absolute top-1/3 right-1/3 w-32 h-32 rounded-full bg-accent-blue/20 blur-2xl"
        animate={{ 
          scale: [1, 1.4, 1],
          x: [0, 20, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, delay: 2 }}
      />

      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left z-10"
          >
            {/* Badge animé */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 text-sm font-medium mb-6 shadow-sm"
            >
              <motion.span 
                className="w-2 h-2 rounded-full bg-accent-gold"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="flex items-center gap-1">
                Propulsé par 
                <span className="font-bold text-accent-blue">Cardano</span>
                <span className="text-lg">₳</span>
              </span>
            </motion.div>

            {/* Titre principal avec animation lettre par lettre */}
            <motion.h1 
              className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.span 
                className="text-gradient-african inline-block"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                {t("title")}
              </motion.span>
            </motion.h1>

            {/* Sous-titre */}
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {t("subtitle")}
            </motion.p>

            {/* Boutons CTA avec animations */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Button asChild size="lg" variant="african" className="group relative overflow-hidden">
                <Link href="/register">
                  <span className="relative z-10 flex items-center gap-2">
                    {t("cta")}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Effet shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="group border-2">
                <button className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Play className="w-5 h-5 text-primary-500" />
                  </motion.div>
                  {t("ctaSecondary")}
                </button>
              </Button>
            </motion.div>

            {/* Indicateurs de confiance avec compteurs animés */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-12 flex items-center gap-6 md:gap-8 justify-center lg:justify-start"
            >
              {[
                { value: "500+", label: "Symboles", color: "text-primary-600" },
                { value: "10+", label: "Régions", color: "text-secondary-600" },
                { value: "NFT", label: "Certifié", color: "text-accent-blue" },
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                >
                  <motion.div 
                    className={`text-2xl md:text-3xl font-bold ${stat.color}`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scène 3D */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative h-[400px] md:h-[500px] lg:h-[600px]"
          >
            {/* Cercle décoratif derrière */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                className="w-[80%] h-[80%] rounded-full border-2 border-dashed border-primary-200"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute w-[60%] h-[60%] rounded-full border border-accent-gold/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Canvas 3D */}
            <Suspense fallback={<Scene3DLoader />}>
              <FloatingPagne3D className="w-full h-full" />
            </Suspense>

            {/* Badges flottants autour du 3D */}
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-10 right-10 bg-white/95 backdrop-blur-sm rounded-xl shadow-african p-3 hidden md:block"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎭</span>
                <div>
                  <div className="text-xs text-gray-500">Ndop</div>
                  <div className="text-sm font-semibold text-primary-600">Cameroun</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
              className="absolute bottom-20 left-5 bg-white/95 backdrop-blur-sm rounded-xl shadow-african p-3 hidden md:block"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <div>
                  <div className="text-xs text-gray-500">Kente</div>
                  <div className="text-sm font-semibold text-accent-gold">Ghana</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              className="absolute top-1/2 -left-5 bg-white/95 backdrop-blur-sm rounded-xl shadow-african p-3 hidden lg:block"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏺</span>
                <div>
                  <div className="text-xs text-gray-500">Bogolan</div>
                  <div className="text-sm font-semibold text-accent-red">Mali</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Vague décorative en bas avec animation */}
      <div className="absolute bottom-0 left-0 right-0">
        <motion.svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </motion.svg>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-sm text-gray-400">Découvrir</span>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-1"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-3 bg-primary-400 rounded-full"
            animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
