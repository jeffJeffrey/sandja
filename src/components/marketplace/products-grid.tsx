"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockProducts } from "@/data/mock-data";
import { useMarketplaceFilterStore } from "@/stores/filter-store";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";

function ProductCard({ product, index }: { product: typeof mockProducts[0]; index: number }) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addItem } = useCartStore();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Link href={`/marketplace/${product.slug}`}>
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary-50 to-secondary-50">
                <span className="text-5xl">{product.isNFT ? "🎨" : "🧵"}</span>
              </div>
            ) : (
              <Image src={product.images[0]} alt={product.name} fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                onError={() => setImageError(true)} />
            )}
          </Link>

          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNFT && (
              <span className="px-2 py-0.5 bg-purple-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3" /> NFT
              </span>
            )}
            {product.isNew && <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">Nouveau</span>}
            {product.isFeatured && (
              <span className="px-2 py-0.5 bg-accent-gold text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Vedette
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button onClick={(e) => { e.preventDefault(); setIsLiked(!isLiked); }}
            className={cn("absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors",
              isLiked ? "bg-red-500 text-white" : "bg-white/80 backdrop-blur-sm text-gray-600 hover:text-red-500")}>
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </button>

          {/* Quick add */}
          <motion.button onClick={(e) => { e.preventDefault(); addItem({ id: product.id, slug: product.slug, nameKey: `product.${product.id}`, price: product.price, currency: product.currency, type: product.type, images: product.images }, 1); toast.success("Ajouté au panier"); }}
            initial={{ y: 20, opacity: 0 }} whileHover={{ scale: 1.02 }}
            className="absolute bottom-3 left-3 right-3 py-2.5 bg-white rounded-xl font-medium text-sm text-gray-900 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-primary-500 hover:text-white">
            <ShoppingCart className="w-4 h-4" /> Ajouter
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("w-3.5 h-3.5", i < Math.floor(product.rating) ? "text-amber-500 fill-amber-500" : "text-gray-200")} />
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
            </div>
          )}

          <Link href={`/marketplace/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">{product.name}</h3>
          </Link>

          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-primary-600">{product.price} {product.currency}</span>
              {product.originalPrice && <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>}
            </div>
            <span className="text-xs text-gray-400">{product.region.flag} {product.region.name.split(" ")[0]}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProductsGrid() {
  const { type, isNFT, sortBy, search } = useMarketplaceFilterStore();

  let filtered = [...mockProducts];
  if (type) filtered = filtered.filter((p) => p.type === type);
  if (isNFT === true) filtered = filtered.filter((p) => p.isNFT);
  if (search) filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "price_asc": return a.price - b.price;
      case "price_desc": return b.price - a.price;
      case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "rating": return b.rating - a.rating;
      default: return b.viewCount - a.viewCount;
    }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-gray-900">Tous les produits</h2>
        <p className="text-gray-500">{filtered.length} résultat(s)</p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">Aucun produit trouvé</p>
          <p className="text-gray-300 text-sm mt-2">Essayez avec d'autres filtres</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// FEATURED PRODUCTS
// ============================================

export function FeaturedProducts() {
  const featured = mockProducts.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl font-bold text-gray-900">⭐ En vedette</h2>
            <p className="text-gray-500 mt-1">Sélection de nos meilleures pièces</p>
          </div>
          <Link href="/marketplace" className="text-primary-600 text-sm font-medium hover:text-primary-700">
            Voir tout →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
