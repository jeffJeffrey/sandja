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
  isMobileDevice,
  isCIP30Available,
  isInsideDAppBrowser,
  openWalletDAppBrowser,
  getMobileWallets,
  getWalletStoreUrl,
  SUPPORTED_WALLETS,
  lovelaceToAda,
} from "@/services/cardano-wallet";
import { ensureBech32 } from "@/lib/bech32";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

export interface WalletBalance {
  lovelace: string;
  ada: number;
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
  const [installedWallets, setInstalledWallets] = useState<CIP30WalletInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  // Mobile-specific state
  const [isMobile, setIsMobile] = useState(false);
  const [isInDAppBrowser, setIsInDAppBrowser] = useState(false);
  const { setWalletAddress } = useAuthStore();
  const hasAutoConnected = useRef(false);

  // Detect environment on mount
  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);

    // Delay detection to let wallet extensions/DApp browser inject window.cardano
    const timer = setTimeout(() => {
      const dappBrowser = isInsideDAppBrowser();
      const cip30 = isCIP30Available();
      setIsInDAppBrowser(dappBrowser);

      // CIP-30 available — either desktop extensions or mobile DApp browser
      if (cip30) {
        const wallets = getInstalledWallets();
        setInstalledWallets(wallets);

        // Auto-reconnect
        const lastWallet = localStorage.getItem("sandja_wallet_id");
        if (lastWallet && !hasAutoConnected.current) {
          hasAutoConnected.current = true;
          isWalletEnabled(lastWallet).then((enabled) => {
            if (enabled) {
              handleConnect(lastWallet, true);
            }
          });
        }
      }
    }, 800); // Slightly longer delay for mobile DApp browsers

    return () => clearTimeout(timer);
  }, []);

  const fetchBalance = useCallback(async (api: CIP30WalletAPI) => {
    setIsLoadingBalance(true);
    try {
      const cborBalance = await api.getBalance();
      const decoded = decodeCborBalance(cborBalance);
      setBalance({
        lovelace: decoded.lovelace,
        ada: lovelaceToAda(decoded.lovelace),
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
        // Prefer used addresses if available, fallback to change address
        let rawHex = await api.getChangeAddress();
        const usedAddresses = await api.getUsedAddresses();
        if (usedAddresses.length > 0) {
          rawHex = usedAddresses[0];
        }
        // Convert hex to bech32
        const bech32Addr = ensureBech32(rawHex);
        setAddress(bech32Addr);
        setWalletAddress(bech32Addr);
        console.log("[SANDJA] Address hex:", rawHex);
        console.log("[SANDJA] Address bech32:", bech32Addr);
      } catch (err) {
        console.error("Failed to get address:", err);
      }
    },
    [setWalletAddress]
  );

  const handleConnect = useCallback(
    async (walletId: string, silent = false) => {
      setConnecting(true);
      setError(null);
      try {
        const api = await connectWallet(walletId);
        setWalletApi(api);
        setConnected(true);
        const walletInfo = getInstalledWallets().find((w) => w.id === walletId);
        setWalletName(walletInfo?.name || walletId);
        setWalletIcon(walletInfo?.icon || "");
        localStorage.setItem("sandja_wallet_id", walletId);
        await fetchAddress(api);
        await fetchBalance(api);
        if (!silent) toast.success("Wallet connecté !");
      } catch (err: any) {
        const msg = err?.message || "Échec de la connexion";
        setError(msg);
        if (!silent) toast.error(msg);
      } finally {
        setConnecting(false);
      }
    },
    [fetchAddress, fetchBalance]
  );

  /**
   * Mobile-specific: open the wallet's DApp browser
   * The wallet app will open our URL in its built-in browser,
   * injecting window.cardano automatically
   */
  const openInWalletBrowser = useCallback((walletId: string) => {
    openWalletDAppBrowser(walletId);
  }, []);

  /**
   * Mobile-specific: get link to install a wallet from app store
   */
  const getInstallUrl = useCallback((walletId: string): string | null => {
    return getWalletStoreUrl(walletId);
  }, []);

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
    if (walletApi) await fetchBalance(walletApi);
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
    isMobile,
    isInDAppBrowser,
    hasCIP30: installedWallets.length > 0,
    mobileWallets: getMobileWallets(),
    supportedWallets: SUPPORTED_WALLETS,
    connect: handleConnect,
    disconnect: handleDisconnect,
    refreshBalance,
    openInWalletBrowser,
    getInstallUrl,
  };
}