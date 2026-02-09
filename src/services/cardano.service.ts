import { BlockfrostProvider } from "@meshsdk/core";
import { blockchainConfig, type CardanoNetwork } from "@/config/blockchain";

// ============================================
// BLOCKFROST PROVIDER SINGLETON
// ============================================

let _provider: BlockfrostProvider | null = null;

export function getBlockfrostProvider(): BlockfrostProvider {
  if (!_provider) {
    const apiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "";
    const network = blockchainConfig.network;
    const url = blockchainConfig.networks[network].blockfrostUrl;

    if (apiKey) {
      _provider = new BlockfrostProvider(apiKey);
    } else {
      // Fallback: use the URL format for public testnet
      _provider = new BlockfrostProvider(url);
    }
  }
  return _provider;
}

// ============================================
// WALLET HELPERS
// ============================================

export function formatLovelace(lovelace: string | number | bigint): string {
  const ada = Number(lovelace) / 1_000_000;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(ada);
}

export function lovelaceToAda(lovelace: string | number): number {
  return Number(lovelace) / 1_000_000;
}

export function adaToLovelace(ada: number): string {
  return String(Math.floor(ada * 1_000_000));
}

export function shortenAddress(address: string, chars = 8): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function getExplorerUrl(
  type: "tx" | "address" | "token" | "policy",
  hash: string,
  network?: CardanoNetwork
): string {
  const net = network || blockchainConfig.network;
  const { explorerUrl } = blockchainConfig.networks[net];

  const paths: Record<string, string> = {
    tx: "transaction",
    address: "address",
    token: "token",
    policy: "tokenPolicy",
  };

  return `${explorerUrl}/${paths[type] || ""}/${hash}`;
}

// ============================================
// ASSET HELPERS
// ============================================

export interface ParsedAsset {
  unit: string;
  policyId: string;
  assetName: string;
  assetNameHex: string;
  quantity: string;
  displayName: string;
}

export function parseAssetUnit(unit: string): {
  policyId: string;
  assetNameHex: string;
} {
  if (unit === "lovelace") {
    return { policyId: "", assetNameHex: "" };
  }
  const policyId = unit.slice(0, 56);
  const assetNameHex = unit.slice(56);
  return { policyId, assetNameHex };
}

export function hexToAscii(hex: string): string {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

export function parseAssets(
  balance: { unit: string; quantity: string }[]
): ParsedAsset[] {
  return balance.map((asset) => {
    const { policyId, assetNameHex } = parseAssetUnit(asset.unit);
    const displayName =
      asset.unit === "lovelace"
        ? "ADA"
        : hexToAscii(assetNameHex) || assetNameHex.slice(0, 8);

    return {
      unit: asset.unit,
      policyId,
      assetName: hexToAscii(assetNameHex),
      assetNameHex,
      quantity: asset.quantity,
      displayName,
    };
  });
}

// ============================================
// NFT HELPERS
// ============================================

export function isSandjaNft(policyId: string): boolean {
  return policyId === blockchainConfig.nft.collection.policyId;
}

export function isSandjaCoin(unit: string): boolean {
  const { policyId } = parseAssetUnit(unit);
  return policyId === blockchainConfig.token.policyId;
}

export function getIpfsUrl(ipfsUri: string): string {
  if (!ipfsUri) return "";
  if (ipfsUri.startsWith("ipfs://")) {
    return `${blockchainConfig.nft.ipfs.gateway}${ipfsUri.slice(7)}`;
  }
  return ipfsUri;
}
