"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";

const FloatingPagne = dynamic(
  () => import("@/components/3d/floating-pagne").then((mod) => mod.FloatingPagne),
  { ssr: false }
);

export function ExploreHero() {
  const t = useTranslations("explore");

  return (
    <section className="relative bg-linear-to-br from-primary-600 via-primary-500 to-secondary-500 overflow-hidden">
      {/* Motif de fond */}
      <div className="absolute inset-0 african-pattern-kente opacity-10" />

      {/* Éléments décoratifs */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-accent-gold/20 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.1, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gray-700 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plus de 500 symboles à découvrir</span>
            </motion.div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t("hero.title")}
            </h1>

            <p className="text-lg text-black/80 mb-8 max-w-xl mx-auto lg:mx-0">
              {t("hero.subtitle")}
            </p>

            {/* Barre de recherche */}
            <div className="relative max-w-lg mx-auto lg:mx-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t("hero.searchPlaceholder")}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
                {t("hero.searchButton")}
              </button>
            </div>

            {/* Tags populaires */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="text-sm text-black/60">Populaires:</span>
              {["Araignée", "Serpent", "Lune", "Fertilité"].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Scène 3D */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block h-100"
          >
            <FloatingPagne variant="minimal" />
          </motion.div>
        </div>
      </div>

      {/* Vague en bas */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" className="w-full">
          <path
            d="M0 100L60 90C120 80 240 60 360 55C480 50 600 60 720 65C840 70 960 70 1080 65C1200 60 1320 50 1380 45L1440 40V100H0Z"
            fill="#F9FAFB"
          />
        </svg>
      </div>
    </section>
  );
}