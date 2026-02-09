import { create } from "zustand";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "USER" | "ARTISAN" | "ADMIN";
  level: number;
  xp: number;
  sandjaCoin: number;
  streak: number;
  walletAddress?: string | null;
  locale: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: AuthUser | null) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  setWalletAddress: (address: string | null) => void;
  clear: () => void;
}

// XP thresholds per level
const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 10000];

function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  addXp: (amount) =>
    set((state) => {
      if (!state.user) return state;
      const newXp = state.user.xp + amount;
      const newLevel = calculateLevel(newXp);
      return {
        user: { ...state.user, xp: newXp, level: newLevel },
      };
    }),

  addCoins: (amount) =>
    set((state) => {
      if (!state.user) return state;
      return {
        user: { ...state.user, sandjaCoin: state.user.sandjaCoin + amount },
      };
    }),

  setWalletAddress: (address) =>
    set((state) => ({
      user: state.user ? { ...state.user, walletAddress: address } : null,
    })),

  clear: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));
