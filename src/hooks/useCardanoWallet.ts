"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  type CIP30WalletAPI,
  type CIP30WalletInfo,
  getInstalledWallets,
  connectWallet,
  isWalletEnabled,
  decodeCborBalance,
  formatLovelace,
  shortenAddress,
  isMobile,
} from "@/services/cardano-wallet";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
export interface WalletBalance {
  lovelace: string;
  adaFormatted: string;
  assets: { unit: string; quantity: string }[];
}
export function useCardanoWallet() {
  const [walletApi, setWalletApi] = useState<CIP30WalletAPI | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletName, setWalletName] = useState("");
  const [walletIcon, setWalletIcon] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [installedWallets, setInstalledWallets] = useState<CIP30WalletInfo[]>(
    [],
  );
  const [error, setError] = useState<string | null>(null);
  const { setWalletAddress } = useAuthStore();
  const hasAutoConnected = useRef(false);
  // Detect installed wallets on mount
  useEffect(() => {
    // Small delay to let wallet extensions inject into window.cardano
    const timer = setTimeout(() => {
      const wallets = getInstalledWallets();
      setInstalledWallets(wallets);
      // Auto-reconnect if previously connected
      const lastWallet = localStorage.getItem("sandja_wallet_id");
      if (lastWallet && !hasAutoConnected.current) {
        hasAutoConnected.current = true;
        isWalletEnabled(lastWallet).then((enabled) => {
          if (enabled) {
            handleConnect(lastWallet, true);
          }
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  const fetchBalance = useCallback(async (api: CIP30WalletAPI) => {
    setIsLoadingBalance(true);
    try {
      const cborBalance = await api.getBalance();
      const decoded = decodeCborBalance(cborBalance);
      setBalance({
        lovelace: decoded.lovelace,
        adaFormatted: formatLovelace(decoded.lovelace),
        assets: decoded.assets,
      });
    } catch (err) {
      console.error("Failed to get balance:", err);
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);
  const fetchAddress = useCallback(
    async (api: CIP30WalletAPI) => {
      try {
        const changeAddr = await api.getChangeAddress();
        setAddress(changeAddr);
        setWalletAddress(changeAddr);
      } catch (err) {
        console.error("Failed to get address:", err);
      }
    },
    [setWalletAddress],
  );
  const handleConnect = useCallback(
    async (walletId: string, silent = false) => {
      setConnecting(true);
      setError(null);
      try {
        const api = await connectWallet(walletId);
        setWalletApi(api);
        setConnected(true);
        // Get wallet info
        const walletInfo = getInstalledWallets().find((w) => w.id === walletId);
        setWalletName(walletInfo?.name || walletId);
        setWalletIcon(walletInfo?.icon || "");
        // Save for auto-reconnect
        localStorage.setItem("sandja_wallet_id", walletId);
        // Fetch data
        await fetchAddress(api);
        await fetchBalance(api);
        if (!silent) {
          toast.success("Wallet connecté !");
        }
      } catch (err: any) {
        const msg = err?.message || "Échec de la connexion";
        setError(msg);
        if (!silent) {
          toast.error(msg);
        }
        console.error("Wallet connection error:", err);
      } finally {
        setConnecting(false);
      }
    },
    [fetchAddress, fetchBalance],
  );
  const handleDisconnect = useCallback(() => {
    setWalletApi(null);
    setConnected(false);
    setWalletName("");
    setWalletIcon("");
    setAddress("");
    setBalance(null);
    setError(null);
    setWalletAddress(null);
    localStorage.removeItem("sandja_wallet_id");
    toast.success("Wallet déconnecté");
  }, [setWalletAddress]);
  const refreshBalance = useCallback(async () => {
    if (walletApi) {
      await fetchBalance(walletApi);
    }
  }, [walletApi, fetchBalance]);
  return {
    // State
    connected,
    connecting,
    walletName,
    walletIcon,
    address,
    shortAddress: shortenAddress(address),
    balance,
    isLoadingBalance,
    installedWallets,
    error,
    walletApi,
    // Actions
    connect: handleConnect,
    disconnect: handleDisconnect,
    refreshBalance,
  };
}
