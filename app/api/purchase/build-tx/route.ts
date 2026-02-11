// app/api/purchase/build-tx/route.ts
// ============================================
// Build an unsigned transaction using Blockfrost SDK
// to get UTxOs + protocol params, then uses Lucid
// to build the transaction CBOR.
// Note: Requires 'lucid-cardano' package. Install with: npm install lucid-cardano
// ============================================
import { NextRequest, NextResponse } from "next/server";
import {
  getAddressUtxos,
  checkSufficientFunds,
  getBlockfrostApi,
} from "@/services/blockfrost";
import { getCurrentNetwork } from "@/config/blockchain";
import { Lucid, Blockfrost } from "lucid-cardano";

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

    // 3. Initialize Lucid with Blockfrost provider
    const api = getBlockfrostApi();
    const apiUrl = (api as any).apiUrl || 'https://cardano-preview.blockfrost.io/api/v0';
    const projectId = process.env.BLOCKFROST_API_KEY;
    if (!projectId) {
      throw new Error("BLOCKFROST_API_KEY is not set");
    }
    const lucid = await Lucid.new(
      new Blockfrost(apiUrl, projectId),
      "Preview"
    );

    // 4. Convert Blockfrost UTxOs to Lucid UTxOs (use first 5 max)
    const selectedUtxos = utxos.slice(0, 5).map((utxo) => ({
      txHash: utxo.tx_hash,
      outputIndex: utxo.tx_index,
      assets: utxo.amount.reduce((acc: { [key: string]: BigInt }, a) => {
        acc[a.unit] = BigInt(a.quantity);
        return acc;
      }, {}),
      address: senderAddress, // Note: Blockfrost utxo.address may not be needed, but set to sender
      datumHash: utxo.data_hash || undefined,
      datum: utxo.inline_datum || undefined,
      // scriptRef: omitted for simplicity, assume no script UTxOs
    }));

    // 5. Build the transaction with Lucid
    let tx = lucid.newTx()
      .payToAddress(sellerAddress, { lovelace: BigInt(lovelaceAmount) });

    if (message) {
      tx = tx.attachMetadata(674, { msg: [message] });
    }

    const txComplete = await tx.complete({
      change: { address: senderAddress },
      coinSelection: false,
    });

    // 6. Get unsigned CBOR and estimated fee
    const unsignedTxCbor = txComplete.toString();
    const estimatedFee = txComplete.fee.toString();
    const inputCount = txComplete.txComplete.body().inputs().len();

    return NextResponse.json({
      unsignedTxCbor,
      estimatedFee,
      inputCount,
    });
  } catch (error: any) {
    console.error("Build TX error:", error);
    // Fallback: return manual payment instructions
    return NextResponse.json({
      fallback: true,
      manualTx: {
        sellerAddress: error.sellerAddress || '', // Note: may need to adjust
        lovelaceAmount: error.lovelaceAmount || '',
        adaAmount: error.requiredAda || 0,
        instructions: [
          "Ouvrez votre wallet Cardano",
          `Envoyez ${error.requiredAda || ''} ADA à:`,
          error.sellerAddress || '',
        ],
      },
      error: error.message,
    }, { status: 500 });
  }
}