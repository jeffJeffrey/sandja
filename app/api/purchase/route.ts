// app/api/purchase/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTransaction, getTransactionUtxos } from "@/services/blockfrost";
import { blockchainConfig, getCurrentNetwork } from "@/config/blockchain";

/**
 * POST /api/purchase
 * Returns transaction parameters for the client to build & sign via CIP-30.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buyerAddress, itemType, itemId, priceAda } = body;

    if (!buyerAddress || !itemType || !itemId) {
      return NextResponse.json(
        { error: "Champs requis: buyerAddress, itemType, itemId" },
        { status: 400 }
      );
    }

    const price =
      priceAda ??
      (itemType === "nft"
        ? blockchainConfig.pricing.nftPriceAda
        : blockchainConfig.pricing.pagnePriceAda);

    const sellerAddress = blockchainConfig.sellerAddress;
    const lovelaceAmount = String(price * 1_000_000);

    return NextResponse.json({
      success: true,
      transaction: {
        sellerAddress,
        lovelaceAmount,
        priceAda: price,
        itemType,
        itemId,
        message: `SANDJA ${itemType.toUpperCase()} Purchase: ${itemId}`,
      },
    });
  } catch (error: any) {
    console.error("Purchase API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/purchase?txHash=xxx
 * Verify a purchase transaction on-chain.
 */
export async function GET(request: NextRequest) {
  try {
    const txHash = request.nextUrl.searchParams.get("txHash");
    if (!txHash) {
      return NextResponse.json({ error: "Missing txHash" }, { status: 400 });
    }

    const tx = await getTransaction(txHash);
    const utxos = await getTransactionUtxos(txHash);

    const sellerAddress = blockchainConfig.sellerAddress;
    const sellerOutput = utxos.outputs.find((o) => o.address === sellerAddress);

    if (!sellerOutput) {
      return NextResponse.json({ verified: false, message: "Paiement non trouvé" });
    }

    const adaPaid =
      Number(sellerOutput.amount.find((a) => a.unit === "lovelace")?.quantity || "0") /
      1_000_000;

    return NextResponse.json({
      verified: true,
      txHash,
      adaPaid,
      block: tx.block,
      slot: tx.slot,
      explorerUrl: `${getCurrentNetwork().explorerUrl}/transaction/${txHash}`,
    });
  } catch (error: any) {
    if (error?.status_code === 404 || error?.message?.includes("404")) {
      return NextResponse.json({
        verified: false,
        pending: true,
        message: "Transaction pas encore confirmée. Patientez un moment.",
      });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
