// src/components/landing/landing-cta.tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingCTA() {
  const t = useTranslations("landing.cta");

  return (
    <section className="py-20 md:py-32 bg-earth-50 relative overflow-hidden">
      {/* Motifs décoratifs */}
      <div className="absolute top-0 left-0 w-1/3 h-full african-pattern-ndop opacity-5" />
      <div className="absolute bottom-0 right-0 w-1/3 h-full african-pattern-kente opacity-5" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Décoration */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-primary-500 to-secondary-500 text-white text-4xl mb-8 shadow-african"
          >
            <Sparkles className="w-10 h-10" />
          </motion.div>

          {/* Titre */}
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t("title")}
          </h2>

          {/* Sous-titre */}
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>

          {/* Bouton CTA */}
          <Button asChild size="xl" variant="african" className="group">
            <Link href="/register">
              {t("button")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          {/* Texte de confiance */}
          <p className="mt-6 text-sm text-gray-500">
            Gratuit • Sans carte bancaire • Commencez en 30 secondes
          </p>

          {/* Logos partenaires (placeholder) */}
          <div className="mt-12 pt-12 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-6">Propulsé par</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  ₳
                </div>
                <span className="font-semibold text-gray-700">Cardano</span>
              </div>
              <div className="w-px h-8 bg-gray-300" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
