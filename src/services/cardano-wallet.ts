// src/services/cardano-wallet.ts
// ============================================
// Cardano CIP-30 Browser Wallet API
// + Mobile Deep Link Support
// + DApp Browser Detection
// ============================================

// CIP-30 Wallet API types
export interface CIP30WalletInfo {
  id: string;
  name: string;
  icon: string;
  apiVersion: string;
  isEnabled: boolean;
}

export interface CIP30WalletAPI {
  getNetworkId(): Promise<number>;
  getUtxos(): Promise<string[] | undefined>;
  getBalance(): Promise<string>;
  getUsedAddresses(): Promise<string[]>;
  getUnusedAddresses(): Promise<string[]>;
  getChangeAddress(): Promise<string>;
  getRewardAddresses(): Promise<string[]>;
  signTx(tx: string, partialSign?: boolean): Promise<string>;
  signData(addr: string, payload: string): Promise<{ signature: string; key: string }>;
  submitTx(tx: string): Promise<string>;
  getCollateral?(): Promise<string[] | undefined>;
}

// ============================================
// MOBILE / DESKTOP DETECTION
// ============================================

declare global {
  interface Window {
    cardano?: Record<
      string,
      {
        name: string;
        icon: string;
        apiVersion: string;
        enable(): Promise<CIP30WalletAPI>;
        isEnabled(): Promise<boolean>;
      }
    >;
  }
}

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Detect if we're running inside a wallet's DApp browser.
 * When opened inside Eternl/VESPR/Flint mobile DApp browser,
 * window.cardano is injected just like on desktop.
 */
export function isInsideDAppBrowser(): boolean {
  if (typeof window === "undefined") return false;
  // If we're on mobile AND window.cardano exists, we're in a DApp browser
  return isMobileDevice() && !!window.cardano && Object.keys(window.cardano).length > 0;
}

/**
 * Detect if CIP-30 is available (desktop extensions OR mobile DApp browser)
 */
export function isCIP30Available(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.cardano && Object.keys(window.cardano).length > 0;
}

// ============================================
// SUPPORTED WALLETS CONFIG (with deep links)
// ============================================

export interface WalletConfig {
  id: string;
  name: string;
  icon: string;
  downloadUrl: string;
  hasMobileApp: boolean;
  deepLink: {
    android?: string;
    ios?: string;
    universal?: string;
  };
  /** The mobile DApp browser opens URLs and injects CIP-30 */
  dappBrowserSupported: boolean;
  storeUrls: {
    android?: string;
    ios?: string;
    chrome?: string;
  };
}

export const SUPPORTED_WALLETS: WalletConfig[] = [
  {
    id: "eternl",
    name: "Eternl",
    icon: "/images/wallets/eternl.png",
    downloadUrl: "https://eternl.io",
    hasMobileApp: true,
    deepLink: {
      // Eternl's mobile app can open dApp URLs in its built-in browser
      android: "intent://eternl.io/#Intent;scheme=https;package=io.ccvault.mobile;end",
      ios: "eternl://",
      universal: "https://eternl.io/app",
    },
    dappBrowserSupported: true,
    storeUrls: {
      android: "https://play.google.com/store/apps/details?id=io.ccvault.mobile",
      ios: "https://apps.apple.com/app/eternl-by-tastenkunst/id1603854021",
      chrome: "https://chrome.google.com/webstore/detail/eternl/kmhcihpebfmpgmihbkipmjlmmioameka",
    },
  },
  {
    id: "vespr",
    name: "VESPR",
    icon: "/images/wallets/vespr.png",
    downloadUrl: "https://vespr.xyz",
    hasMobileApp: true,
    deepLink: {
      android: "intent://vespr.xyz/#Intent;scheme=https;package=art.nft_craze.gallery.prod;end",
      ios: "vespr://",
      universal: "https://vespr.xyz",
    },
    dappBrowserSupported: true,
    storeUrls: {
      android: "https://play.google.com/store/apps/details?id=art.nft_craze.gallery.prod",
      ios: "https://apps.apple.com/app/vespr-cardano-wallet/id1565749376",
      chrome: "https://chrome.google.com/webstore/detail/vespr/bedogdpkmjkgehigkdoagkjpficmhhgj",
    },
  },
  {
    id: "lace",
    name: "Lace",
    icon: "/images/wallets/lace.png",
    downloadUrl: "https://www.lace.io",
    hasMobileApp: false, // Lace mobile is still in development
    deepLink: {},
    dappBrowserSupported: false,
    storeUrls: {
      chrome: "https://chrome.google.com/webstore/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk",
    },
  },
  {
    id: "nami",
    name: "Nami",
    icon: "/images/wallets/nami.png",
    downloadUrl: "https://namiwallet.io",
    hasMobileApp: false,
    deepLink: {},
    dappBrowserSupported: false,
    storeUrls: {
      chrome: "https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo",
    },
  },
  {
    id: "flint",
    name: "Flint",
    icon: "/images/wallets/flint.png",
    downloadUrl: "https://flint-wallet.com",
    hasMobileApp: true,
    deepLink: {
      android: "intent://flint-wallet.com/#Intent;scheme=https;package=io.flint_wallet;end",
      ios: "flint://",
      universal: "https://flint-wallet.com",
    },
    dappBrowserSupported: true,
    storeUrls: {
      android: "https://play.google.com/store/apps/details?id=io.flint_wallet",
      ios: "https://apps.apple.com/app/flint-wallet/id1619660885",
      chrome: "https://chrome.google.com/webstore/detail/flint/hnhobjmcibchnmglfbldbfabcgaknlkj",
    },
  },
  {
    id: "yoroi",
    name: "Yoroi",
    icon: "/images/wallets/yoroi.png",
    downloadUrl: "https://yoroi-wallet.com",
    hasMobileApp: true,
    deepLink: {
      android: "intent://yoroi-wallet.com/#Intent;scheme=https;package=com.emurgo;end",
      universal: "https://yoroi-wallet.com",
    },
    dappBrowserSupported: false,
    storeUrls: {
      android: "https://play.google.com/store/apps/details?id=com.emurgo",
      ios: "https://apps.apple.com/app/emurgos-yoroi-cardano-wallet/id1447326389",
      chrome: "https://chrome.google.com/webstore/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb",
    },
  },
];

