// // src/services/cardano.service.ts
// // ============================================
// // SERVER-ONLY - Do NOT import in client components
// // Use cardano-client.utils.ts for client-side code
// // ============================================

// import "server-only";
// import { BlockfrostProvider } from "@meshsdk/core";
// import { blockchainConfig } from "@/config/blockchain";

// // Re-export client utils for convenience in server code
// export * from "./cardano-client.utils";

// // ============================================
// // BLOCKFROST PROVIDER (server-only singleton)
// // ============================================

// let _provider: BlockfrostProvider | null = null;

// export function getBlockfrostProvider(): BlockfrostProvider {
//   if (!_provider) {
//     const apiKey = process.env.BLOCKFROST_API_KEY || "";
//     if (!apiKey) {
//       throw new Error("BLOCKFROST_API_KEY is not set");
//     }
//     _provider = new BlockfrostProvider(apiKey);
//   }
//   return _provider;
// }

// // ============================================
// // SERVER-SIDE BLOCKCHAIN QUERIES
// // ============================================

// export async function fetchAddressAssets(address: string) {
//   const provider = getBlockfrostProvider();
//   return provider.fetchAddressAssets(address);
// }

// export async function fetchAccountInfo(stakeAddress: string) {
//   const provider = getBlockfrostProvider();
//   return provider.fetchAccountInfo(stakeAddress);
// }

// export async function submitTransaction(signedTx: string) {
//   const provider = getBlockfrostProvider();
//   return provider.submitTx(signedTx);
// }