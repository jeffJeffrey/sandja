// src/config/blockchain.ts
// ============================================
// SANDJA Blockchain Configuration
// Network: Preview Testnet
// ============================================

export type CardanoNetwork = "preview" | "preprod" | "mainnet";

export const blockchainConfig = {
  network: (process.env.NEXT_PUBLIC_CARDANO_NETWORK || "preview") as CardanoNetwork,

  // Platform wallet — receives ADA payments
  sellerAddress:
    process.env.SELLER_WALLET_ADDRESS ||
    "addr_test1qrnacf9s53uce4u0nq72mut2qlszrxlpmpu8z2zdx80xywq5xs7n49j8yh36pl44hgp7kf6vfak2wppy98cst5ru0z7qg3enuq",

  networks: {
    preview: {
      name: "Preview Testnet",
      networkId: 0,
      blockfrostUrl: "https://cardano-preview.blockfrost.io/api/v0",
      explorerUrl: "https://preview.cardanoscan.io",
      faucetUrl: "https://docs.cardano.org/cardano-testnet/tools/faucet",
    },
    preprod: {
      name: "Pre-Production Testnet",
      networkId: 0,
      blockfrostUrl: "https://cardano-preprod.blockfrost.io/api/v0",
      explorerUrl: "https://preprod.cardanoscan.io",
      faucetUrl: "https://docs.cardano.org/cardano-testnet/tools/faucet",
    },
    mainnet: {
      name: "Mainnet",
      networkId: 1,
      blockfrostUrl: "https://cardano-mainnet.blockfrost.io/api/v0",
      explorerUrl: "https://cardanoscan.io",
      faucetUrl: null,
    },
  },

  token: {
    name: "SandjaCoin",
    symbol: "SNDJ",
    policyId: process.env.NEXT_PUBLIC_SANDJA_POLICY_ID || "9ea1975866f677abac205447e4419ffe709c84dadacef658fc57c7dd",
    assetName: "SNDJ",
  },

  nft: {
    policyId: process.env.NEXT_PUBLIC_NFT_POLICY_ID || "1b7e22543fea82834cd28393ebca7a7f735b64089b3008b7995c9ada",
  },

  // Prices in ADA for Preview testnet
  pricing: {
    nftPriceAda: 10,
    pagnePriceAda: 5,
    sndjClaimAmount: 100,
  },
} as const;

export function getCurrentNetwork() {
  return blockchainConfig.networks[blockchainConfig.network];
}

export function getExplorerTxUrl(txHash: string) {
  return `${getCurrentNetwork().explorerUrl}/transaction/${txHash}`;
}

export function getExplorerAddressUrl(address: string) {
  return `${getCurrentNetwork().explorerUrl}/address/${address}`;
}

export function stringToHex(str: string): string {
  return Buffer.from(str, "utf-8").toString("hex");
}

/** Full asset unit = policyId + hex(assetName) */
export function getSndjUnit(): string {
  return blockchainConfig.token.policyId + stringToHex(blockchainConfig.token.assetName);
}

export function getNftUnit(assetName: string): string {
  return blockchainConfig.nft.policyId + stringToHex(assetName);
}