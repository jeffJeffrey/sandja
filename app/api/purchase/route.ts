// app/api/purchase/route.ts
// ============================================
// Purchase API Route
// POST: Build transaction params for purchase
// GET: Verify a purchase transaction
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { buildPurchaseParams } from "@/services/transaction-builder";
import { getTransaction, getTransactionUtxos } from "@/services/blockfrost";
import { blockchainConfig } from "@/config/blockchain";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buyerAddress, itemType, itemId, priceAda } = body;

    if (!buyerAddress || !itemType || !itemId) {
      return NextResponse.json(
        { error: "Missing required fields: buyerAddress, itemType, itemId" },
        { status: 400 }
      );
    }

    // Determine price
    const price =
      priceAda ||
      (itemType === "nft"
        ? blockchainConfig.pricing.nftPriceAda
        : blockchainConfig.pricing.pagnePriceAda);

    // Build transaction parameters
    const txParams = await buildPurchaseParams({
      buyerAddress,
      itemType,
      itemId,
      priceAda: price,
    });

    return NextResponse.json({
      success: true,
      transaction: txParams,
      instructions: {
        step1: "Use CIP-30 wallet to build transaction with these params",
        step2: "Send the lovelaceAmount to the sellerAddress",
        step3: "Sign with wallet.signTx()",
        step4: "Submit with wallet.submitTx()",
        step5: "Call GET /api/purchase?txHash=xxx to verify",
      },
    });
  } catch (error: any) {
    console.error("Purchase API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to build purchase transaction" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/purchase?txHash=xxx
 * Verify that a purchase transaction was successful
 */
export async function GET(request: NextRequest) {
  try {
    const txHash = request.nextUrl.searchParams.get("txHash");

    if (!txHash) {
      return NextResponse.json({ error: "Missing txHash parameter" }, { status: 400 });
    }

    // Query Blockfrost for the transaction
    const tx = await getTransaction(txHash);
    const utxos = await getTransactionUtxos(txHash);

    // Check if payment went to seller
    const sellerAddress = blockchainConfig.sellerAddress;
    const sellerOutput = utxos.outputs.find(
      (o: any) => o.address === sellerAddress
    );

    if (!sellerOutput) {
      return NextResponse.json({
        verified: false,
        message: "Payment not found to seller address",
      });
    }

    const adaPaid =
      Number(
        sellerOutput.amount.find((a: any) => a.unit === "lovelace")?.quantity || "0"
      ) / 1_000_000;

    return NextResponse.json({
      verified: true,
      txHash,
      adaPaid,
      block: tx.block,
      confirmations: tx.block_height ? "confirmed" : "pending",
      explorerUrl: `${blockchainConfig.networks.preview.explorerUrl}/transaction/${txHash}`,
    });
  } catch (error: any) {
    // If tx not found yet, it might be pending
    if (error.message?.includes("404")) {
      return NextResponse.json({
        verified: false,
        message: "Transaction not yet confirmed. Please wait a moment.",
        pending: true,
      });
    }
    return NextResponse.json(
      { error: error.message || "Failed to verify transaction" },
      { status: 500 }
    );
  }
}
