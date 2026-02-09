"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, CreditCard, Sparkles } from "lucide-react";

export function MarketplaceHero() {
  const t = useTranslations("marketplace.hero");

  const features = [
    { icon: ShieldCheck, label: t("features.authentic"), color: "text-green-500" },
    { icon: Truck, label: t("features.shipping"), color: "text-blue-500" },
    { icon: CreditCard, label: t("features.payment"), color: "text-purple-500" },
    { icon: Sparkles, label: t("features.nft"), color: "text-amber-500" },
  ];

  return (
    <section className="relative bg-linear-to-r from-primary-600 to-secondary-600 overflow-hidden">
      {/* Pattern */}
      <div className="absolute inset-0 african-pattern-kente opacity-10" />

      <div className="container mx-auto px-4 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-black max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6"
          >
            <ShieldCheck className="w-4 h-4" />
            {t("badge")}
          </motion.div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-black/80 mb-8">
            {t("subtitle")}
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full"
              >
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
                <span className="text-sm font-medium">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full">
          <path
            d="M0 80L60 70C120 60 240 40 360 35C480 30 600 40 720 45C840 50 960 50 1080 45C1200 40 1320 30 1380 25L1440 20V80H0Z"
            fill="#F9FAFB"
          />
        </svg>
      </div>
    </section>
  );
}