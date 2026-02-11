import { NextRequest, NextResponse } from "next/server";
import { blockchainConfig, getSndjUnit } from "@/config/blockchain";
import { getAddressInfo } from "@/services/blockfrost";

// In-memory rate limiter (1 claim/hour per address)
const claimHistory = new Map<string, number>();
const COOLDOWN_MS = 60 * 60 * 1000;

/**
 * POST /api/claim-sndj
 * Register a SNDJ token claim request.
 */
export async function POST(request: NextRequest) {
  try {
    const { claimerAddress } = await request.json();

    if (!claimerAddress) {
      return NextResponse.json({ error: "claimerAddress requis" }, { status: 400 });
    }

    const lastClaim = claimHistory.get(claimerAddress);
    if (lastClaim && Date.now() - lastClaim < COOLDOWN_MS) {
      const remaining = Math.ceil((COOLDOWN_MS - (Date.now() - lastClaim)) / 60_000);
      return NextResponse.json(
        { error: `Réessayez dans ${remaining} minutes`, cooldown: true, remainingMinutes: remaining },
        { status: 429 }
      );
    }

    claimHistory.set(claimerAddress, Date.now());
    const amount = blockchainConfig.pricing.sndjClaimAmount;

    return NextResponse.json({
      success: true,
      claim: {
        claimerAddress,
        amount,
        tokenSymbol: "SNDJ",
        policyId: blockchainConfig.token.policyId,
        unit: getSndjUnit(),
        status: "pending_distribution",
        message: `${amount} SNDJ réclamés ! Distribution en cours...`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/claim-sndj?address=xxx
 * Check SNDJ balance for an address using Blockfrost SDK.
 */
export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get("address");
    if (!address) {
      return NextResponse.json({ error: "address requis" }, { status: 400 });
    }

    const sndjUnit = getSndjUnit();
    const info = await getAddressInfo(address);
    const balance = info.amount.find((a) => a.unit === sndjUnit)?.quantity || "0";

    return NextResponse.json({ address, sndjBalance: balance, sndjUnit });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}