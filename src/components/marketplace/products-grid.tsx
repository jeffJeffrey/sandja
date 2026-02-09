"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatedProductCard, AnimatedProductGrid } from "@/components/common";
import { useCartStore } from "@/stores/cart-store";
import { AfricanSkeleton } from "@/components/common";

const mockProducts = [
  {
    id: "1",
    slug: "ndop-royal-bleu",
    name: "Ndop Royal Bleu",
    description: "Pagne traditionnel Bamiléké aux motifs royaux authentiques",
    price: 150,
    currency: "ADA",
    image: "/images/pagnes/ndop-royal-bleu.svg",
    rating: 4.9,
    reviewCount: 128,
    isNew: false,
    isFeatured: true,
    isNFT: true,
  },
  {
    id: "2",
    slug: "kente-adweneasa",
    name: "Kente Adweneasa",
    description: "Le tissu des rois Ashanti, tissé à la main au Ghana",
    price: 200,
    currency: "ADA",
    image: "/images/pagnes/kente-adweneasa.svg",
    rating: 4.8,
    reviewCount: 89,
    isNew: true,
    isFeatured: true,
    isNFT: true,
  },
  {
    id: "3",
    slug: "bogolan-chasseur",
    name: "Bogolan du Chasseur",
    description: "Tissu traditionnel malien teint avec des techniques ancestrales",
    price: 120,
    currency: "ADA",
    image: "/images/pagnes/bogolan-chasseur.svg",
    rating: 4.7,
    reviewCount: 56,
    isNew: false,
    isFeatured: false,
    isNFT: false,
  },
  {
    id: "4",
    slug: "ndop-mariage",
    name: "Ndop Mariage",
    description: "Pagne spécial pour les cérémonies de mariage traditionnelles",
    price: 180,
    currency: "ADA",
    image: "/images/pagnes/ndop-mariage.svg",
    rating: 4.9,
    reviewCount: 45,
    isNew: true,
    isFeatured: false,
    isNFT: true,
  },
  {
    id: "5",
    slug: "kente-celebration",
    name: "Kente Célébration",
    description: "Design moderne inspiré des motifs traditionnels Kente",
    price: 95,
    currency: "ADA",
    image: "/images/pagnes/kente-celebration.svg",
    rating: 4.5,
    reviewCount: 32,
    isNew: true,
    isFeatured: false,
    isNFT: false,
  },
  {
    id: "6",
    slug: "design-digital-ndop",
    name: "Design Digital Ndop",
    description: "Fichier haute résolution pour impression personnalisée",
    price: 25,
    currency: "ADA",
    image: "/images/pagnes/design-digital-ndop.svg",
    rating: 4.6,
    reviewCount: 78,
    isNew: false,
    isFeatured: false,
    isNFT: false,
  },
  {
    id: "7",
    slug: "nft-araignee-royale",
    name: "NFT Araignée Royale",
    description: "Édition limitée - Certificat d'authenticité blockchain",
    price: 50,
    currency: "ADA",
    image: "/images/nfts/araignee-royale.svg",
    rating: 5.0,
    reviewCount: 12,
    isNew: true,
    isFeatured: true,
    isNFT: true,
  },
  {
    id: "8",
    slug: "bogolan-initiation",
    name: "Bogolan Initiation",
    description: "Motifs traditionnels utilisés lors des rites de passage",
    price: 135,
    currency: "ADA",
    image: "/images/pagnes/bogolan-initiation.svg",
    rating: 4.8,
    reviewCount: 23,
    isNew: false,
    isFeatured: false,
    isNFT: false,
  },
];

export function ProductsGrid() {
  const t = useTranslations("marketplace");
  const [isLoading, setIsLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      addItem(product as any);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <AfricanSkeleton className="aspect-square" />
            <div className="p-4 space-y-3">
              <AfricanSkeleton className="h-4 w-1/3" />
              <AfricanSkeleton className="h-6 w-3/4" />
              <AfricanSkeleton className="h-4 w-full" />
              <AfricanSkeleton className="h-8 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-gray-900">
          {t("allProducts")}
        </h2>
        <p className="text-gray-500">
          {mockProducts.length} {t("productsCount")}
        </p>
      </div>

      {/* Grid */}
      <AnimatedProductGrid
        products={mockProducts}
        onAddToCart={handleAddToCart}
      />

      {/* Load more */}
      <div className="mt-12 text-center">
        <button className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
          {t("loadMore")}
        </button>
      </div>
    </div>
  );
}