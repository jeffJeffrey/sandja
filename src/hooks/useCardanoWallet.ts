"use client";

import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@meshsdk/react";
import { useAuthStore } from "@/stores/auth-store";
import {
  formatLovelace,
  shortenAddress,
  parseAssets,
  isSandjaCoin,
  isSandjaNft,
  type ParsedAsset,
} from "@/services/cardano.service";
import { toast } from "sonner";

export interface WalletBalance {
  lovelace: string;
  adaFormatted: string;
  sandjaCoin: string;
  assets: ParsedAsset[];
  nfts: ParsedAsset[];
}

export function useCardanoWallet() {
  const {
    wallet,
    connected,
    name: walletName,
    connecting,
    connect,
    disconnect,
    error,
  } = useWallet();

  const { setWalletAddress, updateUser } = useAuthStore();

  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Fetch address when connected
  useEffect(() => {
    if (connected && wallet) {
      fetchAddress();
      fetchBalance();
    } else {
      setAddress("");
      setBalance(null);
      setWalletAddress(null);
    }
  }, [connected, wallet]);

  const fetchAddress = useCallback(async () => {
    if (!wallet) return;
    try {
      const addr = await wallet.getChangeAddress();
      setAddress(addr);
      setWalletAddress(addr);
    } catch (err) {
      console.error("Failed to get address:", err);
    }
  }, [wallet, setWalletAddress]);

  const fetchBalance = useCallback(async () => {
    if (!wallet) return;
    setIsLoadingBalance(true);
    try {
      const rawBalance = await wallet.getBalance();
      const lovelaceAsset = rawBalance.find(
        (a: any) => a.unit === "lovelace"
      );
      const lovelace = lovelaceAsset?.quantity || "0";

      const parsed = parseAssets(rawBalance);

      // Find SandjaCoin
      const sndj = parsed.find((a) => isSandjaCoin(a.unit));
      const sandjaCoinAmount = sndj?.quantity || "0";

      // Separate NFTs (quantity = 1 + is SANDJA policy)
      const nfts = parsed.filter(
        (a) => a.unit !== "lovelace" && isSandjaNft(a.policyId)
      );

      // Other assets (non-lovelace, non-SANDJA)
      const assets = parsed.filter(
        (a) =>
          a.unit !== "lovelace" &&
          !isSandjaNft(a.policyId) &&
          !isSandjaCoin(a.unit)
      );

      setBalance({
        lovelace,
        adaFormatted: formatLovelace(lovelace),
        sandjaCoin: sandjaCoinAmount,
        assets,
        nfts,
      });

      // Sync SandjaCoin to auth store
      if (sandjaCoinAmount !== "0") {
        updateUser({
          sandjaCoin: Number(sandjaCoinAmount) / Math.pow(10, 6),
        });
      }
    } catch (err) {
      console.error("Failed to get balance:", err);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [wallet, updateUser]);

  const connectWallet = useCallback(
    async (walletId: string) => {
      try {
        await connect(walletId);
        toast.success("Wallet connecté !");
      } catch (err) {
        toast.error("Échec de la connexion au wallet");
        console.error("Wallet connection error:", err);
      }
    },
    [connect]
  );

  const disconnectWallet = useCallback(async () => {
    try {
      disconnect();
      setAddress("");
      setBalance(null);
      setWalletAddress(null);
      toast.success("Wallet déconnecté");
    } catch (err) {
      toast.error("Échec de la déconnexion");
    }
  }, [disconnect, setWalletAddress]);

  return {
    // Mesh wallet instance
    wallet,

    // Connection state
    connected,
    connecting,
    walletName,
    error,

    // Address
    address,
    shortAddress: shortenAddress(address),

    // Balance
    balance,
    isLoadingBalance,

    // Actions
    connectWallet,
    disconnectWallet,
    refreshBalance: fetchBalance,
  };
}