// ============================================
// WALLET DETECTION (CIP-30)
// ============================================

/**
 * Get list of installed CIP-30 wallets (works on desktop + mobile DApp browsers)
 */
export function getInstalledWallets(): CIP30WalletInfo[] {
  if (typeof window === "undefined" || !window.cardano) return [];

  const wallets: CIP30WalletInfo[] = [];
  const knownIds = SUPPORTED_WALLETS.map((w) => w.id);

  // Check known wallets first
  for (const id of knownIds) {
    const wallet = window.cardano?.[id];
    if (wallet) {
      wallets.push({
        id,
        name: wallet.name,
        icon: wallet.icon,
        apiVersion: wallet.apiVersion,
        isEnabled: false,
      });
    }
  }

  // Detect unknown CIP-30 wallets
  for (const [key, value] of Object.entries(window.cardano || {})) {
    if (
      !knownIds.includes(key) &&
      value &&
      typeof value === "object" &&
      "enable" in value &&
      "name" in value
    ) {
      wallets.push({
        id: key,
        name: value.name,
        icon: value.icon,
        apiVersion: value.apiVersion,
        isEnabled: false,
      });
    }
  }

  return wallets;
}

/**
 * Connect to a specific wallet via CIP-30
 */
export async function connectWallet(walletId: string): Promise<CIP30WalletAPI> {
  if (typeof window === "undefined" || !window.cardano) {
    throw new Error("No Cardano wallets available");
  }

  const walletProvider = window.cardano[walletId];
  if (!walletProvider) {
    throw new Error(`Wallet "${walletId}" not found`);
  }

  const api = await walletProvider.enable();
  return api;
}

/**
 * Check if a wallet is already enabled
 */
export async function isWalletEnabled(walletId: string): Promise<boolean> {
  if (typeof window === "undefined" || !window.cardano) return false;
  const walletProvider = window.cardano[walletId];
  if (!walletProvider) return false;
  try {
    return await walletProvider.isEnabled();
  } catch {
    return false;
  }
}

// ============================================
// MOBILE DEEP LINK FUNCTIONS
// ============================================

/**
 * Get the current dApp URL to open in a mobile wallet's DApp browser
 */
function getCurrentDAppUrl(): string {
  if (typeof window === "undefined") return "";
  return window.location.href;
}

/**
 * Open a wallet's mobile app, asking it to open our dApp in its built-in browser.
 * This is how mobile users connect — they open SANDJA *from inside the wallet app*.
 */
