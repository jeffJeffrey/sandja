// src/hooks/usePurchase.ts
// ============================================
// Purchase Hook
// Handles the full purchase flow:
// 1. Get tx params from API
// 2. Build tx with CIP-30 wallet
// 3. Sign & submit
// 4. Verify on-chain
// ============================================

"use client";

import { useState, useCallback } from "react";
import { useCardanoWallet } from "./useCardanoWallet";
import { blockchainConfig, getExplorerTxUrl } from "@/config/blockchain";
import { toast } from "sonner";

export type PurchaseStatus =
  | "idle"
  | "building"
  | "signing"
  | "submitting"
  | "confirming"
  | "success"
  | "error";

export interface PurchaseResult {
  txHash: string;
  explorerUrl: string;
  adaPaid: number;
  itemType: string;
  itemId: string;
}

export function usePurchase() {
  const { walletApi, connected, address } = useCardanoWallet();
  const [status, setStatus] = useState<PurchaseStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PurchaseResult | null>(null);

  /**
   * Purchase an NFT or Pagne
   * The full flow using CIP-30 native API
   */
  const purchase = useCallback(
    async (itemType: "nft" | "pagne", itemId: string, priceAda?: number) => {
      if (!walletApi || !connected) {
        toast.error("Connectez votre wallet d'abord");
        return null;
      }

      setStatus("building");
      setError(null);
      setResult(null);

      try {
        // Step 1: Get transaction parameters from our API
        const res = await fetch("/api/purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            buyerAddress: address,
            itemType,
            itemId,
            priceAda,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to prepare purchase");
        }

        const { transaction } = await res.json();
        const { sellerAddress, lovelaceAmount } = transaction;

        toast.info(`Envoi de ${transaction.priceAda} ADA...`, {
          description: "Veuillez confirmer dans votre wallet",
        });

        // Step 2: Build transaction using CIP-30
        // We use the experimental buildTx if available, otherwise manual approach
        setStatus("signing");

        let txHash: string;

        // Try the simple approach: sendLovelace via wallet API
        // Most CIP-30 wallets support building transactions internally
        // We need to construct a CBOR transaction manually or use the wallet

        // The cleanest approach for CIP-30: use signTx with a manually built tx
        // But since we don't have a CBOR builder, we use the wallet's own capabilities

        // Method: Ask the wallet to build and sign a transaction
        // CIP-30 doesn't have a "build" method, but wallets like Eternl
        // expose it through experimental APIs.
        // The standard approach is to construct CBOR manually.
        // For simplicity on Preview, we'll use a different strategy:
        //
        // We construct the payment via the wallet's signData + submitTx flow.
        // Actually, the simplest way that works with ALL CIP-30 wallets is:
        // Use the Blockfrost API to build the CBOR server-side.

        // Let's use the Blockfrost tx-build endpoint
        const buildRes = await fetch("/api/purchase/build-tx", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderAddress: address,
            sellerAddress,
            lovelaceAmount,
            message: transaction.metadata?.message,
          }),
        });

        if (!buildRes.ok) {
          const err = await buildRes.json();
          throw new Error(err.error || "Failed to build transaction");
        }

        const { unsignedTxCbor } = await buildRes.json();

        // Step 3: Sign with CIP-30 wallet
        const signedTx = await walletApi.signTx(unsignedTxCbor, true);

        // Step 4: Submit via CIP-30 wallet
        setStatus("submitting");
        txHash = await walletApi.submitTx(signedTx);

        // Step 5: Verify
        setStatus("confirming");
        toast.success("Transaction soumise !", {
          description: `TxHash: ${txHash.slice(0, 16)}...`,
        });

        const purchaseResult: PurchaseResult = {
          txHash,
          explorerUrl: getExplorerTxUrl(txHash),
          adaPaid: transaction.priceAda,
          itemType,
          itemId,
        };

        setResult(purchaseResult);
        setStatus("success");

        // Verify after a delay
        setTimeout(async () => {
          try {
            const verifyRes = await fetch(`/api/purchase?txHash=${txHash}`);
            const verifyData = await verifyRes.json();
            if (verifyData.verified) {
              toast.success("Achat confirmé sur la blockchain ! 🎉");
            }
          } catch {
            // Verification will happen eventually
          }
        }, 20_000); // Check after 20 seconds

        return purchaseResult;
      } catch (err: any) {
        const msg = err?.message || "Échec de l'achat";
        setError(msg);
        setStatus("error");

        // User rejected in wallet
        if (msg.includes("declined") || msg.includes("cancel") || msg.includes("refuse")) {
          toast.error("Transaction annulée", {
            description: "Vous avez refusé la transaction dans votre wallet",
          });
        } else {
          toast.error("Erreur d'achat", { description: msg });
        }
        return null;
      }
    },
    [walletApi, connected, address]
  );

  /**
   * Claim free SNDJ tokens (faucet for preview)
   */
  const claimSndj = useCallback(async () => {
    if (!connected || !address) {
      toast.error("Connectez votre wallet d'abord");
      return null;
    }

    setStatus("building");
    setError(null);

    try {
      const res = await fetch("/api/claim-sndj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimerAddress: address }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Échec de la réclamation");
      }

      setStatus("success");
      toast.success(`${data.claim.amount} SNDJ réclamés !`, {
        description: data.claim.message,
      });

      return data.claim;
    } catch (err: any) {
      const msg = err?.message || "Échec de la réclamation";
      setError(msg);
      setStatus("error");
      toast.error(msg);
      return null;
    }
  }, [connected, address]);

  /**
   * Fetch real wallet assets from blockchain
   */
  const fetchAssets = useCallback(async () => {
    if (!address) return null;

    try {
      const res = await fetch(`/api/wallet-assets?address=${address}`);
      if (!res.ok) throw new Error("Failed to fetch assets");
      return await res.json();
    } catch {
      return null;
    }
  }, [address]);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setResult(null);
  }, []);

  return {
    status,
    error,
    result,
    purchase,
    claimSndj,
    fetchAssets,
    reset,
    isProcessing: ["building", "signing", "submitting", "confirming"].includes(status),
  };
}
