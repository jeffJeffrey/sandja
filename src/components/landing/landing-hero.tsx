// src/components/landing/landing-hero.tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  const t = useTranslations("landing.hero");

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Motif de fond africain */}
      <div className="absolute inset-0 african-pattern-ndop opacity-30" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-earth-50/90 via-cream-100/80 to-primary-100/60" />
      
      {/* Éléments décoratifs animés */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-accent-gold/20 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-primary-500/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-accent-red/10 blur-2xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
              Propulsé par Cardano
            </motion.div>

            {/* Titre principal */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="text-gradient-african">{t("title")}</span>
            </h1>

            {/* Sous-titre */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              {t("subtitle")}
            </p>

            {/* Boutons CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" variant="african" className="group">
                <Link href="/register">
                  {t("cta")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="group">
                <button>
                  <Play className="w-5 h-5" />
                  {t("ctaSecondary")}
                </button>
              </Button>
            </div>

            {/* Indicateurs de confiance */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex items-center gap-8 justify-center lg:justify-start"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">500+</div>
                <div className="text-sm text-gray-500">Symboles</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">10+</div>
                <div className="text-sm text-gray-500">Régions</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">NFT</div>
                <div className="text-sm text-gray-500">Certifié</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Cercle décoratif */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary-200 animate-spin-slow" style={{ animationDuration: "30s" }} />
              
              {/* Image principale placeholder */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center overflow-hidden">
                {/* Placeholder pour l'image du pagne */}
                <div className="text-center p-8">
                  <div className="text-8xl mb-4">👘</div>
                  <p className="text-primary-600 font-medium">Patrimoine Textile Africain</p>
                </div>
              </div>

              {/* Badges flottants */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-0 right-0 bg-white rounded-xl shadow-african p-3"
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
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute bottom-10 left-0 bg-white rounded-xl shadow-african p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <div>
                    <div className="text-xs text-gray-500">Kente</div>
                    <div className="text-sm font-semibold text-accent-gold">Ghana</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Vague décorative en bas */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
