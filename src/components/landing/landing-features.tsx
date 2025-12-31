// src/components/landing/landing-features.tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Compass,
  Camera,
  Map,
  ShoppingBag,
  Wallet,
  Calendar,
  BookOpen,
  Award,
  Sparkles,
} from "lucide-react";

export function LandingFeatures() {
  const t = useTranslations("landing.features");

  const features = [
    {
      icon: Compass,
      title: "Explorer les Symboles",
      description: "Parcourez le plus grand dictionnaire des symboles textiles africains",
      color: "bg-primary-100 text-primary-600",
    },
    {
      icon: Camera,
      title: "Scanner Intelligent",
      description: "Identifiez n'importe quel pagne en un clic avec notre IA",
      color: "bg-secondary-100 text-secondary-600",
      badge: "IA",
    },
    {
      icon: Sparkles,
      title: "Réalité Augmentée",
      description: "Prévisualisez les tissus avant l'achat",
      color: "bg-purple-100 text-purple-600",
      badge: "Nouveau",
    },
    {
      icon: Map,
      title: "Carte Culturelle",
      description: "Explorez les traditions textiles par région africaine",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: BookOpen,
      title: "Quiz & Histoires",
      description: "Apprenez en vous amusant avec des quiz et récits de griots",
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: ShoppingBag,
      title: "Marketplace",
      description: "Achetez des pagnes authentiques certifiés",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: Wallet,
      title: "Wallet NFT",
      description: "Gérez vos NFTs et SandjaCoins",
      color: "bg-blue-100 text-blue-600",
      badge: "Cardano",
    },
    {
      icon: Calendar,
      title: "Événements",
      description: "Participez à des événements culturels exclusifs",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Award,
      title: "Gamification",
      description: "Gagnez des badges et montez en niveau",
      color: "bg-yellow-100 text-yellow-700",
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
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Grille des fonctionnalités */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group"
            >
              <div className="bg-gray-50 hover:bg-white rounded-2xl p-6 h-full border border-transparent hover:border-primary-100 hover:shadow-african transition-all duration-300">
                <div className="flex items-start gap-4">
                  {/* Icône */}
                  <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6" />
                  </div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      {feature.badge && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent-gold/20 text-accent-gold-dark">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
