// app/api/purchase/build-tx/route.ts
// ============================================
// Build Transaction API
// Constructs an unsigned CBOR transaction
// using Blockfrost UTxO data.
//
// This uses the Blockfrost "tx/build" endpoint
// which is a transaction builder that returns
// unsigned CBOR ready for CIP-30 signing.
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { getAddressUtxos, getProtocolParameters } from "@/services/blockfrost";
import { getCurrentNetwork, blockchainConfig, stringToHex } from "@/config/blockchain";

const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderAddress, sellerAddress, lovelaceAmount, message } = body;

    if (!senderAddress || !sellerAddress || !lovelaceAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get sender's UTxOs from Blockfrost
    let utxos;
    try {
      utxos = await getAddressUtxos(senderAddress);
    } catch (error: any) {
      if (error.message?.includes("404")) {
        return NextResponse.json(
          { error: "Votre wallet n'a pas de fonds. Utilisez le faucet Cardano pour obtenir des tADA." },
          { status: 400 }
        );
      }
      throw error;
    }

    if (!utxos || utxos.length === 0) {
      return NextResponse.json(
        { error: "Pas de UTxO disponibles. Ajoutez des tADA via le faucet." },
        { status: 400 }
      );
    }

    // Check if sender has enough ADA
    const totalLovelace = utxos.reduce((sum: bigint, utxo: any) => {
      const lovelace = utxo.amount.find((a: any) => a.unit === "lovelace");
      return sum + BigInt(lovelace?.quantity || "0");
    }, BigInt(0));

    const requiredLovelace = BigInt(lovelaceAmount) + BigInt(2_000_000); // amount + fees buffer
    if (totalLovelace < requiredLovelace) {
      const adaNeeded = Number(requiredLovelace) / 1_000_000;
      const adaHave = Number(totalLovelace) / 1_000_000;
      return NextResponse.json(
        {
          error: `Fonds insuffisants. Nécessaire: ~${adaNeeded.toFixed(2)} ADA, Disponible: ${adaHave.toFixed(2)} ADA`,
        },
        { status: 400 }
      );
    }

    // ============================================
    // Use Blockfrost's tx/build endpoint
    // This is the easiest way to build a transaction
    // without any SDK dependencies.
    // ============================================

    const txBuildPayload: any = {
      inputs: utxos.slice(0, 5).map((utxo: any) => ({
        // Use enough UTxOs to cover the amount
        address: senderAddress,
        tx_hash: utxo.tx_hash,
        tx_index: utxo.output_index,
      })),
      outputs: [
        {
          address: sellerAddress,
          amount: [{ unit: "lovelace", quantity: lovelaceAmount }],
        },
      ],
      change_address: senderAddress,
    };

    // Add metadata if provided
    if (message) {
      txBuildPayload.metadata = {
        "674": {
          msg: [message],
        },
      };
    }

    // Call Blockfrost's transaction build endpoint
    const buildUrl = `${getCurrentNetwork().blockfrostUrl}/tx/build`;
    const buildRes = await fetch(buildUrl, {
      method: "POST",
      headers: {
        project_id: BLOCKFROST_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(txBuildPayload),
    });

    if (!buildRes.ok) {
      const errorText = await buildRes.text();
      console.error("Blockfrost tx/build error:", errorText);

      // Fallback: build a simpler transaction
      // If tx/build fails, provide manual instructions
      return NextResponse.json({
        error: null,
        fallback: true,
        manualTx: {
          sellerAddress,
          lovelaceAmount,
          message: "L'endpoint tx/build n'est pas disponible. Utilisez la méthode manuelle.",
          instructions: [
            "Ouvrez votre wallet Cardano",
            `Envoyez ${Number(lovelaceAmount) / 1_000_000} ADA à l'adresse:`,
            sellerAddress,
            `Ajoutez le message: ${message}`,
          ],
        },
      });
    }

    const buildData = await buildRes.json();

    // The response contains the unsigned CBOR transaction
    return NextResponse.json({
      unsignedTxCbor: buildData.tx || buildData,
      estimatedFee: buildData.fee || "200000",
      inputs: txBuildPayload.inputs.length,
    });
  } catch (error: any) {
    console.error("Build TX error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to build transaction" },
      { status: 500 }
    );
  }
}
