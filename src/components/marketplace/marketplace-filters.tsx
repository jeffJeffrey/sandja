"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProductFilterStore } from "@/stores/filter-store";
import type { ProductType } from "@/types";

const productTypes: { value: ProductType; labelKey: string; icon: string }[] = [
  { value: "PHYSICAL_PAGNE", labelKey: "physical", icon: "👘" },
  { value: "DIGITAL_DESIGN", labelKey: "digital", icon: "🎨" },
  { value: "NFT", labelKey: "nft", icon: "✨" },
  { value: "PRINT_LICENSE", labelKey: "license", icon: "📜" },
];

const priceRanges = [
  { min: 0, max: 50, label: "0 - 50 ADA" },
  { min: 50, max: 100, label: "50 - 100 ADA" },
  { min: 100, max: 200, label: "100 - 200 ADA" },
  { min: 200, max: null, label: "200+ ADA" },
];

const sortOptions = [
  { value: "newest", labelKey: "newest" },
  { value: "price", labelKey: "priceLow" },
  { value: "popular", labelKey: "popular" },
];

export function MarketplaceFilters() {
  const t = useTranslations("marketplace.filters");
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    type,
    minPrice,
    maxPrice,
    inStock,
    sortBy,
    setType,
    setPriceRange,
    setInStock,
    setSortBy,
    reset,
  } = useProductFilterStore();

  const activeFiltersCount = [
    type,
    minPrice !== null || maxPrice !== null,
    inStock,
  ].filter(Boolean).length;

  return (
    <div className="mb-8">
      {/* Main bar */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Filter button */}
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
          <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
        </button>

        {/* Product types */}
        <div className="hidden md:flex items-center gap-2 flex-1">
          {productTypes.map((pt) => (
            <button
              key={pt.value}
              onClick={() => setType(type === pt.value ? null : pt.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border whitespace-nowrap transition-all",
                type === pt.value
                  ? "bg-primary-50 border-primary-200 text-primary-700"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              )}
            >
              <span>{pt.icon}</span>
              <span className="text-sm font-medium">{t(`types.${pt.labelKey}`)}</span>
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-300 focus:outline-none focus:border-primary-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(`sort.${option.labelKey}`)}
              </option>
            ))}
          </select>
          <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Active filters */}
      {activeFiltersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4 flex-wrap"
        >
          <span className="text-sm text-gray-500">{t("active")}:</span>

          {type && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              {productTypes.find((pt) => pt.value === type)?.icon}{" "}
              {t(`types.${productTypes.find((pt) => pt.value === type)?.labelKey}`)}
              <button onClick={() => setType(null)} className="ml-1 hover:text-primary-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {(minPrice !== null || maxPrice !== null) && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              {minPrice || 0} - {maxPrice || "∞"} ADA
              <button onClick={() => setPriceRange(null, null)} className="ml-1 hover:text-green-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {inStock && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {t("inStockOnly")}
              <button onClick={() => setInStock(false)} className="ml-1 hover:text-blue-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          <button onClick={reset} className="text-sm text-gray-500 hover:text-gray-700 underline">
            {t("clearAll")}
          </button>
        </motion.div>
      )}

      {/* Expanded filters */}
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
                {/* Types */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">{t("typeTitle")}</h3>
                  <div className="space-y-2">
                    {productTypes.map((pt) => (
                      <button
                        key={pt.value}
                        onClick={() => setType(type === pt.value ? null : pt.value)}
                        className={cn(
                          "flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors text-left",
                          type === pt.value
                            ? "bg-primary-50 text-primary-700"
                            : "hover:bg-gray-50 text-gray-600"
                        )}
                      >
                        <span className="text-lg">{pt.icon}</span>
                        <span className="text-sm font-medium">{t(`types.${pt.labelKey}`)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">{t("priceTitle")}</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => setPriceRange(range.min, range.max)}
                        className={cn(
                          "flex items-center w-full px-3 py-2 rounded-lg transition-colors text-left",
                          minPrice === range.min && maxPrice === range.max
                            ? "bg-green-50 text-green-700"
                            : "hover:bg-gray-50 text-gray-600"
                        )}
                      >
                        <span className="text-sm font-medium">{range.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">{t("optionsTitle")}</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{t("inStockOnly")}</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}