"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

const featuredProducts = [
  {
    id: "1",
    slug: "ndop-royal-bleu",
    name: "Ndop Royal Bleu",
    description: "Pagne traditionnel Bamiléké aux motifs royaux",
    price: 150,
    currency: "ADA",
    image: "/images/pagnes/ndop-royal-bleu.jpg",
    rating: 4.9,
    reviewCount: 128,
    isNFT: true,
    isBestseller: true,
  },
  {
    id: "2",
    slug: "kente-adweneasa",
    name: "Kente Adweneasa",
    description: "Le tissu des rois Ashanti, fait main au Ghana",
    price: 200,
    currency: "ADA",
    image: "  ",
    rating: 4.8,
    reviewCount: 89,
    isNFT: true,
    isBestseller: false,
  },
  {
    id: "3",
    slug: "bogolan-chasseur",
    name: "Bogolan du Chasseur",
    description: "Tissu traditionnel malien teint à la boue",
    price: 120,
    currency: "ADA",
    image: "/images/pagnes/bogolan-chasseur.jpg",
    rating: 4.7,
    reviewCount: 56,
    isNFT: false,
    isBestseller: true,
  },
];

export function FeaturedProducts() {
  const t = useTranslations("marketplace.featured");
  const addItem = useCartStore((state) => state.addItem);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-2">
              {t("title")}
            </h2>
            <p className="text-gray-600">{t("subtitle")}</p>
          </div>
          <Link
            href="/marketplace?featured=true"
            className="hidden md:flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
          >
            {t("viewAll")}
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-200 hover:shadow-african-lg transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/placeholder-pagne.svg";
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isBestseller && (
                      <span className="px-3 py-1 bg-accent-red text-black text-xs font-bold rounded-full">
                        Bestseller
                      </span>
                    )}
                    {product.isNFT && (
                      <span className="px-3 py-1 bg-accent-blue text-black text-xs font-bold rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        NFT inclus
                      </span>
                    )}
                  </div>

                  {/* Wishlist */}
                  <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-accent-red hover:bg-white transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>

                  {/* Quick add overlay */}
                  <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="african"
                      className="w-full gap-2"
                      onClick={() => addItem(product as any)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {t("addToCart")}
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(product.rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviewCount})
                    </span>
                  </div>

                  {/* Name */}
                  <Link href={`/marketplace/${product.slug}`}>
                    <h3 className="font-heading text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary-600">
                        {formatPrice(product.price, product.currency)}
                      </span>
                    </div>
                    <Link
                      href={`/marketplace/${product.slug}`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      {t("viewDetails")}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/marketplace?featured=true">
            <Button variant="outline" className="gap-2">
              {t("viewAll")}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}