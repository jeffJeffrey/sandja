// src/components/landing/landing-problem.tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, Globe } from "lucide-react";

export function LandingProblem() {
  const t = useTranslations("landing.problem");

  const stats = [
    {
      value: t("stat1"),
      label: t("stat1Label"),
      icon: Globe,
      color: "text-accent-red",
      bgColor: "bg-red-50",
    },
    {
      value: t("stat2"),
      label: t("stat2Label"),
      icon: TrendingDown,
      color: "text-accent-gold",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-accent-red text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            {t("subtitle")}
          </div>

          {/* Titre */}
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t("title")}
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 leading-relaxed">
            {t("description")}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`${stat.bgColor} rounded-2xl p-8 text-center`}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md mb-4 ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div className={`text-5xl md:text-6xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Illustration des problèmes */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid md:grid-cols-3 gap-6"
        >
          {[
            { emoji: "📦", title: "Importations massives", desc: "Textiles produits en Asie sans respect des codes culturels" },
            { emoji: "❓", title: "Perte de sens", desc: "Les symboles ancestraux vidés de leur signification" },
            { emoji: "💔", title: "Dévalorisation", desc: "Le Ndop royal utilisé comme simple emballage" },
          ].map((problem, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-primary-200 transition-colors"
            >
              <div className="text-4xl mb-4">{problem.emoji}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{problem.title}</h3>
              <p className="text-sm text-gray-600">{problem.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
