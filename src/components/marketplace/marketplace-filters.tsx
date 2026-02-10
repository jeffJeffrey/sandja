"use client";

import { Filter, ChevronDown, Grid3X3, List, Shield, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMarketplaceFilterStore } from "@/stores/filter-store";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const productTypes = [
  { value: "PAGNE" as const, label: "Pagnes", emoji: "🧵" },
  { value: "NFT" as const, label: "NFTs", emoji: "🎨" },
  { value: "ACCESSORY" as const, label: "Accessoires", emoji: "💍" },
  { value: "ART" as const, label: "Art", emoji: "🖼️" },
];

const sortOptions = [
  { value: "popular" as const, label: "Populaire" },
  { value: "newest" as const, label: "Plus récent" },
  { value: "price_asc" as const, label: "Prix ↑" },
  { value: "price_desc" as const, label: "Prix ↓" },
  { value: "rating" as const, label: "Mieux noté" },
];

export function MarketplaceFilters() {
  const { type, isNFT, sortBy, setType, setIsNFT, setSortBy, reset } = useMarketplaceFilterStore();
  const [expanded, setExpanded] = useState(false);
  const activeCount = [type, isNFT !== null ? "x" : null].filter(Boolean).length;

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button onClick={() => setExpanded(!expanded)}
          className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all",
            expanded ? "bg-primary-50 border-primary-200 text-primary-700" : "bg-white border-gray-200 text-gray-700")}>
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filtres</span>
          {activeCount > 0 && <span className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">{activeCount}</span>}
          <ChevronDown className={cn("w-4 h-4 transition-transform", expanded && "rotate-180")} />
        </button>

        {/* Quick type filters */}
        <div className="hidden md:flex items-center gap-2 flex-1 overflow-x-auto">
          {productTypes.map((pt) => (
            <button key={pt.value} onClick={() => setType(type === pt.value ? null : pt.value)}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-xl border whitespace-nowrap transition-all",
                type === pt.value ? "bg-primary-50 border-primary-200 text-primary-700" : "bg-white border-gray-200 text-gray-600")}>
              <span>{pt.emoji}</span><span className="text-sm font-medium">{pt.label}</span>
            </button>
          ))}

          <button onClick={() => setIsNFT(isNFT === true ? null : true)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-xl border whitespace-nowrap transition-all",
              isNFT === true ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-white border-gray-200 text-gray-600")}>
            <Shield className="w-4 h-4" /><span className="text-sm font-medium">NFT Only</span>
          </button>
        </div>

        {/* Sort */}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none">
          {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Active filters */}
      {activeCount > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm text-gray-500">Filtres actifs :</span>
          {type && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              {productTypes.find((p) => p.value === type)?.emoji} {productTypes.find((p) => p.value === type)?.label}
              <button onClick={() => setType(null)}><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
          {isNFT === true && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              <Shield className="w-3 h-3" /> NFT
              <button onClick={() => setIsNFT(null)}><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
          <button onClick={reset} className="text-sm text-gray-500 hover:text-gray-700 underline">Effacer tout</button>
        </div>
      )}
    </div>
  );
}
