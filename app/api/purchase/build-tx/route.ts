// app/api/purchase/build-tx/route.ts
// ============================================
// Build an unsigned transaction using Blockfrost SDK
// to get UTxOs + protocol params, then calls
// Blockfrost's /tx/build REST endpoint for CBOR.
// ============================================

import { NextRequest, NextResponse } from "next/server";
import {
  getAddressUtxos,
  checkSufficientFunds,
  getBlockfrostApi,
} from "@/services/blockfrost";
import { getCurrentNetwork } from "@/config/blockchain";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderAddress, sellerAddress, lovelaceAmount, message } = body;

    if (!senderAddress || !sellerAddress || !lovelaceAmount) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    // 1. Check funds with Blockfrost SDK
    const requiredAda = Number(lovelaceAmount) / 1_000_000;
    const fundsCheck = await checkSufficientFunds(senderAddress, requiredAda);

    if (!fundsCheck.sufficient) {
      return NextResponse.json(
        {
          error: `Fonds insuffisants. Nécessaire: ~${fundsCheck.requiredAda.toFixed(2)} ADA, Disponible: ${fundsCheck.currentAda.toFixed(2)} ADA. Utilisez le faucet Cardano Preview pour obtenir des tADA.`,
          faucetUrl: getCurrentNetwork().faucetUrl,
        },
        { status: 400 }
      );
    }

    // 2. Get UTxOs via SDK
    const utxos = await getAddressUtxos(senderAddress);

    if (!utxos.length) {
      return NextResponse.json(
        { error: "Aucun UTxO disponible. Ajoutez des tADA via le faucet." },
        { status: 400 }
      );
    }

    // 3. Build tx inputs (use first 5 UTxOs max)
    const inputs = utxos.slice(0, 5).map((utxo) => ({
      address: senderAddress,
      tx_hash: utxo.tx_hash,
      tx_index: utxo.output_index,
    }));

    // 4. Build the payload for Blockfrost /tx/build
    const txBuildPayload: any = {
      inputs,
      outputs: [
        {
          address: sellerAddress,
          amount: [{ unit: "lovelace", quantity: lovelaceAmount }],
        },
      ],
      change_address: senderAddress,
    };

    if (message) {
      txBuildPayload.metadata = { "674": { msg: [message] } };
    }

    // 5. Call Blockfrost tx/build via the SDK's internal API URL
    const api = getBlockfrostApi();
    const apiUrl = (api as any).apiUrl || `https://cardano-${process.env.NEXT_PUBLIC_CARDANO_NETWORK || "preview"}.blockfrost.io/api/v0`;

    const buildRes = await fetch(`${apiUrl}/tx/build`, {
      method: "POST",
      headers: {
        project_id: process.env.BLOCKFROST_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(txBuildPayload),
    });

    if (!buildRes.ok) {
      const errorText = await buildRes.text();
      console.error("Blockfrost tx/build error:", buildRes.status, errorText);

      // Fallback: return manual payment instructions
      return NextResponse.json({
        fallback: true,
        manualTx: {
          sellerAddress,
          lovelaceAmount,
          adaAmount: requiredAda,
          instructions: [
            "Ouvrez votre wallet Cardano",
            `Envoyez ${requiredAda} ADA à:`,
            sellerAddress,
          ],
        },
      });
    }

    const buildData = await buildRes.json();

    return NextResponse.json({
      unsignedTxCbor: buildData.tx || buildData,
      estimatedFee: buildData.fee || "200000",
      inputCount: inputs.length,
    });
  } catch (error: any) {
    console.error("Build TX error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
