"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown, Grid3X3, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSymbolFilterStore } from "@/stores/filter-store";
import type { SymbolCategory } from "@/types";
import type { SymbolTheme } from "@/types/explore";

const categories: { value: SymbolCategory; labelKey: string; emoji: string }[] = [
  { value: "GEOMETRIC", labelKey: "geometric", emoji: "◇" },
  { value: "ANIMAL", labelKey: "animal", emoji: "🦁" },
  { value: "PLANT", labelKey: "plant", emoji: "🌿" },
  { value: "HUMAN", labelKey: "human", emoji: "👤" },
  { value: "ABSTRACT", labelKey: "abstract", emoji: "✧" },
  { value: "CELESTIAL", labelKey: "celestial", emoji: "☀️" },
  { value: "OBJECT", labelKey: "object", emoji: "🏺" },
];

const themes: { value: SymbolTheme; labelKey: string; color: string }[] = [
  { value: "MARRIAGE", labelKey: "marriage", color: "bg-pink-100 text-pink-700" },
  { value: "FUNERAL", labelKey: "funeral", color: "bg-gray-100 text-gray-700" },
  { value: "ROYALTY", labelKey: "royalty", color: "bg-purple-100 text-purple-700" },
  { value: "INITIATION", labelKey: "initiation", color: "bg-green-100 text-green-700" },
  { value: "FERTILITY", labelKey: "fertility", color: "bg-emerald-100 text-emerald-700" },
  { value: "WISDOM", labelKey: "wisdom", color: "bg-blue-100 text-blue-700" },
  { value: "POWER", labelKey: "power", color: "bg-red-100 text-red-700" },
  { value: "PROTECTION", labelKey: "protection", color: "bg-amber-100 text-amber-700" },
  { value: "UNITY", labelKey: "unity", color: "bg-cyan-100 text-cyan-700" },
  { value: "PROSPERITY", labelKey: "prosperity", color: "bg-yellow-100 text-yellow-700" },
] as const;

const regions = [
  { id: "cameroon-west", name: "Cameroun Ouest" },
  { id: "cameroon-northwest", name: "Cameroun Nord-Ouest" },
  { id: "ghana-ashanti", name: "Ghana Ashanti" },
  { id: "mali-dogon", name: "Mali Dogon" },
];

type ViewMode = "grid" | "large" | "list";

export function ExploreFilters() {
  const t = useTranslations("explore.filters");
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  
  const {
    category,
    theme,
    regionId,
    setCategory,
    setTheme,
    setRegionId,
    reset,
  } = useSymbolFilterStore();

  const activeFiltersCount = [category, theme, regionId].filter(Boolean).length;

  return (
    <div className="mb-8">
      {/* Barre principale */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Bouton filtres */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all",
            isExpanded
              ? "bg-primary-50 border-primary-200 text-primary-700"
              : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
          )}
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">{t("title")}</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-primary-500 text-white text-xs font-bold rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform",
            isExpanded && "rotate-180"
          )} />
        </button>

        {/* Catégories rapides */}
        <div className="hidden md:flex items-center gap-2 flex-1 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(category === cat.value ? null : cat.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border whitespace-nowrap transition-all",
                category === cat.value
                  ? "bg-primary-50 border-primary-200 text-primary-700"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              )}
            >
              <span>{cat.emoji}</span>
              <span className="text-sm font-medium">{t(`categories.${cat.labelKey}`)}</span>
            </button>
          ))}
        </div>

        {/* Mode d'affichage */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
          {[
            { mode: "grid" as ViewMode, icon: Grid3X3 },
            { mode: "large" as ViewMode, icon: LayoutGrid },
            { mode: "list" as ViewMode, icon: List },
          ].map(({ mode, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === mode
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>

      {/* Filtres actifs */}
      {activeFiltersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4 flex-wrap"
        >
          <span className="text-sm text-gray-500">{t("activeFilters")}:</span>
          
          {category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              {categories.find((c) => c.value === category)?.emoji}{" "}
              {t(`categories.${categories.find((c) => c.value === category)?.labelKey}`)}
              <button onClick={() => setCategory(null)} className="ml-1 hover:text-primary-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          
          {theme && (
            <span className={cn(
              "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm",
              themes.find((t) => t.value === theme)?.color
            )}>
              {t(`themes.${themes.find((t) => t.value === theme)?.labelKey}`)}
              <button onClick={() => setTheme(null)} className="ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          
          {regionId && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              {regions.find((r) => r.id === regionId)?.name}
              <button onClick={() => setRegionId(null)} className="ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          
          <button
            onClick={reset}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            {t("clearAll")}
          </button>
        </motion.div>
      )}

      {/* Panneau de filtres étendu */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Catégories */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">{t("categoryTitle")}</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setCategory(category === cat.value ? null : cat.value)}
                        className={cn(
                          "flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors text-left",
                          category === cat.value
                            ? "bg-primary-50 text-primary-700"
                            : "hover:bg-gray-50 text-gray-600"
                        )}
                      >
                        <span className="text-lg">{cat.emoji}</span>
                        <span className="text-sm font-medium">
                          {t(`categories.${cat.labelKey}`)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Thèmes */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">{t("themeTitle")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {themes.map((th) => (
                      <button
                        key={th.value}
                        onClick={() => setTheme(theme === th.value ? null : th.value)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                          theme === th.value
                            ? cn(th.color, "ring-2 ring-offset-2 ring-current")
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {t(`themes.${th.labelKey}`)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Régions */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">{t("regionTitle")}</h3>
                  <div className="space-y-2">
                    {regions.map((region) => (
                      <button
                        key={region.id}
                        onClick={() => setRegionId(regionId === region.id ? null : region.id)}
                        className={cn(
                          "flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors text-left",
                          regionId === region.id
                            ? "bg-green-50 text-green-700"
                            : "hover:bg-gray-50 text-gray-600"
                        )}
                      >
                        <span className="text-sm font-medium">{region.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}