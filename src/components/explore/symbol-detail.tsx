"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Share2, BookOpen, Volume2, Play, Pause, MapPin, Eye, Download, ChevronRight, Info, History, Palette, Box, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SymbolViewer3D } from "@/components/3d/symbol-viewer-3d";
import { mockSymbols } from "@/data/mock-data";
import { toast } from "sonner";

type ViewMode = "image" | "3d";
type DetailTab = "meaning" | "history" | "usage";

const themeColors: Record<string, string> = {
  WISDOM: "bg-blue-100 text-blue-700", ROYALTY: "bg-purple-100 text-purple-700",
  POWER: "bg-red-100 text-red-700", PROTECTION: "bg-amber-100 text-amber-700",
  FERTILITY: "bg-emerald-100 text-emerald-700", MARRIAGE: "bg-pink-100 text-pink-700",
  FUNERAL: "bg-gray-100 text-gray-700", INITIATION: "bg-green-100 text-green-700",
  UNITY: "bg-cyan-100 text-cyan-700", PROSPERITY: "bg-yellow-100 text-yellow-700",
};

const themeLabels: Record<string, string> = {
  WISDOM: "Sagesse", ROYALTY: "Royauté", POWER: "Puissance", PROTECTION: "Protection",
  FERTILITY: "Fertilité", MARRIAGE: "Mariage", FUNERAL: "Funérailles",
  INITIATION: "Initiation", UNITY: "Unité", PROSPERITY: "Prospérité",
};

export function SymbolDetail({ slug }: { slug: string }) {
  const t = useTranslations("symbolDetail");
  const symbol = mockSymbols.find((s) => s.slug === slug) || mockSymbols[0];
  const [viewMode, setViewMode] = useState<ViewMode>("3d");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("meaning");
  const [imageError, setImageError] = useState(false);

  const tabs: Array<{ id: DetailTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "meaning", label: t("tabs.meaning"), icon: Info },
    { id: "history", label: t("tabs.history"), icon: History },
    { id: "usage", label: t("tabs.usage"), icon: Palette },
  ];

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/explore" className="text-gray-500 hover:text-primary-600">Explorer</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{symbol.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Link href="/explore" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 md:hidden">
          <ArrowLeft className="w-5 h-5" /> Retour
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT - Visual */}
          <div>
            {/* View mode toggle */}
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setViewMode("3d")}
                className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  viewMode === "3d" ? "bg-primary-100 text-primary-700 ring-1 ring-primary-200" : "bg-gray-100 text-gray-600")}>
                <Box className="w-4 h-4" /> Vue 3D
              </button>
              <button onClick={() => setViewMode("image")}
                className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  viewMode === "image" ? "bg-primary-100 text-primary-700 ring-1 ring-primary-200" : "bg-gray-100 text-gray-600")}>
                <ImageIcon className="w-4 h-4" /> Images
              </button>
            </div>

            <AnimatePresence mode="wait">
              {viewMode === "3d" ? (
                <motion.div key="3d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <SymbolViewer3D symbolName={symbol.name} colors={symbol.colors} category={symbol.category} className="aspect-square" />
                </motion.div>
              ) : (
                <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                  {imageError ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary-100 to-secondary-100">
                      <span className="text-8xl">{symbol.category === "ANIMAL" ? "🦁" : "✧"}</span>
                    </div>
                  ) : (
                    <Image src={symbol.images[selectedImage]} alt={symbol.name} fill className="object-cover"
                      onError={() => setImageError(true)} priority />
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => setIsLiked(!isLiked)}
                      className={cn("p-3 rounded-full backdrop-blur-sm", isLiked ? "bg-red-500 text-white" : "bg-white/90 text-gray-700")}>
                      <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Lien copié !"); }}
                      className="p-3 rounded-full bg-white/90 text-gray-700">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {viewMode === "image" && symbol.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {symbol.images.map((img, i) => (
                  <button key={i} onClick={() => { setSelectedImage(i); setImageError(false); }}
                    className={cn("relative w-20 h-20 rounded-xl overflow-hidden border-2",
                      selectedImage === i ? "border-primary-500" : "border-transparent hover:border-gray-300")}>
                    <Image src={img} alt="" fill className="object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </button>
                ))}
              </div>
            )}

            {/* Audio */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Prononciation locale</p>
                <p className="font-heading text-xl font-bold text-gray-900">{symbol.nameLocal}</p>
              </div>
              <button onClick={() => setIsPlaying(!isPlaying)}
                className="p-4 bg-primary-500 text-white rounded-full hover:bg-primary-600">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
            </div>

            {/* Colors */}
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-3">Palette de couleurs</p>
              <div className="flex gap-3">
                {symbol.colors.map((color, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: color }} />
                    <span className="text-[10px] text-gray-400 font-mono">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT - Info */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex flex-wrap gap-2 mb-4">
                {symbol.themes.map((theme) => (
                  <span key={theme} className={cn("px-3 py-1 rounded-full text-sm font-medium", themeColors[theme])}>
                    {themeLabels[theme]}
                  </span>
                ))}
              </div>

              <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4">{symbol.name}</h1>

              <Link href={`/map?region=${symbol.region.id}`}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6">
                <MapPin className="w-5 h-5" /><span>{symbol.region.flag}</span>
                <span>{symbol.region.name}, {symbol.region.country}</span>
              </Link>

              <div className="flex items-center gap-6 mb-8 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{symbol.viewCount.toLocaleString()} vues</span>
                <span className="flex items-center gap-1"><Heart className="w-4 h-4" />{symbol.likeCount.toLocaleString()} favoris</span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">{symbol.description}</p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Button variant="african" size="lg" className="gap-2"><BookOpen className="w-5 h-5" />{t("actions.learnMore")}</Button>
                <Button variant="outline" size="lg" className="gap-2"><Download className="w-5 h-5" />{t("actions.download")}</Button>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex gap-1">
                {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={cn("flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors",
                      activeTab === tab.id ? "border-primary-500 text-primary-600" : "border-transparent text-gray-500")}>
                    <tab.icon className="w-4 h-4" />{tab.label}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {activeTab === "meaning" && (
                  <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{
                    __html: symbol.meaning.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>"),
                  }} />
                )}
                {activeTab === "history" && <div className="prose prose-gray max-w-none"><p className="whitespace-pre-line">{symbol.history}</p></div>}
                {activeTab === "usage" && (
                  <ul className="space-y-3">
                    {symbol.usage.map((use, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 text-sm font-medium">{i + 1}</span>
                        <span className="text-gray-600">{use}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>

            {symbol.relatedPagnes.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">{t("relatedPagnes")}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {symbol.relatedPagnes.map((pagne) => (
                    <Link key={pagne.id} href={`/marketplace/${pagne.slug}`} className="group">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2">
                        <Image src={pagne.image} alt={pagne.name} fill className="object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      <p className="font-medium text-gray-900 group-hover:text-primary-600">{pagne.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}