"use client";

import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { useMarketplaceFilterStore } from "@/stores/filter-store";

export function MarketplaceHero() {
  const { search, setSearch } = useMarketplaceFilterStore();

  return (
    <div className="relative overflow-hidden bg-linear-to-br from-primary-700 via-primary-800 to-secondary-DEFAULT py-16">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23ffffff' fill-opacity='.1'/%3E%3C/svg%3E")`,
      }} />
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-6">
            <Sparkles className="w-4 h-4" /> Marketplace SANDJA
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Pagnes & Art Africain Authentiques
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto mb-8">
            Découvrez des textiles certifiés sur la blockchain Cardano. Chaque pièce raconte une histoire ancestrale.
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un pagne, symbole, région..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-accent-gold" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
