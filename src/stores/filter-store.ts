// src/stores/filter-store.ts
import { create } from "zustand";
import type { SymbolCategory, SymbolTheme, ProductType } from "@/types/explore";

// ============================================
// SYMBOL FILTER STORE
// ============================================

interface SymbolFilterState {
  category: SymbolCategory | null;
  theme: SymbolTheme | null;
  regionId: string | null;
  search: string;
  setCategory: (c: SymbolCategory | null) => void;
  setTheme: (t: SymbolTheme | null) => void;
  setRegionId: (r: string | null) => void;
  setSearch: (s: string) => void;
  reset: () => void;
}

export const useSymbolFilterStore = create<SymbolFilterState>((set) => ({
  category: null,
  theme: null,
  regionId: null,
  search: "",
  setCategory: (category) => set({ category }),
  setTheme: (theme) => set({ theme }),
  setRegionId: (regionId) => set({ regionId }),
  setSearch: (search) => set({ search }),
  reset: () => set({ category: null, theme: null, regionId: null, search: "" }),
}));

// ============================================
// MARKETPLACE FILTER STORE
// ============================================

interface MarketplaceFilterState {
  type: ProductType | null;
  priceRange: [number, number];
  regionId: string | null;
  isNFT: boolean | null;
  sortBy: "price_asc" | "price_desc" | "popular" | "newest" | "rating";
  search: string;
  setType: (t: ProductType | null) => void;
  setPriceRange: (r: [number, number]) => void;
  setRegionId: (r: string | null) => void;
  setIsNFT: (n: boolean | null) => void;
  setSortBy: (s: MarketplaceFilterState["sortBy"]) => void;
  setSearch: (s: string) => void;
  reset: () => void;
}

export const useMarketplaceFilterStore = create<MarketplaceFilterState>((set) => ({
  type: null,
  priceRange: [0, 1000],
  regionId: null,
  isNFT: null,
  sortBy: "popular",
  search: "",
  setType: (type) => set({ type }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setRegionId: (regionId) => set({ regionId }),
  setIsNFT: (isNFT) => set({ isNFT }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearch: (search) => set({ search }),
  reset: () => set({ type: null, priceRange: [0, 1000], regionId: null, isNFT: null, sortBy: "popular", search: "" }),
}));