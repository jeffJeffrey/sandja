import { NextRequest, NextResponse } from "next/server";
import {
  getAddressInfo,
  getAssetInfo,
  getWalletBalance,
} from "@/services/blockfrost";
import { blockchainConfig, getSndjUnit } from "@/config/blockchain";
import { BlockfrostServerError } from "@blockfrost/blockfrost-js";

/**
 * GET /api/wallet-assets?address=xxx
 * Fetch real blockchain assets for a connected wallet.
 */
export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get("address");
    if (!address) {
      return NextResponse.json({ error: "address requis" }, { status: 400 });
    }

    const balance = await getWalletBalance(address);

    const nftsWithMetadata = await Promise.all(
      balance.nfts.map(async (nft) => {
        try {
          const info = await getAssetInfo(nft.unit);
          return {
            unit: nft.unit,
            quantity: nft.quantity,
            policyId: info.policy_id,
            assetName: hexToString(info.asset_name || ""),
            fingerprint: info.fingerprint,
            metadata: info.onchain_metadata,
          };
        } catch {
          return {
            unit: nft.unit,
            quantity: nft.quantity,
            policyId: blockchainConfig.nft.policyId,
            assetName: hexToString(nft.unit.slice(blockchainConfig.nft.policyId.length)),
          };
        }
      })
    );

    return NextResponse.json({
      address,
      ada: balance.ada.toFixed(2),
      adaFormatted: formatAda(balance.lovelace),
      lovelace: balance.lovelace,
      sndj: balance.sndj,
      nfts: nftsWithMetadata,
      otherAssets: balance.otherAssets,
      totalAssets: nftsWithMetadata.length + balance.otherAssets.length,
    });
  } catch (error: any) {
    console.error("Wallet assets error:", error);
    if (error instanceof BlockfrostServerError && error.status_code === 404) {
      const addr = request.nextUrl.searchParams.get("address") || "";
      return NextResponse.json({
        address: addr,
        ada: "0",
        adaFormatted: "0.00",
        lovelace: "0",
        sndj: "0",
        nfts: [],
        otherAssets: [],
        totalAssets: 0,
      });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function hexToString(hex: string): string {
  if (!hex) return "";
  try {
    const bytes = Buffer.from(hex, "hex");
    return bytes.toString("utf-8").replace(/[^\x20-\x7E]/g, "");
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