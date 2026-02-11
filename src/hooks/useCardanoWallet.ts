// src/hooks/useCardanoWallet.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  type CIP30WalletAPI,
  type CIP30WalletInfo,
  getInstalledWallets,
  connectWallet,
  isWalletEnabled,
  isMobileDevice,
  isInsideDAppBrowser,
  isCIP30Available,
  getMobileWallets,
  openWalletDAppBrowser,
  decodeCborBalance,
  formatLovelace,
  lovelaceToAda,
} from "@/services/cardano-wallet";
import { ensureBech32, hexToBech32Address } from "@/lib/bech32";

export interface WalletBalance {
  lovelace: string;
  ada: number;
  adaFormatted: string;
  assets: { unit: string; quantity: string }[];
}

export interface UseCardanoWalletReturn {
  // State
  connected: boolean;
  connecting: boolean;
  walletId: string | null;
  walletApi: CIP30WalletAPI | null;
  address: string | null;       // bech32 format (addr_test1... or addr1...)
  addressHex: string | null;    // raw hex from CIP-30
  balance: WalletBalance | null;
  installedWallets: CIP30WalletInfo[];
  error: string | null;

  // Mobile
  isMobile: boolean;
  isInDAppBrowser: boolean;

  // Actions
  connect: (walletId: string) => Promise<boolean>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  openMobileWallet: (walletId: string) => void;
}

export function useCardanoWallet(): UseCardanoWalletReturn {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [walletApi, setWalletApi] = useState<CIP30WalletAPI | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [addressHex, setAddressHex] = useState<string | null>(null);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [installedWallets, setInstalledWallets] = useState<CIP30WalletInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isInDAppBrowser, setIsInDAppBrowser] = useState(false);

  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Detect wallets on mount
  useEffect(() => {
    setIsMobile(isMobileDevice());
    setIsInDAppBrowser(isInsideDAppBrowser());

    // Small delay for extensions to inject
    const timer = setTimeout(() => {
      const wallets = getInstalledWallets();
      setInstalledWallets(wallets);

      // Auto-reconnect if previously connected
      const savedWallet = localStorage.getItem("sandja-wallet");
      if (savedWallet && wallets.some((w) => w.id === savedWallet)) {
        connect(savedWallet);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fetch balance and convert addresses from hex → bech32
   */
  const refreshBalance = useCallback(async () => {
    if (!walletApi) return;

    try {
      // Get raw hex balance via CIP-30
      const balanceCbor = await walletApi.getBalance();
      const decoded = decodeCborBalance(balanceCbor);

      setBalance({
        lovelace: decoded.lovelace,
        ada: lovelaceToAda(decoded.lovelace),
        adaFormatted: formatLovelace(decoded.lovelace),
        assets: decoded.assets,
      });

      // Get address and convert hex → bech32
      const usedAddresses = await walletApi.getUsedAddresses();
      if (usedAddresses.length > 0) {
        const rawHex = usedAddresses[0];
        setAddressHex(rawHex);

        // ★ KEY FIX: Convert CIP-30 hex address → bech32
        const bech32Addr = ensureBech32(rawHex);
        setAddress(bech32Addr);

        console.log("[SANDJA] Address hex:", rawHex);
        console.log("[SANDJA] Address bech32:", bech32Addr);
      } else {
        // Try change address as fallback
        const changeAddr = await walletApi.getChangeAddress();
        if (changeAddr) {
          setAddressHex(changeAddr);
          setAddress(ensureBech32(changeAddr));
        }
      }
    } catch (err) {
      console.error("[SANDJA] Error refreshing balance:", err);
    }
  }, [walletApi]);

  /**
   * Connect to a CIP-30 wallet
   */
  const connect = useCallback(
    async (id: string): Promise<boolean> => {
      setConnecting(true);
      setError(null);

      try {
        const api = await connectWallet(id);
        setWalletApi(api);
        setWalletId(id);
        setConnected(true);
        localStorage.setItem("sandja-wallet", id);

        // Fetch balance & address immediately
        const balanceCbor = await api.getBalance();
        const decoded = decodeCborBalance(balanceCbor);
        setBalance({
          lovelace: decoded.lovelace,
          ada: lovelaceToAda(decoded.lovelace),
          adaFormatted: formatLovelace(decoded.lovelace),
          assets: decoded.assets,
        });

        // Get and convert address
        const usedAddresses = await api.getUsedAddresses();
        const rawHex = usedAddresses?.[0] || (await api.getChangeAddress());
        if (rawHex) {
          setAddressHex(rawHex);
          const bech32Addr = ensureBech32(rawHex);
          setAddress(bech32Addr);
          console.log("[SANDJA] Connected! Address:", bech32Addr);
        }

        // Auto-refresh balance every 30s
        if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = setInterval(async () => {
          try {
            const b = await api.getBalance();
            const d = decodeCborBalance(b);
            setBalance({
              lovelace: d.lovelace,
              ada: lovelaceToAda(d.lovelace),
              adaFormatted: formatLovelace(d.lovelace),
              assets: d.assets,
            });
          } catch {}
        }, 30_000);

        return true;
      } catch (err: any) {
        const msg = err?.message || "Échec de la connexion";
        setError(msg);
        console.error("[SANDJA] Wallet connection error:", msg);
        return false;
      } finally {
        setConnecting(false);
      }
    },
    []
  );

  const disconnect = useCallback(() => {
    setConnected(false);
    setWalletApi(null);
    setWalletId(null);
    setAddress(null);
    setAddressHex(null);
    setBalance(null);
    setError(null);
    localStorage.removeItem("sandja-wallet");
    if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
  }, []);

  const openMobileWallet = useCallback((id: string) => {
    openWalletDAppBrowser(id);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, []);

  return {
    connected,
    connecting,
    walletId,
    walletApi,
    address,      // ← bech32 (addr_test1...) — safe for Blockfrost
    addressHex,   // ← raw hex from CIP-30
    balance,
    installedWallets,
    error,
    isMobile,
    isInDAppBrowser,
    connect,
    disconnect,
    refreshBalance,
    openMobileWallet,
  };
}