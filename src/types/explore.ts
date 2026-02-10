// src/types/explore.ts

// ============================================
// SYMBOLES
// ============================================

export type SymbolCategory =
  | "GEOMETRIC"
  | "ANIMAL"
  | "PLANT"
  | "HUMAN"
  | "ABSTRACT"
  | "CELESTIAL"
  | "OBJECT";

export type SymbolTheme =
  | "MARRIAGE"
  | "FUNERAL"
  | "ROYALTY"
  | "INITIATION"
  | "FERTILITY"
  | "WISDOM"
  | "POWER"
  | "PROTECTION"
  | "UNITY"
  | "PROSPERITY";

export interface SymbolRegion {
  id: string;
  name: string;
  country: string;
  flag: string;
  coordinates?: { lat: number; lng: number };
}

export interface Symbol {
  id: string;
  slug: string;
  name: string;
  nameLocal: string;
  category: SymbolCategory;
  themes: SymbolTheme[];
  region: SymbolRegion;
  images: string[];
  model3dUrl?: string;
  description: string;
  meaning: string;
  history: string;
  usage: string[];
  audioUrl?: string;
  videoUrl?: string;
  viewCount: number;
  likeCount: number;
  isFeatured: boolean;
  relatedPagnes: { id: string; slug: string; name: string; image: string }[];
  colors: string[];
  createdAt: string;
}

// ============================================
// PAGNES / PRODUITS MARKETPLACE
// ============================================

export type ProductType = "PAGNE" | "NFT" | "FABRIC" | "ACCESSORY" | "ART";
export type ProductCondition = "NEW" | "VINTAGE" | "HANDMADE";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  type: ProductType;
  condition: ProductCondition;
  price: number;
  currency: "ADA" | "SNDJ";
  originalPrice?: number;
  images: string[];
  model3dUrl?: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isFeatured: boolean;
  isNFT: boolean;
  nftPolicyId?: string;
  nftAssetName?: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    isVerified: boolean;
    rating: number;
  };
  region: SymbolRegion;
  symbols: { id: string; name: string; slug: string }[];
  colors: string[];
  dimensions?: { width: number; height: number; unit: string };
  material?: string;
  stock: number;
  viewCount: number;
  likeCount: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// ============================================
// FILTERS
// ============================================

export interface SymbolFilters {
  category: SymbolCategory | null;
  theme: SymbolTheme | null;
  regionId: string | null;
  search: string;
}

export interface MarketplaceFilters {
  type: ProductType | null;
  priceRange: [number, number];
  regionId: string | null;
  isNFT: boolean | null;
  sortBy: "price_asc" | "price_desc" | "popular" | "newest" | "rating";
  search: string;
}
