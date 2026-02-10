// src/services/cardano-wallet.ts
// ============================================
// Cardano CIP-30 Browser Wallet API
// NO external dependencies - uses the native
// browser wallet API directly
// Works with App Router, Turbopack, any bundler
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
// WALLET DETECTION
// ============================================

declare global {
  interface Window {
    cardano?: Record<string, {
      name: string;
      icon: string;
      apiVersion: string;
      enable(): Promise<CIP30WalletAPI>;
      isEnabled(): Promise<boolean>;
    }>;
  }
}

/**
 * Get list of installed CIP-30 wallets
 */
export function getInstalledWallets(): CIP30WalletInfo[] {
  if (typeof window === "undefined" || !window.cardano) return [];

  const knownWallets = ["nami", "eternl", "flint", "yoroi", "lace", "typhon", "gerowallet"];
  const wallets: CIP30WalletInfo[] = [];

  for (const id of knownWallets) {
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

  // Also detect any other CIP-30 wallets
  for (const [key, value] of Object.entries(window.cardano || {})) {
    if (
      !knownWallets.includes(key) &&
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
 * Connect to a specific wallet
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
 * Check if a wallet is already enabled/connected
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
// CBOR DECODING HELPERS (lightweight, no deps)
// ============================================

/**
 * Decode CBOR hex balance to lovelace + assets
 * The CIP-30 getBalance() returns CBOR-encoded value
 */
export function decodeCborBalance(cborHex: string): {
  lovelace: string;
  assets: { unit: string; quantity: string }[];
} {
  const bytes = hexToBytes(cborHex);

  // Simple CBOR decoding for Cardano balance
  // Balance is either:
  // - A single integer (lovelace only)
  // - An array of [lovelace, multiasset_map]

  const firstByte = bytes[0];

  // If it's a simple unsigned integer (major type 0)
  if (firstByte < 0x80) {
    return {
      lovelace: decodeCborUint(bytes).toString(),
      assets: [],
    };
  }

  // If CBOR integer with extra bytes (0x18, 0x19, 0x1a, 0x1b)
  if (firstByte >= 0x18 && firstByte <= 0x1b) {
    return {
      lovelace: decodeCborUint(bytes).toString(),
      assets: [],
    };
  }

  // If it's an array (major type 4) → [lovelace, multiasset]
  if (firstByte === 0x82) {
    // Array of 2 items
    let offset = 1;
    const { value: lovelace, bytesRead } = decodeCborUintAt(bytes, offset);
    offset += bytesRead;

    // Parse multi-asset map (simplified - returns raw units)
    const assets = parseMultiAssetMap(bytes, offset);

    return {
      lovelace: lovelace.toString(),
      assets,
    };
  }

  // Fallback: try to decode as simple integer
  try {
    return {
      lovelace: decodeCborUint(bytes).toString(),
      assets: [],
    };
  } catch {
    return { lovelace: "0", assets: [] };
  }
}

function decodeCborUint(bytes: Uint8Array): bigint {
  return decodeCborUintAt(bytes, 0).value;
}

function decodeCborUintAt(bytes: Uint8Array, offset: number): { value: bigint; bytesRead: number } {
  const first = bytes[offset];

  if (first < 24) {
    return { value: BigInt(first), bytesRead: 1 };
  }
  if (first === 0x18) {
    return { value: BigInt(bytes[offset + 1]), bytesRead: 2 };
  }
  if (first === 0x19) {
    const val = (bytes[offset + 1] << 8) | bytes[offset + 2];
    return { value: BigInt(val), bytesRead: 3 };
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
  // Simplified: full CBOR multi-asset parsing is complex
  // For MVP, we return empty and use getUtxos for full asset parsing
  // This will be enhanced when needed
  return [];
}

// ============================================
// HEX / ADDRESS UTILITIES
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

export function hexToAscii(hex: string): string {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    const code = parseInt(hex.substr(i, 2), 16);
    if (code >= 32 && code <= 126) {
      str += String.fromCharCode(code);
    }
  }
  return str;
}

/**
 * Convert bech32 address from hex to readable format
 * CIP-30 returns addresses as hex, we need to convert for display
 */
export function shortenAddress(hexAddress: string, chars = 8): string {
  if (!hexAddress) return "";
  // For display, just shorten the hex
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
