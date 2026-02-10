// src/services/blockfrost.ts
// ============================================
// Blockfrost REST API (SERVER-SIDE ONLY)
// No external dependencies — pure fetch
// ============================================

import { getCurrentNetwork } from "@/config/blockchain";

const API_KEY = process.env.BLOCKFROST_API_KEY!;

function baseUrl() {
  return getCurrentNetwork().blockfrostUrl;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    headers: { project_id: API_KEY },
    next: { revalidate: 0 }, // No cache for blockchain queries
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Blockfrost GET ${path} [${res.status}]: ${body}`);
  }
  return res.json();
}

async function post<T>(path: string, body: string | Uint8Array, contentType = "application/json"): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    method: "POST",
    headers: {
      project_id: API_KEY,
      "Content-Type": contentType,
    },
    body: body instanceof Uint8Array ? Buffer.from(body) : body,
  });
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Blockfrost POST ${path} [${res.status}]: ${errorBody}`);
  }
  return res.json();
}

// ============================================
// ADDRESS
// ============================================

export interface AddressAmount {
  unit: string;
  quantity: string;
}

export async function getAddressInfo(address: string) {
  return get<{
    address: string;
    amount: AddressAmount[];
    stake_address: string | null;
    type: string;
  }>(`/addresses/${address}`);
}

export async function getAddressUtxos(address: string) {
  return get<
    {
      tx_hash: string;
      tx_index: number;
      output_index: number;
      amount: AddressAmount[];
      block: string;
      data_hash: string | null;
    }[]
  >(`/addresses/${address}/utxos`);
}

// ============================================
// ASSETS
// ============================================

export async function getAssetInfo(unit: string) {
  return get<{
    asset: string;
    policy_id: string;
    asset_name: string;
    fingerprint: string;
    quantity: string;
    onchain_metadata: any;
  }>(`/assets/${unit}`);
}

export async function getAssetsByPolicy(policyId: string) {
  return get<{ asset: string; quantity: string }[]>(`/assets/policy/${policyId}`);
}

export async function getAddressAssets(address: string) {
  try {
    const info = await getAddressInfo(address);
    return info.amount.filter((a) => a.unit !== "lovelace");
  } catch {
    return [];
  }
}

// ============================================
// TRANSACTIONS
// ============================================

export async function getTransaction(txHash: string) {
  return get<any>(`/txs/${txHash}`);
}

export async function getTransactionUtxos(txHash: string) {
  return get<{ hash: string; inputs: any[]; outputs: any[] }>(`/txs/${txHash}/utxos`);
}

/**
 * Submit a signed CBOR transaction
 * @param cborHex - The signed transaction in CBOR hex format
 * @returns Transaction hash
 */
export async function submitTransaction(cborHex: string): Promise<string> {
  const bytes = hexToBytes(cborHex);
  const res = await fetch(`${baseUrl()}/tx/submit`, {
    method: "POST",
    headers: {
      project_id: API_KEY,
      "Content-Type": "application/cbor",
    },
    body: Buffer.from(bytes),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Submit TX failed: ${error}`);
  }
  // Blockfrost returns the txHash as a quoted JSON string
  const hash = await res.json();
  return typeof hash === "string" ? hash : hash.toString();
}

// ============================================
// PROTOCOL PARAMETERS
// ============================================

export async function getProtocolParameters() {
  return get<{
    min_fee_a: number;
    min_fee_b: number;
    max_block_size: number;
    max_tx_size: number;
    key_deposit: string;
    pool_deposit: string;
    min_utxo: string;
    coins_per_utxo_size: string;
    price_mem: number;
    price_step: number;
    collateral_percent: number;
  }>("/epochs/latest/parameters");
}

// ============================================
// HELPERS
// ============================================

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
