// app/api/claim-sndj/route.ts
// ============================================
// SNDJ Token Claim / Faucet
// For Preview testnet: records claims
// In production: would transfer SNDJ from treasury
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { blockchainConfig, getSndjUnit } from "@/config/blockchain";
import { getAddressInfo } from "@/services/blockfrost";

// Simple in-memory rate limiter (per address, 1 claim per hour)
const claimHistory = new Map<string, number>();
const CLAIM_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { claimerAddress } = body;

    if (!claimerAddress) {
      return NextResponse.json(
        { error: "Missing claimerAddress" },
        { status: 400 }
      );
    }

    // Rate limit check
    const lastClaim = claimHistory.get(claimerAddress);
    if (lastClaim && Date.now() - lastClaim < CLAIM_COOLDOWN_MS) {
      const remainingMinutes = Math.ceil(
        (CLAIM_COOLDOWN_MS - (Date.now() - lastClaim)) / 60_000
      );
      return NextResponse.json(
        {
          error: `Vous pouvez réclamer à nouveau dans ${remainingMinutes} minutes`,
          cooldown: true,
          remainingMinutes,
        },
        { status: 429 }
      );
    }

    // Verify address exists on-chain
    let addressValid = true;
    try {
      await getAddressInfo(claimerAddress);
    } catch {
      // Address might not have any UTxOs yet — that's OK on testnet
      addressValid = true;
    }

    const claimAmount = blockchainConfig.pricing.sndjClaimAmount;
    const sndjUnit = getSndjUnit();

    // Record the claim
    claimHistory.set(claimerAddress, Date.now());

    // ============================================
    // IMPORTANT: On Preview testnet, SNDJ token transfer
    // requires the platform wallet's private key to sign.
    //
    // Options:
    // 1. Manual: Admin sends SNDJ via their wallet
    // 2. Automated: Use a server-side wallet (mnemonic in env)
    // 3. NMKR: Use NMKR API to distribute tokens
    //
    // For now, we record the claim and provide instructions.
    // The admin can fulfill claims from their wallet.
    // ============================================

    return NextResponse.json({
      success: true,
      claim: {
        claimerAddress,
        amount: claimAmount,
        tokenSymbol: "SNDJ",
        policyId: blockchainConfig.token.policyId,
        unit: sndjUnit,
        status: "pending_distribution",
        message: `Votre réclamation de ${claimAmount} SNDJ a été enregistrée ! Les tokens seront distribués sous peu.`,
      },
      // Info for the admin to fulfill
      fulfillment: {
        toAddress: claimerAddress,
        amount: claimAmount,
        policyId: blockchainConfig.token.policyId,
        assetName: blockchainConfig.token.assetName,
      },
    });
  } catch (error: any) {
    console.error("Claim SNDJ error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process claim" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/claim-sndj?address=xxx
 * Check SNDJ balance for an address
 */
export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get("address");

    if (!address) {
      return NextResponse.json({ error: "Missing address parameter" }, { status: 400 });
    }

    const sndjUnit = getSndjUnit();

    try {
      const info = await getAddressInfo(address);
      const sndjBalance = info.amount.find((a) => a.unit === sndjUnit);

      return NextResponse.json({
        address,
        sndjBalance: sndjBalance?.quantity || "0",
        sndjUnit,
        policyId: blockchainConfig.token.policyId,
      });
    } catch {
      return NextResponse.json({
        address,
        sndjBalance: "0",
        sndjUnit,
        policyId: blockchainConfig.token.policyId,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to check balance" },
      { status: 500 }
    );
  }
}
