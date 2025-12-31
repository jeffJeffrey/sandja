"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Share2,
  BookOpen,
  Volume2,
  Play,
  Pause,
  MapPin,
  Calendar,
  Eye,
  Download,
  ChevronRight,
  Sparkles,
  Info,
  History,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const FabricPreview = dynamic(
  () => import("@/components/3d/fabric-preview").then((mod) => mod.FabricPreview),
  { ssr: false }
);

// Mock data
const getSymbolData = (slug: string) => ({
  id: "1",
  slug,
  name: "L'Araignée (Nka)",
  nameLocal: "Nka",
  category: "ANIMAL",
  themes: ["WISDOM", "ROYALTY", "POWER"],
  region: {
    id: "cameroon-west",
    name: "Cameroun Ouest",
    country: "Cameroun",
    flag: "🇨🇲",
  },
  images: [
    "/images/symbols/ndop-spider-1.jpg",
    "/images/symbols/ndop-spider-2.jpg",
    "/images/symbols/ndop-spider-3.jpg",
  ],
  description: `L'araignée (Nka) est l'un des symboles les plus puissants et vénérés dans la culture Bamiléké du Cameroun. Elle représente la sagesse, la créativité et l'ingéniosité.

Dans la cosmologie Bamiléké, l'araignée est considérée comme un messager entre le monde des vivants et celui des ancêtres. Sa toile, tissée avec une précision remarquable, symbolise l'interconnexion de toutes choses dans l'univers.`,
  meaning: `L'araignée incarne plusieurs vertus essentielles :

- **Sagesse** : Sa patience et sa méthode pour tisser sa toile représentent la réflexion et la planification.
- **Créativité** : La complexité et la beauté de sa toile symbolisent le génie créatif.
- **Persévérance** : Sa capacité à reconstruire sa toile après destruction illustre la résilience.
- **Royauté** : Dans certains contextes, elle est associée au pouvoir royal et à l'autorité.`,
  history: `Les origines de ce symbole remontent à plusieurs siècles dans les royaumes Bamiléké. Selon la tradition orale, l'araignée aurait enseigné aux premiers tisserands l'art du tissage en observant la construction de sa toile.

Le symbole est particulièrement présent dans les pagnes Ndop réservés à la royauté et aux cérémonies importantes. Il était traditionnellement porté par les chefs (Fon) et les membres de la noblesse.`,
  usage: [
    "Cérémonies royales et intronisations",
    "Funérailles de notables",
    "Décoration des cases sacrées",
    "Pagnes de mariage pour les familles nobles",
  ],
  audioUrl: "/audio/symbols/nka-pronunciation.mp3",
  videoUrl: "/video/symbols/nka-story.mp4",
  viewCount: 1234,
  likeCount: 456,
  relatedPagnes: [
    { id: "1", slug: "ndop-royal-bleu", name: "Ndop Royal Bleu", image: "/images/pagnes/ndop-royal-bleu.jpg" },
    { id: "2", slug: "ndop-mariage", name: "Ndop Mariage", image: "/images/pagnes/ndop-mariage.jpg" },
  ],
});

const themeColors: Record<string, string> = {
  WISDOM: "bg-blue-100 text-blue-700",
  ROYALTY: "bg-purple-100 text-purple-700",
  POWER: "bg-red-100 text-red-700",
  PROTECTION: "bg-amber-100 text-amber-700",
  FERTILITY: "bg-emerald-100 text-emerald-700",
};

interface SymbolDetailProps {
  slug: string;
}

export function SymbolDetail({ slug }: SymbolDetailProps) {
  const t = useTranslations("symbolDetail");
  const symbol = getSymbolData(slug);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"meaning" | "history" | "usage">("meaning");
  const [imageError, setImageError] = useState(false);

  const tabs = [
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
            <Link href="/explore" className="text-gray-500 hover:text-primary-600 transition-colors">
              Explorer
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href={`/explore?category=${symbol.category}`} className="text-gray-500 hover:text-primary-600 transition-colors">
              {symbol.category}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{symbol.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back button mobile */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 md:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Colonne gauche - Images */}
          <div>
            {/* Image principale */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4"
            >
              {imageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary-100 to-secondary-100">
                  <div className="text-center">
                    <span className="text-8xl block mb-4">🕷️</span>
                    <p className="text-primary-600 font-medium">{symbol.name}</p>
                  </div>
                </div>
              ) : (
                <Image
                  src={symbol.images[selectedImage]}
                  alt={symbol.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  priority
                />
              )}

              {/* Actions overlay */}
              <div className="absolute top-4 right-4 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLiked(!isLiked)}
                  className={cn(
                    "p-3 rounded-full backdrop-blur-sm transition-colors",
                    isLiked ? "bg-red-500 text-white" : "bg-white/90 text-gray-700 hover:bg-white"
                  )}
                >
                  <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Badge catégorie */}
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700">
                🕷️ {symbol.category}
              </div>
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {symbol.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setImageError(false);
                  }}
                  className={cn(
                    "relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
                    selectedImage === index
                      ? "border-primary-500 ring-2 ring-primary-200"
                      : "border-transparent hover:border-gray-300"
                  )}
                >
                  <Image
                    src={img}
                    alt={`${symbol.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/placeholder-symbol.jpg";
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Audio pronunciation */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Prononciation locale</p>
                  <p className="font-heading text-xl font-bold text-gray-900">{symbol.nameLocal}</p>
                </div>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-4 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Colonne droite - Informations */}
          <div>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Thèmes */}
              <div className="flex flex-wrap gap-2 mb-4">
                {symbol.themes.map((theme) => (
                  <span
                    key={theme}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      themeColors[theme] || "bg-gray-100 text-gray-700"
                    )}
                  >
                    {theme.charAt(0) + theme.slice(1).toLowerCase()}
                  </span>
                ))}
              </div>

              {/* Titre */}
              <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4">
                {symbol.name}
              </h1>

              {/* Région */}
              <Link
                href={`/map?region=${symbol.region.id}`}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-6"
              >
                <MapPin className="w-5 h-5" />
                <span>{symbol.region.flag}</span>
                <span>{symbol.region.name}, {symbol.region.country}</span>
              </Link>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-8 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {symbol.viewCount.toLocaleString()} vues
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {symbol.likeCount.toLocaleString()} favoris
                </span>
              </div>

              {/* Description courte */}
              <p className="text-gray-600 leading-relaxed mb-8">
                {symbol.description.split('\n\n')[0]}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mb-8">
                <Button variant="african" size="lg" className="gap-2">
                  <BookOpen className="w-5 h-5" />
                  {t("actions.learnMore")}
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Download className="w-5 h-5" />
                  {t("actions.download")}
                </Button>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors",
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "meaning" && (
                  <div className="prose prose-gray max-w-none">
                    <div dangerouslySetInnerHTML={{ 
                      __html: symbol.meaning.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') 
                    }} />
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="prose prose-gray max-w-none">
                    <p className="whitespace-pre-line">{symbol.history}</p>
                  </div>
                )}

                {activeTab === "usage" && (
                  <ul className="space-y-3">
                    {symbol.usage.map((use, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-600">{use}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Pagnes liés */}
            {symbol.relatedPagnes.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">
                  {t("relatedPagnes")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {symbol.relatedPagnes.map((pagne) => (
                    <Link
                      key={pagne.id}
                      href={`/marketplace/${pagne.slug}`}
                      className="group"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2">
                        <Image
                          src={pagne.image}
                          alt={pagne.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/placeholder-pagne.jpg";
                          }}
                        />
                      </div>
                      <p className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                        {pagne.name}
                      </p>
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