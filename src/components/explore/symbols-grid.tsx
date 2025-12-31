"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Eye, Heart, BookOpen, Volume2, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { HoverLift, AfricanSkeleton } from "@/components/common";

// Mock data - En production, viendra de l'API
const mockSymbols = [
  {
    id: "1",
    slug: "ndop-spider",
    name: "L'Araignée (Nka)",
    category: "ANIMAL",
    themes: ["WISDOM", "ROYALTY"],
    region: "Cameroun Ouest",
    image: "/images/symbols/ndop-spider.jpg",
    description: "Symbole de sagesse et de créativité dans la culture Bamiléké",
    viewCount: 1234,
    isFeatured: true,
  },
  {
    id: "2",
    slug: "adinkra-sankofa",
    name: "Sankofa",
    category: "ANIMAL",
    themes: ["WISDOM", "PROTECTION"],
    region: "Ghana Ashanti",
    image: "/images/symbols/adinkra-sankofa.jpg",
    description: "Apprendre du passé pour avancer",
    viewCount: 2156,
    isFeatured: true,
  },
  {
    id: "3",
    slug: "ndop-double-gong",
    name: "Double Gong",
    category: "OBJECT",
    themes: ["ROYALTY", "POWER"],
    region: "Cameroun Ouest",
    image: "/images/symbols/ndop-double-gong.jpg",
    description: "Emblème du pouvoir royal et de l'autorité",
    viewCount: 876,
    isFeatured: false,
  },
  {
    id: "4",
    slug: "ndop-lizard",
    name: "Le Lézard",
    category: "ANIMAL",
    themes: ["WISDOM", "FERTILITY"],
    region: "Cameroun Ouest",
    image: "/images/symbols/ndop-lizard.jpg",
    description: "Symbole de fertilité et de régénération",
    viewCount: 654,
    isFeatured: false,
  },
  {
    id: "5",
    slug: "adinkra-gye-nyame",
    name: "Gye Nyame",
    category: "ABSTRACT",
    themes: ["POWER", "PROTECTION"],
    region: "Ghana Ashanti",
    image: "/images/symbols/adinkra-gye-nyame.jpg",
    description: "La suprématie de Dieu - symbole le plus populaire",
    viewCount: 3421,
    isFeatured: true,
  },
  {
    id: "6",
    slug: "bogolan-crocodile",
    name: "Le Crocodile",
    category: "ANIMAL",
    themes: ["POWER", "INITIATION"],
    region: "Mali Dogon",
    image: "/images/symbols/bogolan-crocodile.jpg",
    description: "Force et persévérance dans l'adversité",
    viewCount: 543,
    isFeatured: false,
  },
];

const themeColors: Record<string, string> = {
  MARRIAGE: "bg-pink-100 text-pink-700",
  FUNERAL: "bg-gray-100 text-gray-700",
  ROYALTY: "bg-purple-100 text-purple-700",
  INITIATION: "bg-green-100 text-green-700",
  FERTILITY: "bg-emerald-100 text-emerald-700",
  WISDOM: "bg-blue-100 text-blue-700",
  POWER: "bg-red-100 text-red-700",
  PROTECTION: "bg-amber-100 text-amber-700",
  UNITY: "bg-cyan-100 text-cyan-700",
  PROSPERITY: "bg-yellow-100 text-yellow-700",
};

interface SymbolCardProps {
  symbol: typeof mockSymbols[0];
  index: number;
}

function SymbolCard({ symbol, index }: SymbolCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <HoverLift>
        <Link href={`/explore/${symbol.slug}`}>
          <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-200 hover:shadow-african transition-all duration-300">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              {imageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary-100 to-secondary-100">
                  <span className="text-6xl">
                    {symbol.category === "ANIMAL" ? "🦁" : 
                     symbol.category === "PLANT" ? "🌿" :
                     symbol.category === "GEOMETRIC" ? "◇" :
                     symbol.category === "OBJECT" ? "🏺" : "✧"}
                  </span>
                </div>
              ) : (
                <Image
                  src={symbol.image}
                  alt={symbol.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={() => setImageError(true)}
                />
              )}

              {/* Overlay au hover */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Actions au hover */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                    <BookOpen className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                    <Volume2 className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLiked(!isLiked);
                  }}
                  className={cn(
                    "p-2 rounded-lg backdrop-blur-sm transition-colors",
                    isLiked ? "bg-red-500 text-white" : "bg-white/90 text-gray-700 hover:bg-white"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                </button>
              </div>

              {/* Badge featured */}
              {symbol.isFeatured && (
                <div className="absolute top-3 left-3 px-2 py-1 bg-accent-gold text-white text-xs font-bold rounded-full">
                  ⭐ Populaire
                </div>
              )}
            </div>

            {/* Contenu */}
            <div className="p-4">
              {/* Thèmes */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {symbol.themes.slice(0, 2).map((theme) => (
                  <span
                    key={theme}
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      themeColors[theme] || "bg-gray-100 text-gray-700"
                    )}
                  >
                    {theme.charAt(0) + theme.slice(1).toLowerCase()}
                  </span>
                ))}
              </div>

              {/* Nom */}
              <h3 className="font-heading font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                {symbol.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                {symbol.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{symbol.region}</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {symbol.viewCount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </HoverLift>
    </motion.div>
  );
}

export function SymbolsGrid() {
  const t = useTranslations("explore");
  const [isLoading, setIsLoading] = useState(false);

  // En production, filtrer selon useSymbolFilterStore()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <AfricanSkeleton className="aspect-square" />
            <div className="p-4 space-y-3">
              <AfricanSkeleton className="h-4 w-1/2" />
              <AfricanSkeleton className="h-6 w-3/4" />
              <AfricanSkeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header avec compteur */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-gray-900">
          {t("results.title")}
        </h2>
        <p className="text-gray-500">
          {mockSymbols.length} {t("results.count")}
        </p>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockSymbols.map((symbol, index) => (
          <SymbolCard key={symbol.id} symbol={symbol} index={index} />
        ))}
      </div>

      {/* Load more */}
      <div className="mt-12 text-center">
        <button className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
          {t("results.loadMore")}
        </button>
      </div>
    </div>
  );
}