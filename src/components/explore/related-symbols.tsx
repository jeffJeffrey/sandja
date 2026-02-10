// src/components/explore/related-symbols.tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { mockSymbols } from "@/data/mock-data";

export function RelatedSymbols({ currentSlug }: { currentSlug: string }) {
  const t = useTranslations("explore");
  const related = mockSymbols.filter((s) => s.slug !== currentSlug).slice(0, 4);

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-8">{t("results.related")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {related.map((symbol, i) => (
            <motion.div key={symbol.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link href={`/explore/${symbol.slug}`} className="group block">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 mb-3">
                  <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary-100 to-secondary-100">
                    <span className="text-5xl">{symbol.category === "ANIMAL" ? "🦁" : symbol.category === "OBJECT" ? "🏺" : symbol.category === "ABSTRACT" ? "✧" : "◇"}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">{symbol.name}</h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{symbol.region.name}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{symbol.viewCount}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}