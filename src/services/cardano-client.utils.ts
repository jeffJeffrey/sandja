// // src/services/cardano-client.utils.ts
// // ============================================
// // CLIENT-SAFE utilities (no @meshsdk/core imports)
// // These can be used in "use client" components
// // ============================================

// import { blockchainConfig, type CardanoNetwork } from "@/config/blockchain";

// export function formatLovelace(lovelace: string | number | bigint): string {
//   const ada = Number(lovelace) / 1_000_000;
//   return new Intl.NumberFormat("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 6,
//   }).format(ada);
// }

// export function lovelaceToAda(lovelace: string | number): number {
//   return Number(lovelace) / 1_000_000;
// }

// export function adaToLovelace(ada: number): string {
//   return String(Math.floor(ada * 1_000_000));
// }

// export function shortenAddress(address: string, chars = 8): string {
//   if (!address) return "";
//   return `${address.slice(0, chars)}...${address.slice(-chars)}`;
// }

// export function getExplorerUrl(
//   type: "tx" | "address" | "token" | "policy",
//   hash: string,
//   network?: CardanoNetwork
// ): string {
//   const net = network || blockchainConfig.network;
//   const { explorerUrl } = blockchainConfig.networks[net];
//   const paths: Record<string, string> = {
//     tx: "transaction",
//     address: "address",
//     token: "token",
//     policy: "tokenPolicy",
//   };
//   return `${explorerUrl}/${paths[type] || ""}/${hash}`;
// }

// export interface ParsedAsset {
//   unit: string;
//   policyId: string;
//   assetName: string;
//   assetNameHex: string;
//   quantity: string;
//   displayName: string;
// }

// export function parseAssetUnit(unit: string): {
//   policyId: string;
//   assetNameHex: string;
// } {
//   if (unit === "lovelace") return { policyId: "", assetNameHex: "" };
//   return { policyId: unit.slice(0, 56), assetNameHex: unit.slice(56) };
// }

// export function hexToAscii(hex: string): string {
//   let str = "";
//   for (let i = 0; i < hex.length; i += 2) {
//     str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
//   }
//   return str;
// }

// export function parseAssets(
//   balance: { unit: string; quantity: string }[]
// ): ParsedAsset[] {
//   return balance.map((asset) => {
//     const { policyId, assetNameHex } = parseAssetUnit(asset.unit);
//     const displayName =
//       asset.unit === "lovelace"
//         ? "ADA"
//         : hexToAscii(assetNameHex) || assetNameHex.slice(0, 8);
//     return {
//       unit: asset.unit,
//       policyId,
//       assetName: hexToAscii(assetNameHex),
//       assetNameHex,
//       quantity: asset.quantity,
//       displayName,
//     };
//   });
// }

// export function isSandjaNft(policyId: string): boolean {
//   return (
//     !!blockchainConfig.nft.collection.policyId &&
//     policyId === blockchainConfig.nft.collection.policyId
//   );
// }

// export function isSandjaCoin(unit: string): boolean {
//   if (!blockchainConfig.token.policyId) return false;
//   const { policyId } = parseAssetUnit(unit);
//   return policyId === blockchainConfig.token.policyId;
// }

// export function getIpfsUrl(ipfsUri: string): string {
//   if (!ipfsUri) return "";
//   if (ipfsUri.startsWith("ipfs://")) {
//     return `${blockchainConfig.nft.ipfs.gateway}${ipfsUri.slice(7)}`;
//   }
//   return ipfsUri;
// }