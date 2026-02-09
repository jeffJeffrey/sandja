"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FloatingPagneBackground } from "@/components/common/floating-pagne-background";

interface AuthLayoutClientProps {
  children: React.ReactNode;
}

export function AuthLayoutClient({ children }: AuthLayoutClientProps) {
  const t = useTranslations("auth");

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Immersive African visual (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/pagnes/ndop-royal-bleu.jpg"
          alt="Pagne Ndop"
          fill
          className="object-cover"
          quality={85}
          priority
        />

        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-gray-900/85 via-primary-900/75 to-gray-900/80" />

        {/* Floating SVG patterns on the image side */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingPagneBackground
            intensity="light"
            showImages={false}
            showPatterns
            className="fixed! bg-transparent!"
          />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <span className="text-2xl font-heading font-bold text-accent-gold">
                  {/*  add asvg logo  from images/logo/logo-svg*/}

                  <Image
                    src="/images/logo/logo-icon.svg"
                    alt="SANDJA Logo"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </span>
              </div>
              <div>
                <span className="text-2xl font-heading font-bold tracking-wide">
                  SANDJA
                </span>
                <div className="text-xs text-white/60 tracking-widest uppercase">
                  Le Pagne du Futur
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Center quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-md"
          >
            <blockquote className="relative">
              <div className="text-5xl text-accent-gold/40 font-serif leading-none mb-2">
                &ldquo;
              </div>
              <p className="text-xl md:text-2xl font-light leading-relaxed text-white/90">
                {t("quote")}
              </p>
              <footer className="mt-4 text-sm text-white/50">
                — {t("quoteAuthor")}
              </footer>
            </blockquote>

            {/* Decorative line */}
            <motion.div
              className="mt-8 h-px bg-linear-to-r from-accent-gold/60 via-accent-gold/20 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              style={{ transformOrigin: "left" }}
            />

            {/* Stats */}
            <motion.div
              className="mt-6 flex gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              {[
                { value: "500+", label: t("stats.symbols") },
                { value: "10+", label: t("stats.regions") },
                { value: "∞", label: t("stats.heritage") },
              ].map((stat, i) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-accent-gold">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/50 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Bottom pattern info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-xs text-white/30"
          >
            <p>Ndop Royal — Cameroun, Région de l&apos;Ouest</p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] relative">
        {/* Subtle floating background on mobile */}
        <div className="lg:hidden absolute inset-0">
          <FloatingPagneBackground intensity="light" showPatterns showImages={false} />
        </div>

        {/* Form content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <div className="lg:hidden mb-8 text-center">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <span className="text-xl font-heading font-bold text-primary-600">
                    S
                  </span>
                </div>
                <span className="text-xl font-heading font-bold text-gray-900">
                  SANDJA
                </span>
              </Link>
            </div>

            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
