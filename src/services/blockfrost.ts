

import { BlockFrostAPI, BlockfrostServerError } from "@blockfrost/blockfrost-js";
import { blockchainConfig, getSndjUnit } from "@/config/blockchain";

let _api: BlockFrostAPI | null = null;

export function getBlockfrostApi(): BlockFrostAPI {
  if (!_api) {
    const projectId = process.env.BLOCKFROST_API_KEY;
    if (!projectId) {
      throw new Error("BLOCKFROST_API_KEY is not set in environment variables");
    }
    _api = new BlockFrostAPI({
      projectId,
      network: blockchainConfig.network, 
    });
  }
  return _api;
}



export async function checkHealth() {
  const api = getBlockfrostApi();
  const health = await api.health();
  const clock = await api.healthClock();
  return { healthy: health.is_healthy, serverTime: clock.server_time };
}



export async function getAddressInfo(address: string) {
  const api = getBlockfrostApi();
  try {
    return await api.addresses(address);
  } catch (error) {
    if (error instanceof BlockfrostServerError && error.status_code === 404) {
      return {
        address,
        amount: [{ unit: "lovelace", quantity: "0" }],
        stake_address: null,
        type: "shelley",
        script: false,
      };
    }
    throw error;
  }
}

export async function getAddressUtxos(address: string) {
  const api = getBlockfrostApi();
  try {
    return await api.addressesUtxosAll(address);
  } catch (error) {
    if (error instanceof BlockfrostServerError && error.status_code === 404) {
      return [];
    }
    throw error;
  }
}

export async function getAddressExtended(address: string) {
  const api = getBlockfrostApi();
  try {
    return await api.addressesExtended(address);
  } catch (error) {
    if (error instanceof BlockfrostServerError && error.status_code === 404) {
      return null;
    }
    throw error;
  }
}

export async function getAddressTransactions(address: string) {
  const api = getBlockfrostApi();
  try {
    return await api.addressesTransactions(address, { order: "desc", count: 20 });
  } catch (error) {
    if (error instanceof BlockfrostServerError && error.status_code === 404) {
      return [];
    }
    throw error;
  }
}


export async function getAssetInfo(unit: string) {
  const api = getBlockfrostApi();
  return api.assetsById(unit);
}

export async function getAssetsByPolicy(policyId: string) {
  const api = getBlockfrostApi();
  try {
    return await api.assetsPolicyById(policyId);
  } catch (error) {
    if (error instanceof BlockfrostServerError && error.status_code === 404) {
      return [];
    }
    throw error;
  }
}



export async function getTransaction(txHash: string) {
  const api = getBlockfrostApi();
  return api.txs(txHash);
}

export async function getTransactionUtxos(txHash: string) {
  const api = getBlockfrostApi();
  return api.txsUtxos(txHash);
}

export async function getTransactionMetadata(txHash: string) {
  const api = getBlockfrostApi();
  try {
    return await api.txsMetadata(txHash);
  } catch (error) {
    if (error instanceof BlockfrostServerError && error.status_code === 404) {
      return [];
    }
    throw error;
  }
}


export async function submitTransaction(signedTxCbor: string): Promise<string> {
  const api = getBlockfrostApi();
  return api.txSubmit(signedTxCbor);
}


export async function getProtocolParameters() {
  const api = getBlockfrostApi();
  return api.epochsLatestParameters();
}

export async function getLatestBlock() {
  const api = getBlockfrostApi();
  return api.blocksLatest();
}

export async function getNetworkInfo() {
  const api = getBlockfrostApi();
  return api.network();
}


export async function getWalletBalance(address: string) {
  const info = await getAddressInfo(address);
  const lovelace = info.amount.find((a) => a.unit === "lovelace")?.quantity || "0";
  const ada = Number(BigInt(lovelace)) / 1_000_000;

  const sndjUnit = getSndjUnit();
  const sndj = info.amount.find((a) => a.unit === sndjUnit)?.quantity || "0";

  const nftPolicyId = blockchainConfig.nft.policyId;
  const nfts = info.amount.filter(
    (a) => a.unit !== "lovelace" && a.unit !== sndjUnit && a.unit.startsWith(nftPolicyId)
  );

  const otherAssets = info.amount.filter(
    (a) =>
      a.unit !== "lovelace" &&
      a.unit !== sndjUnit &&
      !a.unit.startsWith(nftPolicyId)
  );

  return { lovelace, ada, sndj, nfts, otherAssets };
}


export async function checkSufficientFunds(address: string, requiredAda: number) {
  const { ada } = await getWalletBalance(address);
  const requiredWithFees = requiredAda + 2; // 2 ADA buffer for fees
  return {
    sufficient: ada >= requiredWithFees,
    currentAda: ada,
    requiredAda: requiredWithFees,
    deficit: Math.max(0, requiredWithFees - ada),
  };
}