export function openWalletDAppBrowser(walletId: string): void {
  const config = SUPPORTED_WALLETS.find((w) => w.id === walletId);
  if (!config) return;

  const dAppUrl = getCurrentDAppUrl();
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  if (isAndroid && config.deepLink.android) {
    // Try to open the app with the current URL context
    window.location.href = config.deepLink.android;

    // Fallback to Play Store if app isn't installed (after short timeout)
    setTimeout(() => {
      if (config.storeUrls.android) {
        window.location.href = config.storeUrls.android;
      }
    }, 2500);
  } else if (isIOS && config.deepLink.ios) {
    // Try iOS deep link
    window.location.href = config.deepLink.ios;

    // Fallback to App Store
    setTimeout(() => {
      if (config.storeUrls.ios) {
        window.location.href = config.storeUrls.ios;
      }
    }, 2500);
  } else if (config.deepLink.universal) {
    // Universal link fallback
    window.open(config.deepLink.universal, "_blank");
  } else if (config.downloadUrl) {
    window.open(config.downloadUrl, "_blank");
  }
}

/**
 * Get the app store URL for a specific wallet based on current platform
 */
export function getWalletStoreUrl(walletId: string): string | null {
  const config = SUPPORTED_WALLETS.find((w) => w.id === walletId);
  if (!config) return null;

  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  if (isAndroid && config.storeUrls.android) return config.storeUrls.android;
  if (isIOS && config.storeUrls.ios) return config.storeUrls.ios;
  if (config.storeUrls.chrome) return config.storeUrls.chrome;
  return config.downloadUrl;
}

/**
 * Get wallets available for mobile (those with DApp browser support)
 */
export function getMobileWallets(): WalletConfig[] {
  return SUPPORTED_WALLETS.filter((w) => w.hasMobileApp && w.dappBrowserSupported);
}

/**
 * Get wallets available for desktop (those with browser extensions)
 */
export function getDesktopWallets(): WalletConfig[] {
  return SUPPORTED_WALLETS.filter((w) => w.storeUrls.chrome);
}

// ============================================
// CBOR DECODING HELPERS
// ============================================

export function decodeCborBalance(cborHex: string): {
  lovelace: string;
  assets: { unit: string; quantity: string }[];
} {
  const bytes = hexToBytes(cborHex);
  const firstByte = bytes[0];

  if (firstByte < 0x80) {
    return { lovelace: decodeCborUint(bytes).toString(), assets: [] };
  }
  if (firstByte >= 0x18 && firstByte <= 0x1b) {
    return { lovelace: decodeCborUint(bytes).toString(), assets: [] };
  }
  if (firstByte === 0x82) {
    let offset = 1;
    const { value: lovelace, bytesRead } = decodeCborUintAt(bytes, offset);
    offset += bytesRead;
    const assets = parseMultiAssetMap(bytes, offset);
    return { lovelace: lovelace.toString(), assets };
  }

  try {
    return { lovelace: decodeCborUint(bytes).toString(), assets: [] };
  } catch {
    return { lovelace: "0", assets: [] };
  }
}

function decodeCborUint(bytes: Uint8Array): bigint {
  return decodeCborUintAt(bytes, 0).value;
}

function decodeCborUintAt(
  bytes: Uint8Array,
  offset: number
): { value: bigint; bytesRead: number } {
  const first = bytes[offset];
  if (first < 24) return { value: BigInt(first), bytesRead: 1 };
  if (first === 0x18) return { value: BigInt(bytes[offset + 1]), bytesRead: 2 };
  if (first === 0x19) {
    return { value: BigInt((bytes[offset + 1] << 8) | bytes[offset + 2]), bytesRead: 3 };
  }
  if (first === 0x1a) {
    const val =
      (bytes[offset + 1] << 24) |
      (bytes[offset + 2] << 16) |
      (bytes[offset + 3] << 8) |
      bytes[offset + 4];
    return { value: BigInt(val >>> 0), bytesRead: 5 };
  }
  if (first === 0x1b) {
    let val = BigInt(0);
    for (let i = 0; i < 8; i++) {
      val = (val << BigInt(8)) | BigInt(bytes[offset + 1 + i]);
    }
    return { value: val, bytesRead: 9 };
  }
  return { value: BigInt(first & 0x1f), bytesRead: 1 };
}

function parseMultiAssetMap(
  _bytes: Uint8Array,
  _offset: number
): { unit: string; quantity: string }[] {
  return [];
}

// ============================================
// UTILITIES
// ============================================

export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function shortenAddress(hexAddress: string, chars = 8): string {
  if (!hexAddress) return "";
  return `${hexAddress.slice(0, chars)}...${hexAddress.slice(-chars)}`;
}

export function formatLovelace(lovelace: string | bigint): string {
  const ada = Number(BigInt(lovelace)) / 1_000_000;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(ada);
}

export function lovelaceToAda(lovelace: string | bigint): number {
  return Number(BigInt(lovelace)) / 1_000_000;
}