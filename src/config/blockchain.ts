// src/config/blockchain.ts

export type CardanoNetwork = "preview" | "preprod" | "mainnet";

export const blockchainConfig = {
  network: (process.env.NEXT_PUBLIC_CARDANO_NETWORK || "preview") as CardanoNetwork,

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
    decimals: 6,
    policyId: process.env.NEXT_PUBLIC_SANDJA_POLICY_ID || "",
    logo: "/images/token/sandja-coin.svg",
    description: {
      fr: "Token natif de l'écosystème SANDJA pour récompenser les contributions culturelles",
      en: "Native token of the SANDJA ecosystem to reward cultural contributions",
    },
  },

  nft: {
    collection: {
      name: "SANDJA Pagnes Collection",
      policyId: process.env.NEXT_PUBLIC_NFT_POLICY_ID || "",
      description: {
        fr: "Collection de pagnes africains certifiés et numérisés",
        en: "Collection of certified and digitized African cloths",
      },
    },
    metadataStandard: "CIP-25" as const,
    ipfs: {
      gateway: "https://ipfs.io/ipfs/",
      pinataApiUrl: "https://api.pinata.cloud",
      nftStorageUrl: "https://api.nft.storage",
    },
    royalties: {
      creator: 5,
      platform: 2.5,
      community: 2.5,
    },
  },

  supportedWallets: [
    {
      id: "nami",
      name: "Nami",
      icon: "/images/wallets/nami.svg",
      downloadUrl: "https://namiwallet.io",
    },
    {
      id: "eternl",
      name: "Eternl",
      icon: "/images/wallets/eternl.svg",
      downloadUrl: "https://eternl.io",
    },
    {
      id: "flint",
      name: "Flint",
      icon: "/images/wallets/flint.svg",
      downloadUrl: "https://flint-wallet.com",
    },
    {
      id: "yoroi",
      name: "Yoroi",
      icon: "/images/wallets/yoroi.svg",
      downloadUrl: "https://yoroi-wallet.com",
    },
    {
      id: "lace",
      name: "Lace",
      icon: "/images/wallets/lace.svg",
      downloadUrl: "https://www.lace.io",
    },
  ],

  fees: {
    minFee: 0.17,
    nftMint: 2,
    marketplaceListing: 1,
    tokenTransfer: 0.2,
  },

  contracts: {
    marketplace: {
      address: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT || "",
      scriptHash: "",
    },
    ticketing: {
      address: process.env.NEXT_PUBLIC_TICKETING_CONTRACT || "",
      scriptHash: "",
    },
    rewards: {
      address: process.env.NEXT_PUBLIC_REWARDS_CONTRACT || "",
      scriptHash: "",
    },
  },
} as const;

// ============================================
// TYPES
// ============================================

export interface WalletInfo {
  id: string;
  name: string;
  icon: string;
  downloadUrl: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  mediaType: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  sandja: {
    pagneId?: string;
    designId?: string;
    symbolIds?: string[];
    regionId?: string;
    ceremonyType?: string;
    artisanId?: string;
    createdAt: string;
    edition?: number;
    maxEdition?: number;
  };
}

export function getCurrentNetworkConfig() {
  const network = blockchainConfig.network;
  return blockchainConfig.networks[network];
}