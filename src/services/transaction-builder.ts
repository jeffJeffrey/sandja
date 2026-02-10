// src/services/transaction-builder.ts
// ============================================
// Transaction Builder (SERVER-SIDE)
// Builds unsigned transactions using Blockfrost
// The user's CIP-30 wallet signs them client-side
// ============================================

// import { getAddressUtxos, getProtocolParameters } from "./blockfrost";
import { blockchainConfig, stringToHex } from "@/config/blockchain";

// ============================================
// TYPES
// ============================================

export interface TxOutput {
  address: string;
  lovelace: string;
  assets?: { policyId: string; assetName: string; quantity: string }[];
}

export interface BuildTxRequest {
  /** Buyer's address (bech32) — provides the UTxOs and pays */
  senderAddress: string;
  /** Where to send ADA/tokens */
  outputs: TxOutput[];
  /** Optional metadata (CIP-25 for NFTs) */
  metadata?: Record<string, any>;
}

export interface BuildTxResponse {
  /** Unsigned transaction CBOR hex — to be signed by CIP-30 wallet */
  unsignedTx: string;
  /** Estimated fee in lovelace */
  estimatedFee: string;
  /** Transaction hash (before signing) */
  txHash: string;
}

// ============================================
// BUILD PURCHASE TRANSACTION
// Uses Blockfrost to get UTxOs and protocol params,
// then constructs a simple payment transaction.
//
// For Preview testnet: simple ADA transfer from buyer to seller.
// The "NFT delivery" is handled by NMKR or manual transfer.
// ============================================

/**
 * Build a simple ADA payment transaction.
 * Returns the data needed by the client to build+sign via CIP-30.
 *
 * NOTE: On Cardano, the wallet (CIP-30) handles transaction building
 * when we use the signTx flow. What we actually need is to tell the
 * frontend WHAT to build. The CIP-30 wallet does the UTXO selection
 * and fee calculation internally.
 *
 * So our API returns the parameters, and the client builds with CIP-30.
 */
export async function buildPurchaseParams(params: {
  buyerAddress: string;
  itemType: "nft" | "pagne";
  itemId: string;
  priceAda: number;
}) {
  const { buyerAddress, itemType, itemId, priceAda } = params;
  const sellerAddress = blockchainConfig.sellerAddress;
  const lovelaceAmount = (priceAda * 1_000_000).toString();

  // Return the transaction parameters for the client to build
  return {
    sellerAddress,
    lovelaceAmount,
    priceAda,
    itemType,
    itemId,
    metadata: {
      label: "674", // CIP-20 Transaction message
      message: `SANDJA ${itemType.toUpperCase()} Purchase: ${itemId}`,
    },
  };
}

/**
 * Build SNDJ token claim parameters.
 * For preview: the platform wallet sends SNDJ tokens to the claimer.
 * This requires the platform wallet to sign (not the user).
 * For now, we record the claim and the admin sends manually.
 */
export async function buildSndjClaimParams(params: {
  claimerAddress: string;
  amount: number;
}) {
  const { claimerAddress, amount } = params;
  const policyId = blockchainConfig.token.policyId;
  const assetNameHex = stringToHex(blockchainConfig.token.assetName);

  return {
    claimerAddress,
    amount,
    policyId,
    assetNameHex,
    assetUnit: policyId + assetNameHex,
    // Min ADA that must accompany token transfer
    minLovelace: "2000000",
  };
}
