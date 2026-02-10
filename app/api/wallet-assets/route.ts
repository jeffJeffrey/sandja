// app/api/wallet-assets/route.ts
// ============================================
// Wallet Assets API
// Fetches real blockchain data for a wallet
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { getAddressInfo, getAssetInfo, getAssetsByPolicy } from "@/services/blockfrost";
import { blockchainConfig, getSndjUnit } from "@/config/blockchain";

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get("address");

    if (!address) {
      return NextResponse.json({ error: "Missing address parameter" }, { status: 400 });
    }

    // Fetch address info from Blockfrost
    let addressInfo;
    try {
      addressInfo = await getAddressInfo(address);
    } catch (error: any) {
      // Address has no UTxOs (empty wallet)
      if (error.message?.includes("404")) {
        return NextResponse.json({
          address,
          ada: "0",
          adaFormatted: "0.00",
          sndj: "0",
          nfts: [],
          assets: [],
        });
      }
      throw error;
    }

    // Parse balances
    const lovelace = addressInfo.amount.find((a) => a.unit === "lovelace")?.quantity || "0";
    const ada = (Number(BigInt(lovelace)) / 1_000_000).toFixed(2);

    // SNDJ balance
    const sndjUnit = getSndjUnit();
    const sndjBalance = addressInfo.amount.find((a) => a.unit === sndjUnit)?.quantity || "0";

    // NFTs from our collection
    const nftPolicyId = blockchainConfig.nft.policyId;
    const nfts: any[] = [];
    const otherAssets: any[] = [];

    for (const asset of addressInfo.amount) {
      if (asset.unit === "lovelace") continue;
      if (asset.unit === sndjUnit) continue;

      // Check if it's one of our NFTs
      if (asset.unit.startsWith(nftPolicyId)) {
        try {
          const assetDetail = await getAssetInfo(asset.unit);
          nfts.push({
            unit: asset.unit,
            quantity: asset.quantity,
            policyId: assetDetail.policy_id,
            assetName: hexToString(assetDetail.asset_name || ""),
            fingerprint: assetDetail.fingerprint,
            metadata: assetDetail.onchain_metadata,
          });
        } catch {
          nfts.push({
            unit: asset.unit,
            quantity: asset.quantity,
            policyId: nftPolicyId,
            assetName: hexToString(asset.unit.slice(nftPolicyId.length)),
          });
        }
      } else {
        otherAssets.push({
          unit: asset.unit,
          quantity: asset.quantity,
        });
      }
    }

    return NextResponse.json({
      address,
      ada,
      adaFormatted: formatAda(lovelace),
      lovelace,
      sndj: sndjBalance,
      nfts,
      otherAssets,
      totalAssets: addressInfo.amount.length - 1, // exclude lovelace
    });
  } catch (error: any) {
    console.error("Wallet assets error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch wallet assets" },
      { status: 500 }
    );
  }
}

function hexToString(hex: string): string {
  if (!hex) return "";
  try {
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
      const code = parseInt(hex.substring(i, i + 2), 16);
      if (code >= 32 && code <= 126) str += String.fromCharCode(code);
    }
    return str || hex;
  } catch {
    return hex;
  }
}

function formatAda(lovelace: string): string {
  const ada = Number(BigInt(lovelace)) / 1_000_000;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(ada);
}
