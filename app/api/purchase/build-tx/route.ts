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

export async function POST(request: NextRequest) {
  let sellerAddress: string | undefined;
  let lovelaceAmount: number | string | undefined;
  let requiredAda: number | undefined;
  try {
    const body = await request.json();
    const { senderAddress, sellerAddress: sellerAddr, lovelaceAmount: lovelaceAmt, message } = body;
    sellerAddress = sellerAddr;
    lovelaceAmount = lovelaceAmt;
    if (!senderAddress || !sellerAddress || !lovelaceAmount) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    // 1. Check funds with Blockfrost SDK
    requiredAda = Number(lovelaceAmount) / 1_000_000;
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

    // 3. Dynamic import Lucid to avoid ESM issues in Next.js build
    const { Lucid, Blockfrost: LucidBlockfrost } = await import("lucid-cardano");

    // 4. Initialize Lucid with Blockfrost provider
    const api = getBlockfrostApi();
    const apiUrl = (api as any).apiUrl || 'https://cardano-preview.blockfrost.io/api/v0';
    const projectId = process.env.BLOCKFROST_API_KEY;
    if (!projectId) {
      throw new Error("BLOCKFROST_API_KEY is not set");
    }
    const lucid = await Lucid.new(
      new LucidBlockfrost(apiUrl, projectId),
      "Preview"
    );

    // 5. Convert Blockfrost UTxOs to Lucid UTxOs (use first 5 max)
    const selectedUtxos = utxos.slice(0, 5).map((utxo) => ({
      txHash: utxo.tx_hash,
      outputIndex: utxo.tx_index,
      assets: utxo.amount.reduce((acc: { [key: string]: bigint }, a) => {
        acc[a.unit] = BigInt(a.quantity);
        return acc;
      }, {}),
      address: utxo.address,
      datumHash: utxo.data_hash || undefined,
      datum: utxo.inline_datum || undefined,
      scriptRef: utxo.reference_script_hash
        ? { type: "PlutusV1" as const, script: "" }
        : undefined, // Simplified, adjust if needed
    }));

    // 6. Build the transaction with Lucid
    lucid.selectWalletFrom({ address: senderAddress, utxos: selectedUtxos });
    let tx = lucid.newTx()
      .payToAddress(sellerAddress, { lovelace: BigInt(lovelaceAmount) });

    if (message) {
      tx = tx.attachMetadata(674, { msg: [message] });
    }

    const txComplete = await tx.complete({
      change: { address: senderAddress },
    });

    // 7. Get unsigned CBOR and estimated fee
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
      error: error.message,
    }, { status: 500 });
  }
}
