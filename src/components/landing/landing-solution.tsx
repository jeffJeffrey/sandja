// src/components/landing/landing-solution.tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { BookOpen, Camera, Shield, Gamepad2 } from "lucide-react";

export function LandingSolution() {
  const t = useTranslations("landing.solution");

  const features = [
    {
      icon: BookOpen,
      title: t("feature1.title"),
      description: t("feature1.description"),
      color: "from-primary-500 to-primary-600",
      iconBg: "bg-primary-100",
      iconColor: "text-primary-600",
    },
    {
      icon: Camera,
      title: t("feature2.title"),
      description: t("feature2.description"),
      color: "from-secondary-500 to-secondary-600",
      iconBg: "bg-secondary-100",
      iconColor: "text-secondary-600",
    },
    {
      icon: Shield,
      title: t("feature3.title"),
      description: t("feature3.description"),
      color: "from-accent-blue to-accent-blue-dark",
      iconBg: "bg-blue-100",
      iconColor: "text-accent-blue",
    },
    {
      icon: Gamepad2,
      title: t("feature4.title"),
      description: t("feature4.description"),
      color: "from-accent-gold to-accent-gold-dark",
      iconBg: "bg-amber-100",
      iconColor: "text-accent-gold-dark",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-earth-50 to-white relative overflow-hidden">
      {/* Motif de fond */}
      <div className="absolute inset-0 african-pattern-kente opacity-10" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-gold" />
            {t("subtitle")}
          </div>

          {/* Titre avec logo stylisé */}
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-gradient-african">SANDJA</span>, {t("title").replace("SANDJA, ", "")}
          </h2>
        </motion.div>

        {/* Grille des fonctionnalités */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-white rounded-2xl p-6 h-full border border-gray-100 shadow-sm hover:shadow-african transition-all duration-300 hover:-translate-y-1">
                {/* Icône */}
                <div className={`${feature.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>

                {/* Titre */}
                <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Ligne décorative au hover */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Illustration centrale */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 flex justify-center"
        >
          <div className="relative">
            {/* Phone mockup */}
            <div className="w-64 h-[500px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
              <div className="w-full h-full bg-gradient-to-b from-primary-500 to-secondary-500 rounded-[2.5rem] flex flex-col items-center justify-center text-white p-6">
                <div className="text-6xl mb-4">📱</div>
                <div className="text-center">
                  <div className="font-heading text-xl font-bold mb-2">SANDJA App</div>
                  <div className="text-sm opacity-80">Scanner • Explorer • Apprendre</div>
                </div>
                
                {/* Fake UI elements */}
                <div className="mt-8 w-full space-y-3">
                  <div className="bg-white/20 rounded-lg h-12 animate-pulse" />
                  <div className="bg-white/20 rounded-lg h-12 animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="bg-white/20 rounded-lg h-12 animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -left-20 top-20 bg-white rounded-xl shadow-lg p-3"
            >
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary-500" />
                <span className="text-sm font-medium">Scanner</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute -right-20 bottom-32 bg-white rounded-xl shadow-lg p-3"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent-blue" />
                <span className="text-sm font-medium">NFT</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
