// src/stores/filter-store.ts
import { create } from "zustand";
import type { SymbolCategory, SymbolTheme, ProductType } from "@/types";

interface SymbolFilterState {
  search: string;
  category: SymbolCategory | null;
  theme: SymbolTheme | null;
  regionId: string | null;
  
  setSearch: (search: string) => void;
  setCategory: (category: SymbolCategory | null) => void;
  setTheme: (theme: SymbolTheme | null) => void;
  setRegionId: (regionId: string | null) => void;
  reset: () => void;
}

export const useSymbolFilterStore = create<SymbolFilterState>((set) => ({
  search: "",
  category: null,
  theme: null,
  regionId: null,
  
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setTheme: (theme) => set({ theme }),
  setRegionId: (regionId) => set({ regionId }),
  reset: () => set({ search: "", category: null, theme: null, regionId: null }),
}));

interface ProductFilterState {
  search: string;
  type: ProductType | null;
  regionId: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  inStock: boolean;
  sortBy: "price" | "newest" | "popular";
  
  setSearch: (search: string) => void;
  setType: (type: ProductType | null) => void;
  setRegionId: (regionId: string | null) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setInStock: (inStock: boolean) => void;
  setSortBy: (sortBy: "price" | "newest" | "popular") => void;
  reset: () => void;
}

export const useProductFilterStore = create<ProductFilterState>((set) => ({
  search: "",
  type: null,
  regionId: null,
  minPrice: null,
  maxPrice: null,
  inStock: false,
  sortBy: "newest",
  
  setSearch: (search) => set({ search }),
  setType: (type) => set({ type }),
  setRegionId: (regionId) => set({ regionId }),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
  setInStock: (inStock) => set({ inStock }),
  setSortBy: (sortBy) => set({ sortBy }),
  reset: () => set({
    search: "",
    type: null,
    regionId: null,
    minPrice: null,
    maxPrice: null,
    inStock: false,
    sortBy: "newest",
  }),
}));
